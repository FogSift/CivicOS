/**
 * @fileId 7dc71355-84e0-460b-bc58-75d3249aa4d5
 * @module CivicOS/components/AddNodeModal
 * @description Modal dialog for submitting a new funding lead to The Plaza.
 *              Uses xp.css .window chrome for authentic look + theme support.
 */

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { GRANT_TYPES } from '../constants.js';

const DEFAULT_NODE = {
  title: '',
  type: 'Federal Grant',
  bounty: '',
  deadline: '',
  fitScore: 50,
};

export default function AddNodeModal({ onSave, onClose }) {
  const [node, setNode] = useState(DEFAULT_NODE);

  const handleSave = () => {
    onSave(node);
    setNode(DEFAULT_NODE);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div className="window" style={{ width: '440px', maxWidth: '95vw' }}>

        <div className="title-bar">
          <div className="title-bar-text">Add New Lead</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onClose} />
          </div>
        </div>

        <div className="window-body" style={{ padding: '16px 20px 20px' }}>

          <div className="field-row-stacked" style={{ marginBottom: '12px' }}>
            <label htmlFor="modal-title">
              Title <span style={{ color: 'var(--color-error-from)' }}>*</span>
            </label>
            <input
              id="modal-title"
              type="text"
              value={node.title}
              onChange={e => setNode({ ...node, title: e.target.value })}
              placeholder="e.g. Knight Foundation: Civic Tech"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div className="field-row-stacked" style={{ marginBottom: '12px' }}>
            <label htmlFor="modal-type">Type</label>
            <select
              id="modal-type"
              value={node.type}
              onChange={e => setNode({ ...node, type: e.target.value })}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              {GRANT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <div className="field-row-stacked" style={{ flex: 1 }}>
              <label htmlFor="modal-bounty">Bounty ($)</label>
              <input
                id="modal-bounty"
                type="text"
                value={node.bounty}
                onChange={e => setNode({ ...node, bounty: e.target.value })}
                placeholder="50,000"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <div className="field-row-stacked" style={{ flex: 1 }}>
              <label htmlFor="modal-deadline">Deadline</label>
              <input
                id="modal-deadline"
                type="date"
                value={node.deadline}
                onChange={e => setNode({ ...node, deadline: e.target.value })}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div className="field-row-stacked" style={{ marginBottom: '16px' }}>
            <label>
              Fit Score: <strong style={{ color: 'var(--color-accent-primary)' }}>{node.fitScore} / 100</strong>
            </label>
            <input
              type="range"
              min="0" max="100"
              value={node.fitScore}
              onChange={e => setNode({ ...node, fitScore: e.target.value })}
              style={{ width: '100%', accentColor: 'var(--color-accent-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              <span>0 - Long Shot</span>
              <span>100 - Perfect Fit</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleSave} disabled={!node.title} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={11} />
              Add to Plaza
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
