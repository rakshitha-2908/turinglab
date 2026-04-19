import { motion } from 'framer-motion'

interface StatePanelProps {
    title: string
    state: string
    symbol: string
    transition: string
    steps: number
    result: string
}

export function StatePanel({ title, state, symbol, transition, steps, result }: StatePanelProps) {
    return (
        <motion.div
            layout
            className="overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-5 backdrop-blur-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
        >
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black">{title}</h3>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${result === 'accept'
                            ? 'bg-emerald-100 text-emerald-700'
                            : result === 'reject'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-zinc-100 text-zinc-700'
                        }`}
                >
                    {result}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-zinc-700">
                <div className="overflow-hidden rounded-2xl bg-white/90 p-3">Current State: <strong className="break-all">{state}</strong></div>
                <div className="overflow-hidden rounded-2xl bg-white/90 p-3">Current Symbol: <strong className="break-all">{symbol}</strong></div>
                <div className="col-span-2 overflow-hidden rounded-2xl bg-white/90 p-3">Transition: <strong className="break-all">{transition}</strong></div>
                <div className="col-span-2 rounded-2xl bg-white/90 p-3">Steps: <strong>{steps}</strong></div>
            </div>
        </motion.div>
    )
}
