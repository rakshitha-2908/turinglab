import { useMemo } from 'react'
import ReactFlow, { Background, Handle, Position, MarkerType } from 'reactflow'
import type { Edge, Node, EdgeProps, NodeProps } from 'reactflow'
import 'reactflow/dist/style.css'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TransitionGraphProps {
    states: string[]
    edges: Array<{ id: string; source: string; target: string; label: string }>
    activeTransition: string
}

/* ------------------------------------------------------------------ */
/*  Custom Node – with handles on all four sides                      */
/* ------------------------------------------------------------------ */

function StateNode({ data }: NodeProps) {
    return (
        <div
            style={{
                borderRadius: 22,
                border: '2px solid rgba(0,0,0,0.12)',
                background: 'rgba(255,255,255,0.94)',
                padding: '8px 20px',
                color: '#111',
                fontWeight: 600,
                fontSize: 13,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                minWidth: 60,
                textAlign: 'center',
                position: 'relative',
            }}
        >
            <Handle type="target" position={Position.Top} id="top-t" style={{ opacity: 0, width: 1, height: 1 }} />
            <Handle type="source" position={Position.Top} id="top-s" style={{ opacity: 0, width: 1, height: 1 }} />

            <Handle type="target" position={Position.Right} id="right-t" style={{ opacity: 0, width: 1, height: 1 }} />
            <Handle type="source" position={Position.Right} id="right-s" style={{ opacity: 0, width: 1, height: 1 }} />

            <Handle type="target" position={Position.Bottom} id="bottom-t" style={{ opacity: 0, width: 1, height: 1 }} />
            <Handle type="source" position={Position.Bottom} id="bottom-s" style={{ opacity: 0, width: 1, height: 1 }} />

            <Handle type="target" position={Position.Left} id="left-t" style={{ opacity: 0, width: 1, height: 1 }} />
            <Handle type="source" position={Position.Left} id="left-s" style={{ opacity: 0, width: 1, height: 1 }} />

            {data.label}
        </div>
    )
}

const nodeTypes = { stateNode: StateNode }

/* ------------------------------------------------------------------ */
/*  Custom self-loop edge                                              */
/* ------------------------------------------------------------------ */

function SelfLoopEdge({ id, sourceX, sourceY, style, markerEnd, data }: EdgeProps) {
    const loopSize = 42
    const x = sourceX
    const y = sourceY

    // Cubic bezier loop that arcs above the node
    const d = `M ${x - 14} ${y} C ${x - loopSize} ${y - loopSize * 2.2}, ${x + loopSize} ${y - loopSize * 2.2}, ${x + 14} ${y}`

    // Position the label at the apex of the loop
    const labelX = x
    const labelY = y - loopSize * 1.7

    const labelText = data?.label ? String(data.label) : ''

    return (
        <g>
            <path
                id={id}
                d={d}
                style={style}
                fill="none"
                markerEnd={markerEnd as string}
            />
            {labelText && (
                <>
                    {/* White background behind label for readability */}
                    <rect
                        x={labelX - labelText.length * 3.2 - 4}
                        y={labelY - 8}
                        width={labelText.length * 6.4 + 8}
                        height={16}
                        rx={4}
                        ry={4}
                        fill="rgba(255,255,255,0.92)"
                    />
                    <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontSize: 11, fontWeight: 600, fill: '#333' }}
                    >
                        {labelText}
                    </text>
                </>
            )}
        </g>
    )
}

const edgeTypes = { selfLoop: SelfLoopEdge }

/* ------------------------------------------------------------------ */
/*  Layout helpers                                                     */
/* ------------------------------------------------------------------ */

function layoutPositions(count: number): Array<{ x: number; y: number }> {
    if (count === 0) return []
    if (count === 1) return [{ x: 300, y: 160 }]
    if (count === 2) return [{ x: 160, y: 160 }, { x: 460, y: 160 }]
    if (count === 3)
        return [
            { x: 310, y: 60 },
            { x: 120, y: 240 },
            { x: 500, y: 240 },
        ]
    if (count === 4)
        return [
            { x: 120, y: 80 },
            { x: 460, y: 80 },
            { x: 120, y: 280 },
            { x: 460, y: 280 },
        ]

    // 5+ nodes: multi-row grid
    const cols = Math.min(3, Math.ceil(Math.sqrt(count)))
    const rows = Math.ceil(count / cols)
    const hSpacing = 220
    const vSpacing = 160
    const totalW = (cols - 1) * hSpacing
    const totalH = (rows - 1) * vSpacing
    const offsetX = 300 - totalW / 2
    const offsetY = 180 - totalH / 2

    const positions: Array<{ x: number; y: number }> = []
    for (let i = 0; i < count; i++) {
        const row = Math.floor(i / cols)
        const col = i % cols
        positions.push({
            x: offsetX + col * hSpacing,
            y: offsetY + row * vSpacing,
        })
    }
    return positions
}

/**
 * Based on the direction from source to target, pick the best handles.
 */
function pickHandles(
    sx: number, sy: number, tx: number, ty: number
): { sourceHandle: string; targetHandle: string } {
    const dx = tx - sx
    const dy = ty - sy
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (absDx > absDy) {
        if (dx > 0) {
            return { sourceHandle: 'right-s', targetHandle: 'left-t' }
        } else {
            return { sourceHandle: 'left-s', targetHandle: 'right-t' }
        }
    } else {
        if (dy > 0) {
            return { sourceHandle: 'bottom-s', targetHandle: 'top-t' }
        } else {
            return { sourceHandle: 'top-s', targetHandle: 'bottom-t' }
        }
    }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TransitionGraph({ states, edges, activeTransition }: TransitionGraphProps) {
    const positions = useMemo(() => layoutPositions(states.length), [states.length])

    const posMap = useMemo(() => {
        const m: Record<string, { x: number; y: number }> = {}
        states.forEach((s, i) => {
            m[s] = positions[i]
        })
        return m
    }, [states, positions])

    const nodes = useMemo<Node[]>(() => {
        return states.map((state, idx) => ({
            id: state,
            type: 'stateNode',
            position: positions[idx],
            data: { label: state },
        }))
    }, [states, positions])

    const flowEdges = useMemo<Edge[]>(() => {
        return edges.map((edge) => {
            const isSelfLoop = edge.source === edge.target

            const isActive =
                activeTransition.includes(edge.source) &&
                activeTransition.includes(edge.target)

            const strokeColor = isActive ? '#ff6a00' : '#777'
            const strokeWidth = isActive ? 2.5 : 1.4

            if (isSelfLoop) {
                return {
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    type: 'selfLoop',
                    sourceHandle: 'top-s',
                    targetHandle: 'top-t',
                    data: { label: edge.label },
                    style: {
                        stroke: strokeColor,
                        strokeWidth,
                    },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 14,
                        height: 14,
                        color: strokeColor,
                    },
                }
            }

            // Pick handles based on direction between source and target
            const sPos = posMap[edge.source] ?? { x: 0, y: 0 }
            const tPos = posMap[edge.target] ?? { x: 0, y: 0 }
            const { sourceHandle, targetHandle } = pickHandles(sPos.x, sPos.y, tPos.x, tPos.y)

            return {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle,
                targetHandle,
                type: 'default',
                label: edge.label,
                style: {
                    stroke: strokeColor,
                    strokeWidth,
                },
                labelStyle: {
                    fill: '#333',
                    fontSize: 11,
                    fontWeight: 600,
                },
                labelBgStyle: {
                    fill: 'rgba(255,255,255,0.88)',
                    rx: 4,
                    ry: 4,
                },
                labelBgPadding: [6, 3] as [number, number],
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 14,
                    height: 14,
                    color: strokeColor,
                },
            }
        })
    }, [activeTransition, edges, posMap])

    return (
        <div
            className="relative w-full overflow-hidden rounded-3xl border border-white/60 bg-white/55 backdrop-blur-2xl"
            style={{ height: 'clamp(320px, 38vw, 440px)' }}
        >
            <ReactFlow
                fitView
                fitViewOptions={{ padding: 0.4, maxZoom: 1.0, minZoom: 0.3 }}
                nodes={nodes}
                edges={flowEdges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                proOptions={{ hideAttribution: true }}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={false}
                zoomOnScroll={true}
                panOnScroll={false}
                minZoom={0.25}
                maxZoom={2}
            >
                <Background color="rgba(0,0,0,0.04)" gap={22} />
            </ReactFlow>
        </div>
    )
}
