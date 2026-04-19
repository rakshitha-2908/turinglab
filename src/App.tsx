import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ComplexityPanel } from './components/ComplexityPanel'
import { ControlPanel } from './components/ControlPanel'
import { ExplanationPanel } from './components/ExplanationPanel'
import { LandingOverlay } from './components/LandingOverlay'
import { ModeNavbar } from './components/ModeNavbar'
import { MultiTapeView } from './components/MultiTapeView'
import { NondetTreeView } from './components/NondetTreeView'
import { Sidebar } from './components/Sidebar'
import { StatePanel } from './components/StatePanel'
import { TapeView } from './components/TapeView'
import { TransitionGraph } from './components/TransitionGraph'
import { selectGraphData, useTuringStore } from './store/turingStore'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const state = useTuringStore()

  useEffect(() => {
    if (!state.running) return
    const timer = window.setInterval(() => state.step(), state.speed)
    return () => window.clearInterval(timer)
  }, [state, state.running, state.speed])

  const graphEdges = useMemo(() => selectGraphData(state), [state])

  const graphStates = useMemo(() => {
    if (state.mode === 'multi') return state.multiMachine.states
    if (state.mode === 'nondet') return state.nondetMachine.states
    if (state.mode === 'single') return state.singleMachine.states
    try {
      const decoded = JSON.parse(state.universalEncoded) as { states?: string[] }
      return decoded.states ?? state.singleMachine.states
    } catch {
      return state.singleMachine.states
    }
  }, [state])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-white via-zinc-100 to-white px-4 pb-8 pt-6 md:px-6">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-zinc-200/70 blur-3xl" />

      <AnimatePresence>
        <LandingOverlay open={showLanding} onStart={() => setShowLanding(false)} />
      </AnimatePresence>

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto mb-4 flex w-full max-w-[1480px] items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black md:text-4xl">TuringLab</h1>
          <p className="text-sm text-zinc-600">Interactive Turing Machine Studio</p>
        </div>
      </motion.header>

      <main className="mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-4 xl:grid-cols-[340px_1fr]">
        <Sidebar
          mode={state.mode}
          input={state.input}
          machineEditor={state.machineEditor}
          validationError={state.validationError}
          selectedPreset={state.selectedPreset}
          onInput={state.setInput}
          onEditor={state.updateMachineEditor}
          onApply={state.applyEditorMachine}
          onLoadPreset={state.loadPreset}
        />

        <section className="min-w-0 space-y-4">
          <ModeNavbar mode={state.mode} onMode={state.setMode} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-4 overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-4 backdrop-blur-2xl">
              {state.mode === 'single' ? <TapeView tape={state.singleSnapshot.tape} head={state.singleSnapshot.head} title="Single Tape" /> : null}
              {state.mode === 'multi' ? <MultiTapeView tapes={state.multiSnapshot.tapes} heads={state.multiSnapshot.heads} /> : null}
              {state.mode === 'nondet' ? (
                <>
                  <TapeView
                    tape={state.nondetSnapshot.branches[0]?.tape ?? ['_']}
                    head={state.nondetSnapshot.branches[0]?.head ?? 0}
                    title="Representative Tape"
                  />
                  <NondetTreeView snapshot={state.nondetSnapshot} />
                </>
              ) : null}
              {state.mode === 'universal' ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 p-3">
                    <div className="mb-2 text-sm font-semibold text-zinc-700">Encoded Machine</div>
                    <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-all text-xs text-zinc-600">{state.universalSnapshot.encoded}</pre>
                  </div>
                  <div>
                    <TapeView tape={state.universalSnapshot.inner.tape} head={state.universalSnapshot.inner.head} title="Execution Tape" />
                  </div>
                </div>
              ) : null}

              <TransitionGraph states={graphStates} edges={graphEdges} activeTransition={state.activeTransition} />
            </div>

            <div className="min-w-0 space-y-4">
              <StatePanel
                title="State Display"
                state={
                  state.mode === 'single'
                    ? state.singleSnapshot.state
                    : state.mode === 'multi'
                      ? state.multiSnapshot.state
                      : state.mode === 'nondet'
                        ? state.nondetSnapshot.branches[0]?.state ?? 'none'
                        : state.universalSnapshot.inner.state
                }
                symbol={
                  state.mode === 'single'
                    ? state.singleSnapshot.currentSymbol
                    : state.mode === 'multi'
                      ? state.multiSnapshot.currentSymbols.join(',')
                      : state.mode === 'nondet'
                        ? state.nondetSnapshot.branches[0]?.tape[state.nondetSnapshot.branches[0]?.head ?? 0] ?? '_'
                        : state.universalSnapshot.inner.currentSymbol
                }
                transition={state.activeTransition}
                steps={
                  state.mode === 'single'
                    ? state.singleSnapshot.steps
                    : state.mode === 'multi'
                      ? state.multiSnapshot.steps
                      : state.mode === 'nondet'
                        ? state.nondetSnapshot.steps
                        : state.universalSnapshot.inner.steps
                }
                result={
                  state.mode === 'single'
                    ? state.singleSnapshot.result
                    : state.mode === 'multi'
                      ? state.multiSnapshot.result
                      : state.mode === 'nondet'
                        ? state.nondetSnapshot.halted
                          ? state.nondetSnapshot.acceptedBranchId
                            ? 'accept'
                            : 'reject'
                          : 'running'
                        : state.universalSnapshot.inner.result
                }
              />
              <ExplanationPanel history={state.explainHistory} />
            </div>
          </div>

          <ControlPanel
            running={state.running}
            speed={state.speed}
            onRunPause={() => state.setRunning(!state.running)}
            onStep={() => state.step()}
            onReset={state.reset}
            onSpeed={state.setSpeed}
          />

          <ComplexityPanel data={state.complexityData} />

          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/55 p-3 text-sm text-zinc-600 backdrop-blur-2xl">
            Comparison Insight: current mode is <strong className="text-black">{state.mode}</strong>. Run different presets and compare the complexity chart to contrast single-tape and multi-tape behavior.
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
