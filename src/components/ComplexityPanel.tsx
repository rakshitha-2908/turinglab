import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ComplexityPoint } from '../types/turing'

interface ComplexityPanelProps {
    data: ComplexityPoint[]
}

export function ComplexityPanel({ data }: ComplexityPanelProps) {
    return (
        <div className="h-72 overflow-hidden rounded-3xl border border-white/60 bg-white/55 p-4 backdrop-blur-2xl">
            <h3 className="mb-3 text-base font-semibold text-black">Complexity Analyzer</h3>
            <ResponsiveContainer width="100%" height="88%">
                <LineChart data={data} margin={{ left: 0, right: 18, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis dataKey="inputSize" stroke="#3f3f46" />
                    <YAxis stroke="#3f3f46" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="steps" stroke="#ff6a00" strokeWidth={2.5} dot={{ r: 3 }} name="Steps" />
                    <Line type="monotone" dataKey="tapeUsage" stroke="#111111" strokeWidth={2.1} dot={{ r: 3 }} name="Tape Usage" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
