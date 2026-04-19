import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Download, Eye, EyeOff, FileUp, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { presets } from '../data/presets'
import type { Mode } from '../types/turing'

interface SidebarProps {
    mode: Mode
    input: string
    machineEditor: string
    validationError: string
    selectedPreset: string
    onInput: (value: string) => void
    onEditor: (value: string) => void
    onApply: () => void
    onLoadPreset: (id: string) => void
}

export function Sidebar({
    mode,
    input,
    machineEditor,
    validationError,
    selectedPreset,
    onInput,
    onEditor,
    onApply,
    onLoadPreset,
}: SidebarProps) {
    const importRef = useRef<HTMLInputElement | null>(null)
    const [showJson, setShowJson] = useState(false)

    const onImport = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            const content = String(reader.result ?? '')
            onEditor(content)
        }
        reader.readAsText(file)
    }

    const onExport = () => {
        const blob = new Blob([machineEditor], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `turinglab-${mode}-machine.json`
        anchor.click()
        URL.revokeObjectURL(url)
    }

    return (
        <aside className="overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-5 backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-black">Machine Config</h2>
                <Sparkles className="text-orange-500" size={18} />
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Preset Library</label>
                    <select
                        value={selectedPreset}
                        onChange={(event) => onLoadPreset(event.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm"
                    >
                        {presets.map((preset) => (
                            <option key={preset.id} value={preset.id}>
                                {preset.name} ({preset.mode})
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-zinc-500">{presets.find((preset) => preset.id === selectedPreset)?.description}</p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Input String</label>
                    <input
                        value={input}
                        onChange={(event) => onInput(event.target.value)}
                        className="w-full rounded-2xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm"
                        placeholder="Enter tape input"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Machine JSON</label>
                        <button
                            onClick={() => setShowJson(!showJson)}
                            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
                            title={showJson ? 'Hide JSON editor' : 'Show JSON editor'}
                        >
                            {showJson ? <EyeOff size={14} /> : <Eye size={14} />}
                            {showJson ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <AnimatePresence initial={false}>
                        {showJson && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/90">
                                    <textarea
                                        value={machineEditor}
                                        onChange={(event) => onEditor(event.target.value)}
                                        className="block h-72 w-full resize-none overflow-y-auto p-3 pr-4 font-mono text-xs text-zinc-700"
                                        style={{
                                            scrollbarWidth: 'thin',
                                            scrollbarGutter: 'stable',
                                        }}
                                        spellCheck={false}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {validationError ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">{validationError}</p> : null}

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={onApply}
                        className="rounded-2xl border border-orange-300 bg-gradient-to-r from-orange-500 to-orange-400 px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(255,106,0,0.3)]"
                    >
                        Apply Machine
                    </button>
                    <button
                        onClick={onExport}
                        className="flex items-center justify-center gap-1 rounded-2xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm font-semibold text-zinc-700"
                    >
                        <Download size={14} /> Export
                    </button>
                </div>

                <button
                    onClick={() => importRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white/90 px-3 py-2 text-sm font-semibold text-zinc-700"
                >
                    <FileUp size={14} /> Import JSON
                </button>
                <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={onImport} />
            </div>
        </aside>
    )
}
