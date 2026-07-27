/**
 * @fileId 5d2a8f13-9b47-4c60-a1e8-3c9f7e02b6d4
 * @module CivicOS/src/apps/NovaSystemApp.jsx
 * @description NovaSystem: run a problem through UNPACK, ANALYZE, SYNTHESIZE
 *              while three 8-bit agents work it on stage.
 *
 * The reasoning lives in nova/novaProcess.js as pure functions. This file is
 * presentation and timing only: it steps through the phases on a clock so the
 * work is watchable, which is the whole point of putting it on a desktop
 * instead of in a terminal.
 *
 * Honest labeling matters here. The process runs locally with no model call,
 * and the UI says so in the status bar rather than implying an agent is
 * thinking. When CivicOS gains its local AI gateway the seam is runNovaProcess.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Cpu, Play, RotateCcw, Save } from 'lucide-react';
import { useKernel } from '../kernel/CivicProvider.jsx';
import { EXPERTS, SAMPLE_PROBLEMS, runNovaProcess } from './nova/novaProcess.js';
import { journalEnabled, mirrorNovaRun } from './nova/journalBridge.js';
import './nova/nova8bit.css';

/** Where generated spritesheets land. Absent is fine: the CSS avatar covers it. */
const SPRITE_DIR = '/apps/nova/sprites';

const PHASES = [
  { id: 'unpack',     label: 'Unpack',     blurb: 'Sorting the statement into requirements, unknowns, risks, and timing.' },
  { id: 'analyze',    label: 'Analyze',    blurb: 'Three lenses, one at a time.' },
  { id: 'synthesize', label: 'Synthesize', blurb: 'Merging into one position with the gaps named.' },
];

/** ms per beat. Slow enough to read, fast enough not to feel like waiting. */
const BEAT = 1100;

/**
 * One agent on stage. Uses a generated spritesheet when one exists and falls
 * back to a CSS drawn avatar when it does not, so the app is never broken by
 * a missing asset.
 */
function Agent({ expert, state, line }) {
  const [hasSheet, setHasSheet] = useState(false);
  const [frames, setFrames] = useState(8);

  useEffect(() => {
    let cancelled = false;
    // Probe the sheet. A 404 is an expected outcome, not an error.
    fetch(`${SPRITE_DIR}/${expert.sprite}.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((meta) => {
        if (cancelled || !meta) return;
        setFrames(meta.frames || 8);
        setHasSheet(true);
      })
      .catch(() => { /* no sheet, use the fallback avatar */ });
    return () => { cancelled = true; };
  }, [expert.sprite]);

  return (
    <div className={`nova8-agent is-${state}`}>
      {line && <div className="nova8-bubble">{line}</div>}

      {hasSheet ? (
        <div
          className={`nova8-sprite ${state === 'active' ? 'is-playing' : ''}`}
          style={{
            backgroundImage: `url(${SPRITE_DIR}/${expert.sprite}.png)`,
            '--nova-frames': frames,
            '--nova-dur': '900ms',
          }}
          role="img"
          aria-label={`${expert.fullName}, ${state}`}
        />
      ) : (
        <div className="nova8-fallback" role="img" aria-label={`${expert.fullName}, ${state}`}>
          <i style={{ '--pc': expert.color }} />
        </div>
      )}

      <span className="nova8-nameplate" style={{ background: expert.color }}>
        {expert.name}
      </span>
      <span style={{ fontSize: 9, color: 'var(--nova-dim)' }}>{expert.lens}</span>
    </div>
  );
}

/** Stepped progress readout. Eight cells because eight is the era appropriate number. */
function PixelBar({ value }) {
  const cells = 8;
  const lit = Math.round(value * cells);
  return (
    <div className="nova8-bar" role="progressbar" aria-valuenow={Math.round(value * 100)}
         aria-valuemin={0} aria-valuemax={100}>
      {Array.from({ length: cells }, (_, i) => (
        <span key={i} className={i < lit ? 'on' : i === lit ? 'pending' : ''} />
      ))}
    </div>
  );
}

export default function NovaSystemApp() {
  const { logEvent } = useKernel();

  const [problem, setProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [result, setResult] = useState(null);
  const [phase, setPhase] = useState(-1);      // -1 idle, 0..2 running, 3 done
  const [speaking, setSpeaking] = useState(-1); // which expert holds the floor
  const [rows, setRows] = useState([]);
  const [saved, setSaved] = useState(false);
  // '' until a mirror is attempted, then 'ok' or the reason it did not land.
  // Reported rather than hidden: a silent mirror failure is how a memory ends
  // up with a hole in it that nobody notices.
  const [mirrored, setMirrored] = useState('');

  const timers = useRef([]);
  const logRef = useRef(null);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // Keep the newest line in view. `phase` is in the deps because the final
  // report renders on the phase change, after the last row lands: without it
  // the summary and next actions stay below the fold.
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [rows, phase]);

  const running = phase >= 0 && phase < 3;

  const run = useCallback(() => {
    if (!problem.trim() || running) return;
    clearTimers();
    setRows([]);
    setSaved(false);
    setMirrored('');

    const outcome = runNovaProcess(problem);
    setResult(outcome);

    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    const push = (row) => setRows((prev) => [...prev, row]);
    let t = 0;

    // UNPACK
    setPhase(0);
    setSpeaking(-1);
    const { unpacked, analysis, synthesis } = outcome;
    at((t += 250), () => push({
      kind: 'phase',
      text: `Read ${unpacked.sentences.length} sentence(s). Found ${unpacked.facets.length} facet(s).`,
    }));
    Object.entries(unpacked.counts).forEach(([type, n]) => {
      at((t += 240), () => push({ kind: 'facet', text: `${n} × ${type}` }));
    });
    if (unpacked.unstructured) {
      at((t += 240), () => push({
        kind: 'facet',
        text: 'No requirement, deadline, or constraint detected in the text.',
      }));
    }

    // ANALYZE, one expert at a time so the stage reads as a conversation.
    at((t += 500), () => setPhase(1));
    analysis.forEach(({ expert, points }, i) => {
      at((t += 400), () => setSpeaking(i));
      points.forEach((p) => {
        at((t += BEAT), () => push({
          kind: 'point',
          who: expert.name,
          color: expert.color,
          claim: p.claim,
          why: p.because,
          ask: p.ask,
        }));
      });
    });

    // SYNTHESIZE
    at((t += 500), () => { setPhase(2); setSpeaking(-1); });
    at((t += 400), () => push({ kind: 'verdict', text: synthesis.verdict }));
    at((t += 400), () => push({ kind: 'summary', text: synthesis.summary }));
    at((t += 400), () => setPhase(3));
  }, [problem, running, clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setPhase(-1);
    setSpeaking(-1);
    setRows([]);
    setResult(null);
    setSaved(false);
    setMirrored('');
  }, [clearTimers]);

  // Write the run to the civic ledger. Same event stream the Event Viewer reads,
  // so a Nova run becomes part of the audit trail like any other civic action.
  const saveToLedger = useCallback(() => {
    if (!result || saved) return;
    const detail = {
      problem: result.problem.slice(0, 500),
      facets: result.unpacked.facets.length,
      specification: Number(result.synthesis.specification.toFixed(2)),
      verdict: result.synthesis.verdict,
      gaps: result.synthesis.gaps,
      actions: result.synthesis.actions,
    };
    logEvent?.('nova.run', detail);
    setSaved(true);

    // Then mirror it into the shared agent journal, so this run is visible to
    // SimpleAgentOS and NovaSystem too. Strictly after the ledger write and
    // never awaited: the ledger is the record, this is only an index onto it.
    // Off unless VITE_NOVA_JOURNAL=1, and it cannot throw.
    if (journalEnabled()) {
      mirrorNovaRun(detail).then((r) => setMirrored(r.ok ? 'ok' : r.reason));
    }
  }, [result, saved, logEvent]);

  const agentState = useMemo(() => (i) => {
    if (phase < 1) return 'idle';
    if (phase === 1) return speaking === i ? 'active' : speaking > i ? 'done' : 'idle';
    return 'done';
  }, [phase, speaking]);

  const progress = phase < 0 ? 0 : Math.min(1, (phase + 1) / 3);

  return (
    <div className="nova8" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Stage */}
      <div className="nova8-crt nova8-stage">
        {EXPERTS.map((expert, i) => (
          <Agent
            key={expert.id}
            expert={expert}
            state={agentState(i)}
            line={phase === 1 && speaking === i ? 'Working...' : ''}
          />
        ))}
      </div>

      {/* Phase banner */}
      <div className="nova8-banner" key={phase}>
        <Cpu size={13} />
        <span>
          {phase < 0 ? 'Standby'
            : phase >= 3 ? 'Complete'
            : PHASES[phase].label}
        </span>
        <span style={{
          marginLeft: 'auto',
          letterSpacing: 0,
          fontWeight: 400,
          textTransform: 'none',
          color: 'var(--nova-dim)',
          fontSize: 10,
        }}>
          {phase < 0 ? 'Type a problem, then run the process.'
            : phase >= 3 ? 'Three lenses applied. Review the asks below.'
            : PHASES[phase].blurb}
        </span>
      </div>

      {/* Log */}
      <div className="nova8-log" ref={logRef}>
        {rows.length === 0 && (
          <div style={{ color: 'var(--nova-dim)' }}>
            <span className="nova8-caret">Awaiting input</span>
          </div>
        )}

        {rows.map((row, i) => {
          if (row.kind === 'point') {
            return (
              <div className="nova8-row" key={i} style={{ borderLeftColor: row.color }}>
                <b>{row.who}:</b> {row.claim}
                <div className="why">{row.why}</div>
                <div className="ask">&gt; {row.ask}</div>
              </div>
            );
          }
          if (row.kind === 'verdict') {
            return (
              <div className="nova8-row" key={i}
                   style={{ borderLeftColor: 'var(--nova-amber)', color: 'var(--nova-amber)' }}>
                <b style={{ color: 'var(--nova-amber)' }}>SYNTHESIS:</b> {row.text}
              </div>
            );
          }
          return (
            <div className="nova8-row" key={i} style={{ color: 'var(--nova-dim)' }}>
              {row.text}
            </div>
          );
        })}

        {/* Final report */}
        {phase >= 3 && result && (
          <div style={{ marginTop: 10, paddingTop: 8, borderTop: '2px solid var(--nova-line)' }}>
            <div style={{ marginBottom: 6 }}>
              <div style={{ marginBottom: 3, color: 'var(--nova-dim)' }}>
                Specification score: {Math.round(result.synthesis.specification * 100)}%
              </div>
              <PixelBar value={result.synthesis.specification} />
              <div style={{ marginTop: 4, fontSize: 10, color: 'var(--nova-dim)' }}>
                This scores how completely the problem is stated, not how good the
                answer is. A high score on a bad idea is still a bad idea.
              </div>
            </div>

            <div style={{ marginTop: 8, color: 'var(--nova-cyan)', fontWeight: 700 }}>
              NEXT ACTIONS
            </div>
            <ol style={{ margin: '4px 0 0 18px', padding: 0 }}>
              {result.synthesis.actions.map((action, i) => (
                <li key={i} style={{ marginBottom: 3 }}>
                  <span style={{ color: 'var(--nova-dim)' }}>[{action.owner}]</span> {action.do}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Input and controls */}
      <div style={{
        padding: 8,
        background: 'var(--nova-panel)',
        borderTop: '2px solid var(--nova-line)',
      }}>
        <label htmlFor="nova-problem" style={{
          display: 'block', marginBottom: 4, fontSize: 10, color: 'var(--nova-dim)',
        }}>
          Problem statement
        </label>
        <textarea
          id="nova-problem"
          className="nova8-input"
          rows={3}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          disabled={running}
          placeholder="Describe the decision. Include what must be true, by when, and who is affected."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
          <button className="nova8-btn" onClick={run} disabled={running || !problem.trim()}>
            <Play size={10} style={{ verticalAlign: -1, marginRight: 4 }} />
            {running ? 'Running' : 'Run process'}
          </button>

          <button className="nova8-btn ghost" onClick={reset} disabled={phase < 0}>
            <RotateCcw size={10} style={{ verticalAlign: -1, marginRight: 4 }} />
            Reset
          </button>

          <button className="nova8-btn ghost" onClick={saveToLedger} disabled={phase < 3 || saved}>
            <Save size={10} style={{ verticalAlign: -1, marginRight: 4 }} />
            {saved ? 'Saved' : 'Save to ledger'}
          </button>

          <select
            className="nova8-input"
            style={{ width: 'auto', flex: '1 1 150px', padding: '3px 5px' }}
            value=""
            disabled={running}
            onChange={(e) => { if (e.target.value) setProblem(e.target.value); }}
            aria-label="Load an example problem"
          >
            <option value="">Load an example...</option>
            {SAMPLE_PROBLEMS.map((sample, i) => (
              <option key={i} value={sample}>
                Example {i + 1}: {sample.slice(0, 42)}...
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 6, fontSize: 9, color: 'var(--nova-dim)' }}>
          Runs locally on your text. No model call. The three lenses are fixed
          heuristics, so the same input always gives the same output.
          {' '}
          {journalEnabled()
            ? 'Saving also mirrors the run to the local agent journal.'
            : 'No network.'}
          {mirrored && mirrored !== 'ok' && (
            <span style={{ color: 'var(--nova-warn, #d9a657)' }}>
              {' '}Journal mirror failed ({mirrored}). The ledger entry was still written.
            </span>
          )}
          {mirrored === 'ok' && <span>{' '}Mirrored to the agent journal.</span>}
        </div>
      </div>
    </div>
  );
}
