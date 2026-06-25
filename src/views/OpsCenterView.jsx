/**
 * @fileId 0f341fd8-c2d6-467f-8ab1-fde2c62f2de7
 * @module CivicOS/views/OpsCenterView
 * @description 5050-first operations center. Loads CivicOS app registry and manifests from /api/apps/*.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { AppWindow, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

const statusColor = {
  ok:      'var(--color-success)',
  error:   'var(--color-error-from)',
  unknown: 'var(--color-text-muted)',
};

export default function OpsCenterView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registry, setRegistry] = useState(null);
  const [manifests, setManifests] = useState([]);
  const [checkStatuses, setCheckStatuses] = useState({});

  const appCount = useMemo(() => manifests.length, [manifests]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const registryRes = await fetch('/api/apps/index.json', { cache: 'no-store' });
        if (!registryRes.ok) throw new Error(`Registry HTTP ${registryRes.status}`);
        const registryJson = await registryRes.json();
        setRegistry(registryJson);

        const manifestResponses = await Promise.all(
          (registryJson.apps || []).map(async (app) => {
            const response = await fetch(app.manifest, { cache: 'no-store' });
            if (!response.ok) throw new Error(`${app.id} manifest HTTP ${response.status}`);
            return response.json();
          })
        );

        setManifests(manifestResponses);

        const checks = {};
        for (const manifest of manifestResponses) {
          for (const check of manifest.checks || []) {
            try {
              const response = await fetch(check.endpoint, { cache: 'no-store' });
              checks[check.id] = response.status === (check.expectedStatus || 200) ? 'ok' : 'error';
            } catch {
              checks[check.id] = 'error';
            }
          }
        }
        setCheckStatuses(checks);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="max-w-5xl space-y-4">
      <div className="pb-2 mb-4" style={{ borderBottom: '1px solid var(--color-border-main)' }}>
        <p className="text-xl font-bold flex items-center" style={{ color: 'var(--color-text-primary)' }}>
          <AppWindow size={20} className="mr-2" style={{ color: 'var(--color-accent-primary)' }} />
          Ops Center
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>CivicOS app registry and namespace health on localhost:5050.</p>
      </div>

      {loading && (
        <div className="text-sm flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          <Loader2 size={16} className="animate-spin" />
          Loading app registry...
        </div>
      )}

      {!loading && error && (
        <div className="p-3 text-sm" style={{ background: 'var(--color-infobar-bg)', border: '1px solid var(--color-error-from)', color: 'var(--color-error-from)' }}>
          Failed to load app registry: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="rounded-sm overflow-hidden shadow-sm" style={{ border: '1px solid var(--color-border-inner)', background: 'var(--color-panel-bg)' }}>
            <div className="px-3 py-1.5" style={{ background: 'linear-gradient(to right, #f0f0f0, #e0e0e0)' }}>
              <span className="font-bold text-xs tracking-wide" style={{ color: 'var(--color-text-link)' }}>Registry Summary</span>
            </div>
            <div className="p-3 text-xs space-y-1" style={{ background: 'var(--color-sidebar-section)', color: 'var(--color-text-primary)' }}>
              <p><strong>Title:</strong> {registry?.title || 'Unknown'}</p>
              <p><strong>Version:</strong> {registry?.version || 'Unknown'}</p>
              <p><strong>Apps:</strong> {appCount}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {manifests.map((app) => (
              <div key={app.id} className="rounded-sm overflow-hidden shadow-sm" style={{ border: '1px solid var(--color-border-inner)', background: 'var(--color-panel-bg)' }}>
                <div className="px-3 py-1.5" style={{ background: 'linear-gradient(to right, #f0f0f0, #e0e0e0)' }}>
                  <span className="font-bold text-xs tracking-wide" style={{ color: 'var(--color-text-link)' }}>{app.label}</span>
                </div>
                <div className="p-3 text-xs space-y-2" style={{ background: 'var(--color-sidebar-section)', color: 'var(--color-text-primary)' }}>
                  <p>{app.description}</p>
                  <p><strong>Entrypoint:</strong> <code>{app.entrypoint}</code></p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(app.actions || []).map((action) => (
                      <a
                        key={action.id}
                        href={action.href}
                        className="inline-flex items-center px-2 py-1"
                        style={{ background: 'var(--color-panel-bg)', border: '1px solid var(--color-border-main)' }}
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>

                  <div className="pt-2" style={{ borderTop: '1px solid var(--color-border-main)' }}>
                    <p className="font-bold mb-1">Checks</p>
                    {(app.checks || []).length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>No checks declared.</p>}
                    {(app.checks || []).map((check) => {
                      const status = checkStatuses[check.id] || 'unknown';
                      return (
                        <div key={check.id} className="flex items-center gap-2 py-0.5">
                          {status === 'ok'
                            ? <CheckCircle2 size={12} style={{ color: statusColor.ok }} />
                            : <AlertTriangle size={12} style={{ color: statusColor[status] }} />
                          }
                          <span>{check.label}</span>
                          <span style={{ color: statusColor[status] }}>[{status.toUpperCase()}]</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
