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
    states: ['q0', 'q1', 'qAccept', 'qReject'],
    tapesCount: 2,
    startState: 'q0',
    acceptState: 'qAccept',
    rejectState: 'qReject',
    blankSymbol: '_',
    transitions: {
        'q0|0,_': [{ newState: 'q0', writes: ['0', '0'], moves: ['R', 'R'] }],
        'q0|1,_': [{ newState: 'q0', writes: ['1', '1'], moves: ['R', 'R'] }],
        'q0|_,_': [{ newState: 'qAccept', writes: ['_', '_'], moves: ['S', 'S'] }],
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
        id: 'string-copier',
        name: 'String Copier (2-Tape)',
        description: 'Copies tape 1 input to tape 2 symbol by symbol.',
        mode: 'multi',
        machine: copierMultiTape,
        sampleInput: '101001',
    },
    {
        id: 'universal-binary',
        name: 'Universal: Encoded Incrementer',
        description: 'Loads encoded single-tape machine into universal mode.',
        mode: 'universal',
        machine: JSON.stringify(binaryIncrementer, null, 2),
        sampleInput: '111',
    },
]
