/**
 * @fileId 45bdc4b8-3fda-48ae-8a80-6ff64d182825
 * @module CivicOS/hooks/useResources
 * @description All resource state and mutation handlers in one place.
 *              Import this hook wherever grant data needs to be read or changed.
 */

import { useState, useEffect } from 'react';
import { initialResources } from '../constants.js';
import { useKernel } from '../kernel/CivicProvider.jsx';

export function useResources() {
  const { snapshots, saveSnapshot, logEvent } = useKernel();
  const [resources, setResources] = useState(() => snapshots.resources ?? initialResources);

  useEffect(() => {
    saveSnapshot('resources', resources);
  }, [resources, saveSnapshot]);

  const handleVote = (id, increment) => {
    logEvent('resource.vote', { id, delta: increment });
    setResources(prev =>
      prev.map(r => r.id === id ? { ...r, votes: r.votes + increment } : r)
    );
  };

  const commitLead = (id) => {
    logEvent('resource.commit', { id });
    setResources(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'vetting' } : r)
    );
  };

  const discardLead = (id) => {
    logEvent('resource.discard', { id });
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveNode = (newNode, onSuccess) => {
    if (!newNode.title) return;
    const nextId = resources.length ? Math.max(...resources.map(r => r.id)) + 1 : 1;
    const resource = {
      id: nextId,
      title: newNode.title,
      type: newNode.type,
      bounty: newNode.bounty
        ? newNode.bounty.startsWith('$') ? newNode.bounty : `$${newNode.bounty}`
        : 'TBD',
      deadline: newNode.deadline || 'TBD',
      fitScore: parseInt(newNode.fitScore),
      votes: 0,
      status: 'discovery',
      tags: ['New Lead', 'Unvetted'],
    };
    logEvent('resource.add', { id: nextId, title: resource.title, type: resource.type });
    setResources(prev => [...prev, resource]);
    onSuccess?.();
  };

  return { resources, handleVote, commitLead, discardLead, handleSaveNode };
}
