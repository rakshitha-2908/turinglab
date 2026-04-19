import { TapeView } from './TapeView'

interface MultiTapeViewProps {
    tapes: string[][]
    heads: number[]
}

export function MultiTapeView({ tapes, heads }: MultiTapeViewProps) {
    return (
        <div className="space-y-4">
            {tapes.map((tape, idx) => (
                <TapeView key={`tape-${idx}`} tape={tape} head={heads[idx] ?? 0} title={`Tape ${idx + 1}`} />
            ))}
        </div>
    )
}
