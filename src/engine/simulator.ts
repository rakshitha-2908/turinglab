import type {
    MultiMachine,
    MultiSnapshot,
    MultiTransition,
    NondetBranch,
    NondetSnapshot,
    SingleMachine,
    SingleSnapshot,
    SingleTransition,
    UniversalSnapshot,
} from '../types/turing'

const clampIndex = (idx: number) => idx

const ensureCell = (tape: string[], index: number, blankSymbol: string): string => {
    if (index < 0) return blankSymbol
    while (index >= tape.length) tape.push(blankSymbol)
    return tape[index] ?? blankSymbol
}

const moveHead = (head: number, move: 'L' | 'R' | 'S') => {
    if (move === 'L') return clampIndex(head - 1)
    if (move === 'R') return head + 1
    return head
}

const singleKey = (state: string, symbol: string) => `${state}|${symbol}`

const multiKey = (state: string, symbols: string[]) => `${state}|${symbols.join(',')}`

export const initializeSingle = (machine: SingleMachine, input: string): SingleSnapshot => {
    const tape = input.length > 0 ? input.split('') : [machine.blankSymbol]
    const currentSymbol = tape[0] ?? machine.blankSymbol

    return {
        state: machine.startState,
        tape,
        head: 0,
        steps: 0,
        halted: false,
        result: 'running',
        currentSymbol,
        lastTransition: 'None',
        explanation: 'Machine initialized and ready to run.',
    }
}

export const stepSingle = (machine: SingleMachine, snapshot: SingleSnapshot): SingleSnapshot => {
    if (snapshot.halted) return snapshot

    const tape = [...snapshot.tape]
    const symbol = ensureCell(tape, snapshot.head, machine.blankSymbol)
    const transitions = machine.transitions[singleKey(snapshot.state, symbol)] ?? []
    const transition = transitions[0]

    if (!transition) {
        return {
            ...snapshot,
            tape,
            currentSymbol: symbol,
            steps: snapshot.steps + 1,
            halted: true,
            result: 'reject',
            lastTransition: `δ(${snapshot.state}, ${symbol}) is undefined`,
            explanation: `No transition is defined for state ${snapshot.state} while reading ${symbol}. The machine halts and rejects.`,
        }
    }

    tape[snapshot.head] = transition.write
    const nextHead = moveHead(snapshot.head, transition.move)
    ensureCell(tape, nextHead, machine.blankSymbol)
    const nextSymbol = tape[nextHead] ?? machine.blankSymbol
    const halted = transition.newState === machine.acceptState || transition.newState === machine.rejectState

    return {
        ...snapshot,
        tape,
        head: nextHead,
        state: transition.newState,
        currentSymbol: nextSymbol,
        steps: snapshot.steps + 1,
        halted,
        result: transition.newState === machine.acceptState ? 'accept' : transition.newState === machine.rejectState ? 'reject' : 'running',
        lastTransition: `δ(${snapshot.state}, ${symbol}) → (${transition.newState}, ${transition.write}, ${transition.move})`,
        explanation: `Reading ${symbol} in state ${snapshot.state}, writing ${transition.write}, moving ${transition.move === 'L' ? 'left' : transition.move === 'R' ? 'right' : 'stay'}, and transitioning to ${transition.newState}.`,
    }
}

export const initializeMulti = (machine: MultiMachine, input: string): MultiSnapshot => {
    const tapes = Array.from({ length: machine.tapesCount }, (_, idx) => {
        if (idx === 0) return input.length ? input.split('') : [machine.blankSymbol]
        return [machine.blankSymbol]
    })

    return {
        state: machine.startState,
        tapes,
        heads: Array.from({ length: machine.tapesCount }, () => 0),
        steps: 0,
        halted: false,
        result: 'running',
        currentSymbols: tapes.map((tape) => tape[0] ?? machine.blankSymbol),
        lastTransition: 'None',
        explanation: 'Multi-tape machine initialized.',
    }
}

export const stepMulti = (machine: MultiMachine, snapshot: MultiSnapshot): MultiSnapshot => {
    if (snapshot.halted) return snapshot

    const tapes = snapshot.tapes.map((t) => [...t])
    const symbols = tapes.map((tape, idx) => ensureCell(tape, snapshot.heads[idx], machine.blankSymbol))
    const transitions = machine.transitions[multiKey(snapshot.state, symbols)] ?? []
    const transition = transitions[0]

    console.log('MultiTape step:', {
        state: snapshot.state,
        symbols,
        heads: snapshot.heads,
        transition,
    })

    if (!transition) {
        return {
            ...snapshot,
            tapes,
            currentSymbols: symbols,
            halted: true,
            result: 'reject',
            steps: snapshot.steps + 1,
            lastTransition: `δ(${snapshot.state}, [${symbols.join(',')}]) is undefined`,
            explanation: `No valid multi-tape transition exists from state ${snapshot.state}. The machine rejects.`,
        }
    }

    const heads = [...snapshot.heads]

    tapes.forEach((tape, idx) => {
        const write = transition.writes[idx] ?? machine.blankSymbol
        const move = transition.moves[idx] ?? 'S'

        tape[heads[idx]] = write

        let nextHead = heads[idx]
        if (move === 'L') nextHead = heads[idx] - 1
        if (move === 'R') nextHead = heads[idx] + 1

        if (nextHead < 0) {
            tape.unshift(machine.blankSymbol)
            nextHead = 0
        }

        ensureCell(tape, nextHead, machine.blankSymbol)
        heads[idx] = nextHead
    })

    const currentSymbols = tapes.map((tape, idx) => tape[heads[idx]] ?? machine.blankSymbol)
    const halted = transition.newState === machine.acceptState || transition.newState === machine.rejectState

    console.log('MultiTape result:', {
        nextState: transition.newState,
        tapes,
        heads,
        currentSymbols,
        halted,
    })

    return {
        ...snapshot,
        state: transition.newState,
        tapes,
        heads,
        currentSymbols,
        steps: snapshot.steps + 1,
        halted,
        result: transition.newState === machine.acceptState ? 'accept' : transition.newState === machine.rejectState ? 'reject' : 'running',
        lastTransition: `δ(${snapshot.state}, [${symbols.join(',')}]) → (${transition.newState}, [${transition.writes.join(',')}], [${transition.moves.join(',')}])`,
        explanation: `Reading [${symbols.join(', ')}], writing [${transition.writes.join(', ')}], moving heads [${transition.moves.join(', ')}], then entering ${transition.newState}.`,
    }
}

const branchStep = (
    machine: SingleMachine,
    branch: NondetBranch,
    idSeed: number,
): { spawned: NondetBranch[]; nextSeed: number } => {
    if (branch.halted) return { spawned: [branch], nextSeed: idSeed }

    const tape = [...branch.tape]
    const symbol = ensureCell(tape, branch.head, machine.blankSymbol)
    const transitions = machine.transitions[singleKey(branch.state, symbol)] ?? []

    if (transitions.length === 0) {
        return {
            spawned: [
                {
                    ...branch,
                    tape,
                    halted: true,
                    result: 'reject',
                    label: `${branch.label} · reject`,
                },
            ],
            nextSeed: idSeed,
        }
    }

    let localSeed = idSeed

    const spawned = transitions.map((transition: SingleTransition) => {
        const nextTape = [...tape]
        nextTape[branch.head] = transition.write
        const nextHead = moveHead(branch.head, transition.move)
        ensureCell(nextTape, nextHead, machine.blankSymbol)
        localSeed += 1
        const halted = transition.newState === machine.acceptState || transition.newState === machine.rejectState
        const result: NondetBranch['result'] = transition.newState === machine.acceptState ? 'accept' : transition.newState === machine.rejectState ? 'reject' : 'running'

        return {
            id: `b-${localSeed}`,
            parentId: branch.id,
            state: transition.newState,
            tape: nextTape,
            head: nextHead,
            depth: branch.depth + 1,
            halted,
            result,
            label: `${branch.state}/${symbol}→${transition.newState}`,
        }
    })

    return { spawned, nextSeed: localSeed }
}

export const initializeNondet = (machine: SingleMachine, input: string): NondetSnapshot => {
    const initialTape = input.length > 0 ? input.split('') : [machine.blankSymbol]

    return {
        branches: [
            {
                id: 'b-0',
                state: machine.startState,
                tape: initialTape,
                head: 0,
                halted: false,
                result: 'running',
                depth: 0,
                label: 'root',
            },
        ],
        steps: 0,
        halted: false,
        explanation: 'Nondeterministic root branch initialized.',
    }
}

export const stepNondet = (machine: SingleMachine, snapshot: NondetSnapshot): NondetSnapshot => {
    if (snapshot.halted) return snapshot

    let seed = snapshot.branches.length
    const nextBranches: NondetBranch[] = []

    snapshot.branches.forEach((branch) => {
        const { spawned, nextSeed } = branchStep(machine, branch, seed)
        seed = nextSeed
        nextBranches.push(...spawned)
    })

    const limited = nextBranches.slice(0, 64)
    const accepted = limited.find((branch) => branch.result === 'accept')
    const halted = Boolean(accepted) || limited.every((branch) => branch.halted)

    return {
        branches: limited,
        steps: snapshot.steps + 1,
        halted,
        acceptedBranchId: accepted?.id,
        explanation: accepted
            ? `A branch reached an accepting state (${accepted.state}).`
            : `Expanded to ${limited.length} branches at depth ${Math.max(...limited.map((b) => b.depth))}.`,
    }
}

const parseEncodedMachine = (encoded: string): { ok: true; machine: SingleMachine } | { ok: false; reason: string } => {
    try {
        const parsed = JSON.parse(encoded) as SingleMachine
        if (!parsed.startState || !parsed.acceptState || !parsed.rejectState || !parsed.transitions) {
            return { ok: false, reason: 'Encoded machine is missing required fields.' }
        }
        return { ok: true, machine: parsed }
    } catch {
        return { ok: false, reason: 'Encoded machine must be valid JSON.' }
    }
}

export const initializeUniversal = (encoded: string, input: string): UniversalSnapshot => {
    const decoded = parseEncodedMachine(encoded)

    if (!decoded.ok) {
        return {
            encoded,
            decodedOk: false,
            decodeMessage: decoded.reason,
            inner: {
                state: 'decode-error',
                tape: input ? input.split('') : ['_'],
                head: 0,
                steps: 0,
                halted: true,
                result: 'reject',
                currentSymbol: input[0] ?? '_',
                lastTransition: 'None',
                explanation: decoded.reason,
            },
        }
    }

    return {
        encoded,
        decodedOk: true,
        decodeMessage: 'Encoded machine decoded successfully.',
        inner: initializeSingle(decoded.machine, input),
    }
}

export const stepUniversal = (snapshot: UniversalSnapshot): UniversalSnapshot => {
    const decoded = parseEncodedMachine(snapshot.encoded)
    if (!decoded.ok) {
        return {
            ...snapshot,
            decodedOk: false,
            decodeMessage: decoded.reason,
            inner: {
                ...snapshot.inner,
                halted: true,
                result: 'reject',
                explanation: decoded.reason,
            },
        }
    }

    return {
        ...snapshot,
        decodedOk: true,
        decodeMessage: 'Decoding complete. Executing one interpreted step.',
        inner: stepSingle(decoded.machine, snapshot.inner),
    }
}

export const summarizeTapeUsage = (tape: string[], blankSymbol: string) => tape.filter((s) => s !== blankSymbol).length

export const summarizeMultiTapeUsage = (tapes: string[][], blankSymbol: string) =>
    tapes.reduce((acc, tape) => acc + tape.filter((s) => s !== blankSymbol).length, 0)

export const flattenSingleTransitions = (machine: SingleMachine) => {
    const output: Array<{ from: string; read: string; transition: SingleTransition }> = []
    Object.entries(machine.transitions).forEach(([key, transitions]) => {
        const [from, read] = key.split('|')
        transitions.forEach((transition) => output.push({ from, read, transition }))
    })
    return output
}

export const flattenMultiTransitions = (machine: MultiMachine) => {
    const output: Array<{ from: string; reads: string[]; transition: MultiTransition }> = []
    Object.entries(machine.transitions).forEach(([key, transitions]) => {
        const [from, reads] = key.split('|')
        transitions.forEach((transition) => output.push({ from, reads: reads.split(','), transition }))
    })
    return output
}
