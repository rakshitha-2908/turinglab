import { motion } from 'framer-motion'
import type { NondetSnapshot } from '../types/turing'

interface NondetTreeViewProps {
    snapshot: NondetSnapshot
}

export function NondetTreeView({ snapshot }: NondetTreeViewProps) {
    return (
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-4 backdrop-blur-2xl">
            <h3 className="mb-3 text-base font-semibold text-black">Branching Execution Tree</h3>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                {snapshot.branches.map((branch, idx) => (
                    <motion.div
                        key={branch.id}
                        className={`rounded-2xl border px-3 py-2 text-sm ${branch.result === 'accept'
                                ? 'border-emerald-200 bg-emerald-50'
                                : branch.result === 'reject'
                                    ? 'border-rose-200 bg-rose-50'
                                    : 'border-zinc-200 bg-white/85'
                            }`}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.22, delay: idx * 0.02 }}
                    >
                        <div className="font-semibold text-zinc-800">{branch.id}</div>
                        <div className="text-zinc-600">state: {branch.state}</div>
                        <div className="text-zinc-600">depth: {branch.depth}</div>
                        <div className="text-zinc-600">from: {branch.parentId ?? 'root'}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
