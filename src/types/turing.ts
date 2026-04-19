export type Move = 'L' | 'R' | 'S'

export type Mode = 'single' | 'multi' | 'nondet' | 'universal'

export interface SingleTransition {
    newState: string
    write: string
    move: Move
}

export interface MultiTransition {
    newState: string
    writes: string[]
    moves: Move[]
}

export interface SingleMachine {
    states: string[]
    inputAlphabet: string[]
    tapeAlphabet: string[]
    transitions: Record<string, SingleTransition[]>
    startState: string
    acceptState: string
    rejectState: string
    blankSymbol: string
}

export interface MultiMachine {
    states: string[]
    tapesCount: number
    transitions: Record<string, MultiTransition[]>
    startState: string
    acceptState: string
    rejectState: string
    blankSymbol: string
}

export interface TapeSnapshot {
    tape: string[]
    head: number
}

export interface SingleSnapshot {
    state: string
    tape: string[]
    head: number
    steps: number
    halted: boolean
    result: 'accept' | 'reject' | 'running'
    currentSymbol: string
    lastTransition: string
    explanation: string
}

export interface MultiSnapshot {
    state: string
    tapes: string[][]
    heads: number[]
    steps: number
    halted: boolean
    result: 'accept' | 'reject' | 'running'
    currentSymbols: string[]
    lastTransition: string
    explanation: string
}

export interface NondetBranch {
    id: string
    parentId?: string
    state: string
    tape: string[]
    head: number
    halted: boolean
    result: 'accept' | 'reject' | 'running'
    depth: number
    label: string
}

export interface NondetSnapshot {
    branches: NondetBranch[]
    steps: number
    halted: boolean
    acceptedBranchId?: string
    explanation: string
}

export interface UniversalSnapshot {
    encoded: string
    decodedOk: boolean
    decodeMessage: string
    inner: SingleSnapshot
}

export interface ComplexityPoint {
    inputSize: number
    steps: number
    tapeUsage: number
    mode: Mode
}

export interface MachinePreset {
    id: string
    name: string
    description: string
    mode: Mode
    machine: SingleMachine | MultiMachine | string
    sampleInput: string
}
