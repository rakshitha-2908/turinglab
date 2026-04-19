import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { motion } from 'framer-motion'

interface ControlPanelProps {
    running: boolean
    speed: number
    onRunPause: () => void
    onStep: () => void
    onReset: () => void
    onSpeed: (value: number) => void
}

const baseButton =
    'flex items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm backdrop-blur-lg transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_0_25px_rgba(255,106,0,0.18)]'

const MIN_SPEED = 120
const MAX_SPEED = 1200

export function ControlPanel({ running, speed, onRunPause, onStep, onReset, onSpeed }: ControlPanelProps) {
    // speed is an interval in ms – higher value = slower execution
    // We invert the slider so dragging RIGHT = faster (lower ms interval)
    const sliderValue = MIN_SPEED + MAX_SPEED - speed

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = Number(event.target.value)
        // Invert back: slider high ⇒ interval low (fast)
        onSpeed(MIN_SPEED + MAX_SPEED - raw)
    }

    return (
        <motion.div
            layout
            className="rounded-3xl border border-white/60 bg-white/55 p-4 backdrop-blur-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex flex-wrap items-center gap-3">
                <button className={baseButton} onClick={onRunPause}>
                    {running ? <Pause size={16} /> : <Play size={16} />}
                    {running ? 'Pause' : 'Run'}
                </button>
                <button className={baseButton} onClick={onStep}>
                    <StepForward size={16} />
                    Step Forward
                </button>
                <button className={baseButton} onClick={onReset}>
                    <RotateCcw size={16} />
                    Reset
                </button>
                <div className="ml-auto flex min-w-56 items-center gap-3 rounded-2xl border border-zinc-200/60 bg-white/90 px-3 py-2">
                    <label htmlFor="speed" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 whitespace-nowrap">
                        Speed
                    </label>
                    <input
                        id="speed"
                        type="range"
                        min={MIN_SPEED}
                        max={MAX_SPEED}
                        step={10}
                        value={sliderValue}
                        onChange={handleSliderChange}
                        className="w-full accent-orange-500"
                    />
                </div>
            </div>
        </motion.div>
    )
}
