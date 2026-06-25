import React, { useState } from 'react';

export default function NotepadApp() {
  const [text, setText] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Menu bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--color-border-main)', paddingBottom: 2, marginBottom: 4 }}>
        {['File', 'Edit', 'Format', 'View', 'Help'].map(item => (
          <button
            key={item}
            style={{
              background: 'none',
              border: 'none',
              boxShadow: 'none',
              padding: '1px 6px',
              fontSize: 11,
              cursor: 'default',
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        spellCheck={false}
        style={{
          flex: 1,
          resize: 'none',
          border: '1px solid var(--color-border-main)',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 13,
          padding: 4,
          outline: 'none',
          background: '#fff',
          color: '#000',
          lineHeight: 1.5,
        }}
        placeholder="Type here..."
      />
      <div style={{ borderTop: '1px solid var(--color-border-main)', fontSize: 10, padding: '2px 4px', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Ln 1, Col 1</span>
        <span>{text.length} characters</span>
      </div>
    </div>
  );
}
