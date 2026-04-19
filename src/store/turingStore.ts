import { create } from 'zustand'
import { presets, binaryIncrementer, copierMultiTape } from '../data/presets'
import {
    flattenMultiTransitions,
    flattenSingleTransitions,
    initializeMulti,
    initializeNondet,
    initializeSingle,
    initializeUniversal,
    stepMulti,
    stepNondet,
    stepSingle,
    stepUniversal,
    summarizeMultiTapeUsage,
    summarizeTapeUsage,
} from '../engine/simulator'
import type { ComplexityPoint, Mode, MultiMachine, MultiSnapshot, NondetSnapshot, SingleMachine, SingleSnapshot, UniversalSnapshot } from '../types/turing'

interface TuringState {
    mode: Mode
    running: boolean
    speed: number
    input: string
    singleMachine: SingleMachine
    multiMachine: MultiMachine
    nondetMachine: SingleMachine
    universalEncoded: string
    singleSnapshot: SingleSnapshot
    multiSnapshot: MultiSnapshot
    nondetSnapshot: NondetSnapshot
    universalSnapshot: UniversalSnapshot
    machineEditor: string
    explainHistory: string[]
    activeTransition: string
    validationError: string
    complexityData: ComplexityPoint[]
    selectedPreset: string
    setMode: (mode: Mode) => void
    setSpeed: (speed: number) => void
    setInput: (input: string) => void
    setRunning: (running: boolean) => void
    step: () => void
    reset: () => void
    updateMachineEditor: (raw: string) => void
    applyEditorMachine: () => void
    loadPreset: (id: string) => void
}

const universalSeed = JSON.stringify(binaryIncrementer, null, 2)

const safeParse = <T,>(raw: string): { ok: true; value: T } | { ok: false; reason: string } => {
    try {
        return { ok: true, value: JSON.parse(raw) as T }
    } catch {
        return { ok: false, reason: 'JSON parsing failed. Please check syntax.' }
    }
}

const appendExplain = (history: string[], explanation: string) => [explanation, ...history].slice(0, 20)

export const useTuringStore = create<TuringState>((set, get) => ({
    mode: 'single',
    running: false,
    speed: 700,
    input: '1011',
    singleMachine: binaryIncrementer,
    multiMachine: copierMultiTape,
    nondetMachine: {
        ...binaryIncrementer,
        transitions: {
            ...binaryIncrementer.transitions,
            'q0|1': [
                { newState: 'q0', write: '1', move: 'R' },
                { newState: 'q1', write: '1', move: 'L' },
            ],
        },
    },
    universalEncoded: universalSeed,
    singleSnapshot: initializeSingle(binaryIncrementer, '1011'),
    multiSnapshot: initializeMulti(copierMultiTape, '1011'),
    nondetSnapshot: initializeNondet(
        {
            ...binaryIncrementer,
            transitions: {
                ...binaryIncrementer.transitions,
                'q0|1': [
                    { newState: 'q0', write: '1', move: 'R' },
                    { newState: 'q1', write: '1', move: 'L' },
                ],
            },
        },
        '1011',
    ),
    universalSnapshot: initializeUniversal(universalSeed, '1011'),
    machineEditor: JSON.stringify(binaryIncrementer, null, 2),
    explainHistory: ['Welcome to TuringLab. Configure a machine and press Run.'],
    activeTransition: 'None',
    validationError: '',
    complexityData: [],
    selectedPreset: presets[0].id,

    setMode: (mode) =>
        set((state) => ({
            mode,
            running: false,
            validationError: '',
            machineEditor:
                mode === 'single'
                    ? JSON.stringify(state.singleMachine, null, 2)
                    : mode === 'multi'
                        ? JSON.stringify(state.multiMachine, null, 2)
                        : mode === 'nondet'
                            ? JSON.stringify(state.nondetMachine, null, 2)
                            : state.universalEncoded,
        })),

    setSpeed: (speed) => set({ speed }),
    setInput: (input) => set({ input }),
    setRunning: (running) => set({ running }),

    step: () => {
        const state = get()

        if (state.mode === 'single') {
            const next = stepSingle(state.singleMachine, state.singleSnapshot)
            const halted = next.halted
            set((prev) => ({
                singleSnapshot: next,
                activeTransition: next.lastTransition,
                running: halted ? false : prev.running,
                explainHistory: appendExplain(prev.explainHistory, next.explanation),
                complexityData: halted
                    ? [
                        ...prev.complexityData,
                        {
                            inputSize: prev.input.length,
                            steps: next.steps,
                            tapeUsage: summarizeTapeUsage(next.tape, prev.singleMachine.blankSymbol),
                            mode: 'single',
                        },
                    ]
                    : prev.complexityData,
            }))
            return
        }

        if (state.mode === 'multi') {
            const next = stepMulti(state.multiMachine, state.multiSnapshot)
            const halted = next.halted
            set((prev) => ({
                multiSnapshot: next,
                activeTransition: next.lastTransition,
                running: halted ? false : prev.running,
                explainHistory: appendExplain(prev.explainHistory, next.explanation),
                complexityData: halted
                    ? [
                        ...prev.complexityData,
                        {
                            inputSize: prev.input.length,
                            steps: next.steps,
                            tapeUsage: summarizeMultiTapeUsage(next.tapes, prev.multiMachine.blankSymbol),
                            mode: 'multi',
                        },
                    ]
                    : prev.complexityData,
            }))
            return
        }

        if (state.mode === 'nondet') {
            const next = stepNondet(state.nondetMachine, state.nondetSnapshot)
            const accepted = next.branches.find((branch) => branch.result === 'accept')
            set((prev) => ({
                nondetSnapshot: next,
                activeTransition: accepted ? `Accepted on ${accepted.id}` : `Branches: ${next.branches.length}`,
                running: next.halted ? false : prev.running,
                explainHistory: appendExplain(prev.explainHistory, next.explanation),
                complexityData: next.halted
                    ? [
                        ...prev.complexityData,
                        {
                            inputSize: prev.input.length,
                            steps: next.steps,
                            tapeUsage: next.branches.length,
                            mode: 'nondet',
                        },
                    ]
                    : prev.complexityData,
            }))
            return
        }

        const next = stepUniversal(state.universalSnapshot)
        set((prev) => ({
            universalSnapshot: next,
            activeTransition: next.inner.lastTransition,
            running: next.inner.halted ? false : prev.running,
            explainHistory: appendExplain(prev.explainHistory, `${next.decodeMessage} ${next.inner.explanation}`),
            complexityData: next.inner.halted
                ? [
                    ...prev.complexityData,
                    {
                        inputSize: prev.input.length,
                        steps: next.inner.steps,
                        tapeUsage: summarizeTapeUsage(next.inner.tape, '_'),
                        mode: 'universal',
                    },
                ]
                : prev.complexityData,
        }))
    },

    reset: () => {
        const state = get()
        set((prev) => ({
            running: false,
            singleSnapshot: initializeSingle(state.singleMachine, state.input),
            multiSnapshot: initializeMulti(state.multiMachine, state.input),
            nondetSnapshot: initializeNondet(state.nondetMachine, state.input),
            universalSnapshot: initializeUniversal(state.universalEncoded, state.input),
            activeTransition: 'None',
            explainHistory: appendExplain(prev.explainHistory, 'Simulation reset.'),
        }))
    },

    updateMachineEditor: (raw) => set({ machineEditor: raw }),

    applyEditorMachine: () => {
        const state = get()

        if (state.mode === 'universal') {
            set({ universalEncoded: state.machineEditor, validationError: '' })
            get().reset()
            return
        }

        if (state.mode === 'multi') {
            const parsed = safeParse<MultiMachine>(state.machineEditor)
            if (!parsed.ok || !parsed.value.tapesCount) {
                set({ validationError: parsed.ok ? 'Multi-tape machine must define tapesCount.' : parsed.reason })
                return
            }
            set({ multiMachine: parsed.value, validationError: '' })
            get().reset()
            return
        }

        const parsed = safeParse<SingleMachine>(state.machineEditor)
        if (!parsed.ok || !parsed.value.startState || !parsed.value.transitions) {
            set({ validationError: parsed.ok ? 'Machine is missing startState or transitions.' : parsed.reason })
            return
        }

        if (state.mode === 'single') {
            set({ singleMachine: parsed.value, validationError: '' })
        } else {
            set({ nondetMachine: parsed.value, validationError: '' })
        }

        get().reset()
    },

    loadPreset: (id) => {
        const preset = presets.find((p) => p.id === id)
        if (!preset) return

        if (preset.mode === 'single') {
            const machine = preset.machine as SingleMachine
            set({
                mode: 'single',
                selectedPreset: id,
                singleMachine: machine,
                input: preset.sampleInput,
                machineEditor: JSON.stringify(machine, null, 2),
                validationError: '',
            })
            get().reset()
            return
        }

        if (preset.mode === 'multi') {
            const machine = preset.machine as MultiMachine
            set({
                mode: 'multi',
                selectedPreset: id,
                multiMachine: machine,
                input: preset.sampleInput,
                machineEditor: JSON.stringify(machine, null, 2),
                validationError: '',
            })
            get().reset()
            return
        }

        set({
            mode: 'universal',
            selectedPreset: id,
            universalEncoded: preset.machine as string,
            input: preset.sampleInput,
            machineEditor: preset.machine as string,
            validationError: '',
        })
        get().reset()
    },
}))

export const selectGraphData = (state: TuringState) => {
    if (state.mode === 'multi') {
        return flattenMultiTransitions(state.multiMachine).map((edge, index) => ({
            id: `e-${index}`,
            source: edge.from,
            target: edge.transition.newState,
            label: `${edge.reads.join('/')}:${edge.transition.writes.join('/')},${edge.transition.moves.join('/')}`,
        }))
    }

    const parsedUniversal = safeParse<SingleMachine>(state.universalEncoded)
    const machine =
        state.mode === 'nondet'
            ? state.nondetMachine
            : state.mode === 'single'
                ? state.singleMachine
                : parsedUniversal.ok
                    ? parsedUniversal.value
                    : state.singleMachine

    return flattenSingleTransitions(machine).map((edge, index) => ({
        id: `e-${index}`,
        source: edge.from,
        target: edge.transition.newState,
        label: `${edge.read}:${edge.transition.write},${edge.transition.move}`,
    }))
}
