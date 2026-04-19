import { motion } from 'framer-motion'

interface LandingOverlayProps {
    open: boolean
    onStart: () => void
}

export function LandingOverlay({ open, onStart }: LandingOverlayProps) {
    if (!open) return null

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 p-6 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="w-full max-w-3xl rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-white to-orange-50 p-10 text-center shadow-[0_35px_70px_rgba(0,0,0,0.12)]"
                initial={{ y: 20, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
                <div className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">TuringLab</div>
                <h1 className="text-4xl font-bold leading-tight text-black md:text-6xl">Visual Computing for Turing Machines</h1>
                <p className="mx-auto mt-5 max-w-2xl text-zinc-600">
                    Explore deterministic, multi-tape, nondeterministic, and universal computation with rich animation, explain mode, and graph-level insights.
                </p>
                <button
                    onClick={onStart}
                    className="mt-8 rounded-2xl border border-orange-300 bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(255,106,0,0.35)] transition hover:scale-[1.02]"
                >
                    Start Simulation
                </button>
            </motion.div>
        </motion.div>
    )
}
