/**
 * @fileId a2c9cdde-4d6e-4dcc-a438-d56f8ef6bbc1
 * @module CivicOS/src/apps/IframeApp.jsx
 * @description Generic mount for vendored static apps (games, accessories) served from public/apps/.
 */

import React from 'react';

export default function IframeApp({ src, title }) {
  return (
    <iframe
      src={src}
      title={title}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
    />
  );
}
