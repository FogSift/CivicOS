/**
 * @fileId 455d9f34-4b24-49b6-a6b8-2fdd9cd77bf9
 * @module CivicOS/constants
 * @description Seed data and static config. Replace initialResources with API
 *              data once the ingestion layer is built.
 */

export const initialResources = [
  {
    id: 1,
    title: 'NSF Civic Innovation Challenge',
    type: 'Federal Grant',
    bounty: '$1,000,000',
    deadline: '2026-04-15',
    fitScore: 92,
    votes: 14,
    status: 'discovery',
    tags: ['Infrastructure', 'High ROI'],
  },
  {
    id: 2,
    title: 'Mozilla Data Futures Lab',
    type: 'Foundation',
    bounty: '$50,000',
    deadline: '2026-03-30',
    fitScore: 85,
    votes: 8,
    status: 'vetting',
    tags: ['Tech', 'Quick Win'],
  },
  {
    id: 3,
    title: 'Ford Foundation: Future of Work',
    type: 'Foundation',
    bounty: '$250,000',
    deadline: '2026-05-01',
    fitScore: 60,
    votes: -2,
    status: 'discovery',
    tags: ['Long Shot', 'High Overhead'],
  },
  {
    id: 4,
    title: 'State Digital Equity Capacity Grant',
    type: 'State Grant',
    bounty: '$100,000',
    deadline: '2026-03-15',
    fitScore: 95,
    votes: 21,
    status: 'drafting',
    tags: ['Local', 'Strong Relationship'],
  },
];

export const GRANT_TYPES = [
  'Federal Grant',
  'State Grant',
  'Foundation',
  'Corporate',
  'Individual Donor',
  'Other',
];

export const PipelineColumns = [
  { id: 'discovery', label: 'The Plaza' },
  { id: 'vetting',   label: 'Sniff Test' },
  { id: 'drafting',  label: 'Active Drafting' },
  { id: 'submitted', label: 'Under Review' },
];
