import { motion } from 'framer-motion'

interface TapeViewProps {
    tape: string[]
    head: number
    title?: string
    blankSymbol?: string
}

const CELL_SIZE = 56

export function TapeView({ tape, head, title, blankSymbol = '_' }: TapeViewProps) {
    const safeTape = tape.length ? tape : [blankSymbol]
    const windowStart = Math.max(0, head - 10)
    const windowEnd = Math.min(safeTape.length, head + 11)
    const visible = safeTape.slice(windowStart, windowEnd)
    const localHead = head - windowStart

    return (
        <div className="space-y-3">
            {title ? <div className="text-sm font-medium text-zinc-600">{title}</div> : null}
            <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/60 p-4 backdrop-blur-xl">
                <motion.div
                    className="flex items-center gap-3"
                    animate={{ x: (10 - localHead) * 2 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                >
                    {visible.map((symbol, idx) => {
                        const absoluteIdx = windowStart + idx
                        const isHead = absoluteIdx === head

                        return (
                            <motion.div
                                key={`${absoluteIdx}-${symbol}`}
                                initial={{ opacity: 0.6, rotateX: -35 }}
                                animate={{ opacity: 1, rotateX: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border text-xl font-semibold shadow-sm ${isHead
                                        ? 'border-orange-400 bg-gradient-to-b from-orange-100 to-white text-black shadow-orange-200'
                                        : 'border-zinc-200 bg-white/85 text-zinc-800'
                                    }`}
                                style={{ minWidth: CELL_SIZE }}
                            >
                                {symbol}
                            </motion.div>
                        )
                    })}
                </motion.div>

                <motion.div
                    className="pointer-events-none absolute -top-2 left-0 h-full"
                    animate={{ x: 16 + localHead * (CELL_SIZE + 12) }}
                    transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                >
                    <div className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_24px_rgba(255,106,0,0.7)]" />
                </motion.div>
            </div>
        </div>
    )
}
