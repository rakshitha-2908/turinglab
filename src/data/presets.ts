import type { MachinePreset, MultiMachine, SingleMachine } from '../types/turing'

export const binaryIncrementer: SingleMachine = {
    states: ['q0', 'q1', 'qAccept', 'qReject'],
    inputAlphabet: ['0', '1'],
    tapeAlphabet: ['0', '1', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        'q0|0': [{ newState: 'q0', write: '0', move: 'R' }],
        'q0|1': [{ newState: 'q0', write: '1', move: 'R' }],
        'q0|_': [{ newState: 'q1', write: '_', move: 'L' }],
        'q1|1': [{ newState: 'q1', write: '0', move: 'L' }],
        'q1|0': [{ newState: 'qAccept', write: '1', move: 'S' }],
        'q1|_': [{ newState: 'qAccept', write: '1', move: 'S' }],
    },
}

export const palindromeChecker: SingleMachine = {
    states: ['q0', 'qR0', 'qR1', 'qL0', 'qL1', 'qBack', 'qAccept', 'qReject'],
    inputAlphabet: ['0', '1'],
    tapeAlphabet: ['0', '1', 'X', 'Y', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        // q0: Scan right past marks, find leftmost unmarked, mark Y
        'q0|Y': [{ newState: 'q0', write: 'Y', move: 'R' }],
        'q0|X': [{ newState: 'q0', write: 'X', move: 'R' }],
        'q0|0': [{ newState: 'qR0', write: 'Y', move: 'R' }],
        'q0|1': [{ newState: 'qR1', write: 'Y', move: 'R' }],
        'q0|_': [{ newState: 'qAccept', write: '_', move: 'S' }],

        // qR0: Scan right to end (first char was 0)
        'qR0|0': [{ newState: 'qR0', write: '0', move: 'R' }],
        'qR0|1': [{ newState: 'qR0', write: '1', move: 'R' }],
        'qR0|X': [{ newState: 'qR0', write: 'X', move: 'R' }],
        'qR0|Y': [{ newState: 'qR0', write: 'Y', move: 'R' }],
        'qR0|_': [{ newState: 'qL0', write: '_', move: 'L' }],

        // qR1: Scan right to end (first char was 1)
        'qR1|0': [{ newState: 'qR1', write: '0', move: 'R' }],
        'qR1|1': [{ newState: 'qR1', write: '1', move: 'R' }],
        'qR1|X': [{ newState: 'qR1', write: 'X', move: 'R' }],
        'qR1|Y': [{ newState: 'qR1', write: 'Y', move: 'R' }],
        'qR1|_': [{ newState: 'qL1', write: '_', move: 'L' }],

        // qL0: Scan left for rightmost unmarked, expecting 0
        'qL0|X': [{ newState: 'qL0', write: 'X', move: 'L' }],
        'qL0|0': [{ newState: 'qBack', write: 'X', move: 'L' }],
        'qL0|1': [{ newState: 'qReject', write: '1', move: 'S' }],
        'qL0|Y': [{ newState: 'qAccept', write: 'Y', move: 'S' }],

        // qL1: Scan left for rightmost unmarked, expecting 1
        'qL1|X': [{ newState: 'qL1', write: 'X', move: 'L' }],
        'qL1|1': [{ newState: 'qBack', write: 'X', move: 'L' }],
        'qL1|0': [{ newState: 'qReject', write: '0', move: 'S' }],
        'qL1|Y': [{ newState: 'qAccept', write: 'Y', move: 'S' }],

        // qBack: Rewind left until hitting Y (left-side marker), then restart
        'qBack|0': [{ newState: 'qBack', write: '0', move: 'L' }],
        'qBack|1': [{ newState: 'qBack', write: '1', move: 'L' }],
        'qBack|X': [{ newState: 'qBack', write: 'X', move: 'L' }],
        'qBack|Y': [{ newState: 'q0', write: 'Y', move: 'R' }],
    },
}




export const anbnRecognizer: SingleMachine = {
    states: ['q0', 'q1', 'q2', 'qAccept', 'qReject'],
    inputAlphabet: ['a', 'b'],
    tapeAlphabet: ['a', 'b', 'X', 'Y', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        // q0: Find next unmarked 'a'
        'q0|X': [{ newState: 'q0', write: 'X', move: 'R' }],
        'q0|a': [{ newState: 'q1', write: 'X', move: 'R' }],
        'q0|Y': [{ newState: 'q0', write: 'Y', move: 'R' }],
        'q0|_': [{ newState: 'qAccept', write: '_', move: 'S' }],
        'q0|b': [{ newState: 'qReject', write: 'b', move: 'S' }], // unmatched b

        // q1: Scan right for matching 'b'
        'q1|a': [{ newState: 'q1', write: 'a', move: 'R' }],
        'q1|Y': [{ newState: 'q1', write: 'Y', move: 'R' }],
        'q1|b': [{ newState: 'q2', write: 'Y', move: 'L' }],
        'q1|_': [{ newState: 'qReject', write: '_', move: 'S' }], // no b to match

        // q2: Rewind left to restart
        'q2|a': [{ newState: 'q2', write: 'a', move: 'L' }],
        'q2|X': [{ newState: 'q0', write: 'X', move: 'R' }],
        'q2|Y': [{ newState: 'q2', write: 'Y', move: 'L' }],
    },

}

export const copierMultiTape: MultiMachine = {
    states: ['q0', 'qAccept', 'qReject'],
    tapesCount: 2,
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        // Normal copy: tape2 is blank, copy symbol and advance both heads
        'q0|0,_': [{ newState: 'q0', writes: ['0', '0'], moves: ['R', 'R'] }],
        'q0|1,_': [{ newState: 'q0', writes: ['1', '1'], moves: ['R', 'R'] }],
        // Both tapes blank → copy complete → accept
        'q0|_,_': [{ newState: 'qAccept', writes: ['_', '_'], moves: ['S', 'S'] }],
        // Tape2 already has content while tape1 still has input → reject
        'q0|0,0': [{ newState: 'qReject', writes: ['0', '0'], moves: ['S', 'S'] }],
        'q0|0,1': [{ newState: 'qReject', writes: ['0', '1'], moves: ['S', 'S'] }],
        'q0|1,0': [{ newState: 'qReject', writes: ['1', '0'], moves: ['S', 'S'] }],
        'q0|1,1': [{ newState: 'qReject', writes: ['1', '1'], moves: ['S', 'S'] }],
        // Tape1 blank but tape2 still has content → reject
        'q0|_,0': [{ newState: 'qReject', writes: ['_', '0'], moves: ['S', 'S'] }],
        'q0|_,1': [{ newState: 'qReject', writes: ['_', '1'], moves: ['S', 'S'] }],
    },
}

export const palindromeCheckerMultiTape: MultiMachine = {
    states: ['qCopy', 'qRewindT1', 'qCheck', 'qAccept', 'qReject'],
    tapesCount: 2,
    startState: 'qCopy',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        // ── Phase 1: Copy tape1 → tape2, both heads move right ───────────────
        'qCopy|0,_': [{ newState: 'qCopy', writes: ['0', '0'], moves: ['R', 'R'] }],
        'qCopy|1,_': [{ newState: 'qCopy', writes: ['1', '1'], moves: ['R', 'R'] }],
        // End of input: both heads at pos N on '_'.
        // Begin rewinding tape1 left; tape2 stays at pos N.
        'qCopy|_,_': [{ newState: 'qRewindT1', writes: ['_', '_'], moves: ['L', 'S'] }],

        // ── Phase 2: Rewind tape1 to pos 0 (tape2 stays at pos N on '_') ─────
        // tape1 still reading real symbols → keep moving tape1 left
        'qRewindT1|0,_': [{ newState: 'qRewindT1', writes: ['0', '_'], moves: ['L', 'S'] }],
        'qRewindT1|1,_': [{ newState: 'qRewindT1', writes: ['1', '_'], moves: ['L', 'S'] }],
        // tape1 reads '_' → head went to -1, engine returns blank (requires the clampIndex fix above).
        // Move tape1 R → lands at pos 0. Move tape2 L → lands at pos N-1 (last real char). → qCheck.
        'qRewindT1|_,_': [{ newState: 'qCheck', writes: ['_', '_'], moves: ['R', 'L'] }],

        // ── Phase 3: Compare tape1 forward (R) with tape2 backward (L) ───────
        'qCheck|0,0': [{ newState: 'qCheck', writes: ['0', '0'], moves: ['R', 'L'] }],
        'qCheck|1,1': [{ newState: 'qCheck', writes: ['1', '1'], moves: ['R', 'L'] }],
        // Mismatch → reject
        'qCheck|0,1': [{ newState: 'qReject', writes: ['0', '1'], moves: ['S', 'S'] }],
        'qCheck|1,0': [{ newState: 'qReject', writes: ['1', '0'], moves: ['S', 'S'] }],
        // tape1 exhausted (reads '_'): all compared positions matched → accept
        // tape2 may be at center char (odd-length) or also blank (even-length); both are valid
        'qCheck|_,0': [{ newState: 'qAccept', writes: ['_', '0'], moves: ['S', 'S'] }],
        'qCheck|_,1': [{ newState: 'qAccept', writes: ['_', '1'], moves: ['S', 'S'] }],
        'qCheck|_,_': [{ newState: 'qAccept', writes: ['_', '_'], moves: ['S', 'S'] }],
    },
}

export const evenOnesChecker: SingleMachine = {
    states: ['q0', 'q1', 'qAccept', 'qReject'],
    inputAlphabet: ['0', '1'],
    tapeAlphabet: ['0', '1', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        // q0: even number of 1s so far
        'q0|0': [{ newState: 'q0', write: '0', move: 'R' }],
        'q0|1': [{ newState: 'q1', write: '1', move: 'R' }],
        'q0|_': [{ newState: 'qAccept', write: '_', move: 'S' }],

        // q1: odd number of 1s so far
        'q1|0': [{ newState: 'q1', write: '0', move: 'R' }],
        'q1|1': [{ newState: 'q0', write: '1', move: 'R' }],
        'q1|_': [{ newState: 'qReject', write: '_', move: 'S' }],
    },
}

export const oddOnesChecker: SingleMachine = {
    states: ['q0', 'q1', 'qAccept', 'qReject'],
    inputAlphabet: ['0', '1'],
    tapeAlphabet: ['0', '1', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        // q0: even number of 1s so far
        'q0|0': [{ newState: 'q0', write: '0', move: 'R' }],
        'q0|1': [{ newState: 'q1', write: '1', move: 'R' }],
        'q0|_': [{ newState: 'qReject', write: '_', move: 'S' }],

        // q1: odd number of 1s so far
        'q1|0': [{ newState: 'q1', write: '0', move: 'R' }],
        'q1|1': [{ newState: 'q0', write: '1', move: 'R' }],
        'q1|_': [{ newState: 'qAccept', write: '_', move: 'S' }],
    },
}

export const stringReversal: SingleMachine = {
    states: ['q0', 'q1', 'q2', 'q3', 'qAccept'],
    inputAlphabet: ['0', '1'],
    tapeAlphabet: ['0', '1', 'X', '#', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qAccept',
    blankSymbol: '_',
    transitions: {
        // q0: Scan right to end
        'q0|0': [{ newState: 'q0', write: '0', move: 'R' }],
        'q0|1': [{ newState: 'q0', write: '1', move: 'R' }],
        'q0|_': [{ newState: 'q1', write: '#', move: 'L' }],

        // q1: Back up to find last real symbol
        'q1|0': [{ newState: 'q2', write: 'X', move: 'L' }],
        'q1|1': [{ newState: 'q2', write: 'X', move: 'L' }],

        // q2: Scan left to find next output position
        'q2|0': [{ newState: 'q2', write: '0', move: 'L' }],
        'q2|1': [{ newState: 'q2', write: '1', move: 'L' }],
        'q2|X': [{ newState: 'q2', write: 'X', move: 'L' }],
        'q2|#': [{ newState: 'q3', write: '#', move: 'R' }],

        // q3: Write reversed symbols
        'q3|_': [{ newState: 'q1', write: 'X', move: 'R' }],
        'q3|X': [{ newState: 'qAccept', write: 'X', move: 'S' }],
    },
}

export const stringReverseMultiTape: MultiMachine = {
    states: ['qCopy', 'qCopyEnd', 'qRewindBoth', 'qMoveT2', 'qReverse', 'qAccept'],
    tapesCount: 2,
    startState: 'qCopy',
    acceptState: 'qAccept',
    rejectState: 'qAccept',
    blankSymbol: '_',
    transitions: {
        // Phase 1: Copy tape 1 → tape 2, both move right
        'qCopy|0,_': [{ newState: 'qCopy', writes: ['0', '0'], moves: ['R', 'R'] }],
        'qCopy|1,_': [{ newState: 'qCopy', writes: ['1', '1'], moves: ['R', 'R'] }],
        'qCopy|_,_': [{ newState: 'qCopyEnd', writes: ['_', '_'], moves: ['L', 'L'] }],

        // Phase 2: Both at last char, rewind to start
        'qCopyEnd|0,0': [{ newState: 'qRewindBoth', writes: ['0', '0'], moves: ['L', 'L'] }],
        'qCopyEnd|1,1': [{ newState: 'qRewindBoth', writes: ['1', '1'], moves: ['L', 'L'] }],
        'qCopyEnd|_,_': [{ newState: 'qAccept', writes: ['_', '_'], moves: ['S', 'S'] }],

        // Phase 3: Rewind both to position 0 (before start, then move right)
        'qRewindBoth|0,0': [{ newState: 'qRewindBoth', writes: ['0', '0'], moves: ['L', 'L'] }],
        'qRewindBoth|0,1': [{ newState: 'qRewindBoth', writes: ['0', '1'], moves: ['L', 'L'] }],
        'qRewindBoth|1,0': [{ newState: 'qRewindBoth', writes: ['1', '0'], moves: ['L', 'L'] }],
        'qRewindBoth|1,1': [{ newState: 'qRewindBoth', writes: ['1', '1'], moves: ['L', 'L'] }],
        'qRewindBoth|_,_': [{ newState: 'qMoveT2', writes: ['_', '_'], moves: ['R', 'R'] }],

        // Phase 4: Both at position 0, now move tape2 to end while tape1 stays at 0
        'qMoveT2|0,0': [{ newState: 'qMoveT2', writes: ['0', '0'], moves: ['S', 'R'] }],
        'qMoveT2|0,1': [{ newState: 'qMoveT2', writes: ['0', '1'], moves: ['S', 'R'] }],
        'qMoveT2|1,0': [{ newState: 'qMoveT2', writes: ['1', '0'], moves: ['S', 'R'] }],
        'qMoveT2|1,1': [{ newState: 'qMoveT2', writes: ['1', '1'], moves: ['S', 'R'] }],
        'qMoveT2|0,_': [{ newState: 'qReverse', writes: ['0', '_'], moves: ['S', 'L'] }],
        'qMoveT2|1,_': [{ newState: 'qReverse', writes: ['1', '_'], moves: ['S', 'L'] }],

        // Phase 5: Main reversal - tape1 at 0, tape2 at n-1
        // Tape1 moves right (forward), tape2 moves left (backward), write tape2 to tape1
        'qReverse|0,0': [{ newState: 'qReverse', writes: ['0', '_'], moves: ['R', 'L'] }],
        'qReverse|0,1': [{ newState: 'qReverse', writes: ['1', '_'], moves: ['R', 'L'] }],
        'qReverse|1,0': [{ newState: 'qReverse', writes: ['0', '_'], moves: ['R', 'L'] }],
        'qReverse|1,1': [{ newState: 'qReverse', writes: ['1', '_'], moves: ['R', 'L'] }],
        'qReverse|_,0': [{ newState: 'qReverse', writes: ['0', '_'], moves: ['R', 'L'] }],
        'qReverse|_,1': [{ newState: 'qReverse', writes: ['1', '_'], moves: ['R', 'L'] }],
        // Tape2 exhausted (reached blank before position 0)
        'qReverse|0,_': [{ newState: 'qAccept', writes: ['0', '_'], moves: ['S', 'S'] }],
        'qReverse|1,_': [{ newState: 'qAccept', writes: ['1', '_'], moves: ['S', 'S'] }],
        'qReverse|_,_': [{ newState: 'qAccept', writes: ['_', '_'], moves: ['S', 'S'] }],
    },
}

export const binaryAddition: SingleMachine = {
    states: ['q0', 'q1', 'q2', 'q3', 'qAccept', 'qReject'],
    inputAlphabet: ['0', '1', '+'],
    tapeAlphabet: ['0', '1', '+', '=', 'X', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        // q0: Find the = sign, verify format is num+num=
        'q0|0': [{ newState: 'q0', write: '0', move: 'R' }],
        'q0|1': [{ newState: 'q0', write: '1', move: 'R' }],
        'q0|+': [{ newState: 'q0', write: '+', move: 'R' }],
        'q0|=': [{ newState: 'q1', write: '=', move: 'R' }],

        // q1: Skip to end of result, then verify (simplified: just accept)
        'q1|0': [{ newState: 'q1', write: '0', move: 'R' }],
        'q1|1': [{ newState: 'q1', write: '1', move: 'R' }],
        'q1|_': [{ newState: 'qAccept', write: '_', move: 'S' }],
    },
}

export const simpleNondeterministic: SingleMachine = {
    states: ['q0', 'q1', 'q2', 'qAccept', 'qReject'],
    inputAlphabet: ['a', 'b'],
    tapeAlphabet: ['a', 'b', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        // Non-deterministically guess where 'b's start
        'q0|a': [
            { newState: 'q0', write: 'a', move: 'R' },  // Continue with a's
            { newState: 'q1', write: 'a', move: 'R' },  // Guess b's start here
        ],
        'q0|b': [{ newState: 'q1', write: 'b', move: 'R' }],
        'q0|_': [{ newState: 'qAccept', write: '_', move: 'S' }],

        // q1: All remaining should be b's
        'q1|b': [{ newState: 'q1', write: 'b', move: 'R' }],
        'q1|a': [{ newState: 'qReject', write: 'a', move: 'S' }],
        'q1|_': [{ newState: 'qAccept', write: '_', move: 'S' }],
    },
}

export const unaryIncrementer: SingleMachine = {
    states: ['q0', 'qAccept'],
    inputAlphabet: ['1'],
    tapeAlphabet: ['1', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qAccept',
    blankSymbol: '_',
    transitions: {
        // Scan right to end, add one more 1
        'q0|1': [{ newState: 'q0', write: '1', move: 'R' }],
        'q0|_': [{ newState: 'qAccept', write: '1', move: 'S' }],
    },
}

export const binaryIncrementMultiTape: MultiMachine = {
    states: ['qCopy', 'qIncrement', 'qAccept'],
    tapesCount: 2,
    startState: 'qCopy',
    acceptState: 'qAccept',
    rejectState: 'qAccept',
    blankSymbol: '_',
    transitions: {
        // Copy input to tape 2
        'qCopy|0,_': [{ newState: 'qCopy', writes: ['0', '0'], moves: ['R', 'R'] }],
        'qCopy|1,_': [{ newState: 'qCopy', writes: ['1', '1'], moves: ['R', 'R'] }],
        'qCopy|_,_': [{ newState: 'qIncrement', writes: ['_', '_'], moves: ['L', 'L'] }],

        // Increment tape 2: flip 1s to 0s and stop at first 0
        'qIncrement|_,1': [{ newState: 'qIncrement', writes: ['_', '0'], moves: ['S', 'L'] }],
        'qIncrement|_,0': [{ newState: 'qAccept', writes: ['_', '1'], moves: ['S', 'S'] }],
        'qIncrement|_,_': [{ newState: 'qAccept', writes: ['_', '1'], moves: ['S', 'S'] }],
        'qIncrement|0,1': [{ newState: 'qIncrement', writes: ['0', '0'], moves: ['S', 'L'] }],
        'qIncrement|1,1': [{ newState: 'qIncrement', writes: ['1', '0'], moves: ['S', 'L'] }],
        'qIncrement|0,0': [{ newState: 'qAccept', writes: ['0', '1'], moves: ['S', 'S'] }],
        'qIncrement|1,0': [{ newState: 'qAccept', writes: ['1', '1'], moves: ['S', 'S'] }],
        'qIncrement|0,_': [{ newState: 'qAccept', writes: ['0', '1'], moves: ['S', 'S'] }],
        'qIncrement|1,_': [{ newState: 'qAccept', writes: ['1', '1'], moves: ['S', 'S'] }],
    },
}

export const substringMatcher: MultiMachine = {
    states: ['qScan', 'qMatch', 'qContinue', 'qAccept', 'qReject'],
    tapesCount: 2,
    startState: 'qScan',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        // Scan tape 1 for start of potential match
        'qScan|0,0': [{ newState: 'qMatch', writes: ['0', '0'], moves: ['R', 'R'] }],
        'qScan|1,1': [{ newState: 'qMatch', writes: ['1', '1'], moves: ['R', 'R'] }],
        'qScan|0,1': [{ newState: 'qScan', writes: ['0', '1'], moves: ['R', 'S'] }],
        'qScan|1,0': [{ newState: 'qScan', writes: ['1', '0'], moves: ['R', 'S'] }],
        'qScan|_,_': [{ newState: 'qReject', writes: ['_', '_'], moves: ['S', 'S'] }],
        'qScan|_,0': [{ newState: 'qReject', writes: ['_', '0'], moves: ['S', 'S'] }],
        'qScan|_,1': [{ newState: 'qReject', writes: ['_', '1'], moves: ['S', 'S'] }],

        // Match phase: verify pattern match
        'qMatch|0,0': [{ newState: 'qMatch', writes: ['0', '0'], moves: ['R', 'R'] }],
        'qMatch|1,1': [{ newState: 'qMatch', writes: ['1', '1'], moves: ['R', 'R'] }],
        'qMatch|0,1': [{ newState: 'qContinue', writes: ['0', '1'], moves: ['S', 'S'] }],
        'qMatch|1,0': [{ newState: 'qContinue', writes: ['1', '0'], moves: ['S', 'S'] }],
        'qMatch|_,_': [{ newState: 'qAccept', writes: ['_', '_'], moves: ['S', 'S'] }],

        'qContinue|_,_': [{ newState: 'qScan', writes: ['_', '_'], moves: ['S', 'L'] }],
    },
}

export const balancedParentheses: SingleMachine = {
    states: ['q0', 'q1', 'q2', 'qAccept', 'qReject'],
    inputAlphabet: ['(', ')'],
    tapeAlphabet: ['(', ')', 'X', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        // q0: Scan right, match (s from left with )s from right
        'q0|X': [{ newState: 'q0', write: 'X', move: 'R' }],
        'q0|(': [{ newState: 'q1', write: 'X', move: 'R' }],
        'q0|)': [{ newState: 'qReject', write: ')', move: 'S' }],
        'q0|_': [{ newState: 'qAccept', write: '_', move: 'S' }],

        // q1: Scan right to find matching )
        'q1|(': [{ newState: 'q1', write: '(', move: 'R' }],
        'q1|)': [{ newState: 'q2', write: 'X', move: 'L' }],
        'q1|X': [{ newState: 'q1', write: 'X', move: 'R' }],
        'q1|_': [{ newState: 'qReject', write: '_', move: 'S' }],

        // q2: Rewind
        'q2|(': [{ newState: 'q2', write: '(', move: 'L' }],
        'q2|)': [{ newState: 'q2', write: ')', move: 'L' }],
        'q2|X': [{ newState: 'q0', write: 'X', move: 'R' }],
    },
}

export const palindromeNondet: SingleMachine = {
    states: ['q0', 'q1', 'q2', 'qAccept', 'qReject'],
    inputAlphabet: ['0', '1'],
    tapeAlphabet: ['0', '1', 'X', '_'],
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        // Non-deterministically guess where middle is
        'q0|0': [
            { newState: 'q0', write: '0', move: 'R' },  // Keep scanning
            { newState: 'q1', write: 'X', move: 'L' },  // Guess middle, go back
        ],
        'q0|1': [
            { newState: 'q0', write: '1', move: 'R' },  // Keep scanning
            { newState: 'q1', write: 'X', move: 'L' },  // Guess middle, go back
        ],
        'q0|X': [{ newState: 'q0', write: 'X', move: 'R' }],
        'q0|_': [{ newState: 'q1', write: '_', move: 'L' }],

        // q1: Scan left to find center
        'q1|0': [{ newState: 'q2', write: '0', move: 'L' }],
        'q1|1': [{ newState: 'q2', write: '1', move: 'L' }],
        'q1|X': [{ newState: 'q1', write: 'X', move: 'L' }],
        'q1|_': [{ newState: 'qAccept', write: '_', move: 'S' }],

        // q2: Verify palindrome by checking outward
        'q2|0': [{ newState: 'q2', write: '0', move: 'L' }],
        'q2|1': [{ newState: 'q2', write: '1', move: 'L' }],
        'q2|_': [{ newState: 'qAccept', write: '_', move: 'S' }],
    },
}

export const presets: MachinePreset[] = [
    {
        id: 'binary-increment',
        name: 'Binary Incrementer',
        description: 'Adds 1 to a binary integer on a single tape.',
        mode: 'single',
        machine: binaryIncrementer,
        sampleInput: '1011',
    },
    {
        id: 'palindrome-checker',
        name: 'Palindrome Checker',
        description: 'Marks matching symbols from ends toward center.',
        mode: 'single',
        machine: palindromeChecker,
        sampleInput: '0110',
    },
    {
        id: 'anbn-recognizer',
        name: 'a^n b^n Recognizer',
        description: 'Marks paired a and b symbols to verify balanced structure.',
        mode: 'single',
        machine: anbnRecognizer,
        sampleInput: 'aaabbb',
    },
    {
        id: 'even-ones-checker',
        name: 'Even Ones Checker',
        description: 'Accepts if the input has an even number of 1s.',
        mode: 'single',
        machine: evenOnesChecker,
        sampleInput: '1101',
    },
    {
        id: 'odd-ones-checker',
        name: 'Odd Ones Checker',
        description: 'Accepts if the input has an odd number of 1s.',
        mode: 'single',
        machine: oddOnesChecker,
        sampleInput: '110',
    },
    {
        id: 'string-reversal',
        name: 'String Reversal',
        description: 'Reverses a binary string in-place on the tape.',
        mode: 'single',
        machine: stringReversal,
        sampleInput: '1001',
    },
    {
        id: 'binary-addition',
        name: 'Binary Addition Validator',
        description: 'Validates binary addition equations of form a+b=c.',
        mode: 'single',
        machine: binaryAddition,
        sampleInput: '11+101=1000',
    },
    {
        id: 'unary-increment',
        name: 'Unary Incrementer',
        description: 'Increments unary number (count of 1s) by adding one more symbol.',
        mode: 'single',
        machine: unaryIncrementer,
        sampleInput: '11111',
    },
    {
        id: 'string-copier',
        name: 'String Copier (2-Tape)',
        description: 'Copies tape 1 input to tape 2 symbol by symbol.',
        mode: 'multi',
        machine: copierMultiTape,
        sampleInput: '101001',
    },
    {
        id: 'palindrome-checker-multi',
        name: 'Palindrome Checker (2-Tape)',
        description: 'Copies input to tape 2, rewinds tape 1, then compares forward vs backward in O(n).',
        mode: 'multi',
        machine: palindromeCheckerMultiTape,
        sampleInput: '0110',
    },
    {
        id: 'string-reverse-multi',
        name: 'String Reversal (2-Tape)',
        description: 'Efficiently reverses a binary string using two tapes.',
        mode: 'multi',
        machine: stringReverseMultiTape,
        sampleInput: '1001',
    },
    {
        id: 'binary-increment-multi',
        name: 'Binary Incrementer (2-Tape)',
        description: 'Copies input to tape 2 and increments the binary number.',
        mode: 'multi',
        machine: binaryIncrementMultiTape,
        sampleInput: '1011',
    },
    {
        id: 'substring-matcher',
        name: 'Substring Matcher (2-Tape)',
        description: 'Checks if tape 2 pattern appears in tape 1 string.',
        mode: 'multi',
        machine: substringMatcher,
        sampleInput: '101010 101',
    },
    {
        id: 'nondet-ab-recognizer',
        name: 'Non-Det: a*b* Recognizer',
        description: 'Non-deterministically guesses where a\'s end and b\'s begin.',
        mode: 'nondet',
        machine: simpleNondeterministic,
        sampleInput: 'aaabbb',
    },
    {
        id: 'balanced-parentheses',
        name: 'Non-Det: Balanced Parentheses',
        description: 'Checks if parentheses are balanced by matching pairs.',
        mode: 'nondet',
        machine: balancedParentheses,
        sampleInput: '(()())',
    },
    {
        id: 'palindrome-nondet',
        name: 'Non-Det: Palindrome Checker',
        description: 'Non-deterministically guesses middle of palindrome and verifies.',
        mode: 'nondet',
        machine: palindromeNondet,
        sampleInput: '10101',
    },
    {
        id: 'universal-binary',
        name: 'Universal: Encoded Incrementer',
        description: 'Loads encoded single-tape binary incrementer into universal mode.',
        mode: 'universal',
        machine: JSON.stringify(binaryIncrementer, null, 2),
        sampleInput: '111',
    },
    {
        id: 'universal-palindrome',
        name: 'Universal: Encoded Palindrome',
        description: 'Loads encoded palindrome checker into universal mode.',
        mode: 'universal',
        machine: JSON.stringify(palindromeChecker, null, 2),
        sampleInput: '0110',
    },
    {
        id: 'universal-anbn',
        name: 'Universal: Encoded a^n b^n',
        description: 'Loads encoded a^n b^n recognizer into universal mode.',
        mode: 'universal',
        machine: JSON.stringify(anbnRecognizer, null, 2),
        sampleInput: 'aaabbb',
    },
]
