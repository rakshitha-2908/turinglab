import { motion } from 'framer-motion'

interface ExplanationPanelProps {
    history: string[]
}

export function ExplanationPanel({ history }: ExplanationPanelProps) {
    return (
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-4 backdrop-blur-2xl">
            <h3 className="mb-3 text-base font-semibold text-black">Explain Mode</h3>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                {history.map((line, idx) => (
                    <motion.p
                        key={`${line}-${idx}`}
                        className="rounded-xl bg-white/80 px-3 py-2 text-sm text-zinc-700"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                    >
                        {line}
                    </motion.p>
                ))}
            </div>
        </div>
    )
}
