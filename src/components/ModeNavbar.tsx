import { motion } from 'framer-motion'
import { Bot, GitBranchPlus, Layers3, Orbit } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Mode } from '../types/turing'

interface ModeNavbarProps {
    mode: Mode
    onMode: (mode: Mode) => void
}

const items: Array<{ mode: Mode; label: string; icon: ReactNode }> = [
    { mode: 'single', label: 'Single Tape', icon: <Layers3 size={16} /> },
    { mode: 'multi', label: 'Multi Tape', icon: <Bot size={16} /> },
    { mode: 'nondet', label: 'Non-Deterministic', icon: <GitBranchPlus size={16} /> },
    { mode: 'universal', label: 'Universal', icon: <Orbit size={16} /> },
]

export function ModeNavbar({ mode, onMode }: ModeNavbarProps) {
    return (
        <div className="rounded-3xl border border-white/60 bg-white/55 p-3 backdrop-blur-2xl">
            <div className="flex flex-wrap items-center gap-2">
                {items.map((item) => (
                    <button
                        key={item.mode}
                        onClick={() => onMode(item.mode)}
                        className={`relative flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${mode === item.mode ? 'text-black' : 'text-zinc-600 hover:text-black'
                            }`}
                    >
                        {mode === item.mode ? (
                            <motion.span
                                layoutId="mode-pill"
                                className="absolute inset-0 rounded-2xl border border-orange-300 bg-orange-100"
                                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                            />
                        ) : null}
                        <span className="relative z-10 flex items-center gap-2">
                            {item.icon}
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}
