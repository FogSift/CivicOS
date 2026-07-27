/**
 * @fileId 3f1c9a72-6d84-4c1e-9a55-2b7e0d41c8aa
 * @module CivicOS/src/apps/nova/novaProcess.js
 * @description The Nova Process, run locally: UNPACK, ANALYZE, SYNTHESIZE.
 *
 * This is a heuristic pass over the text you type. It does not call a language
 * model and it does not pretend to. What it actually does is read your problem
 * statement for the structure that is already in it (obligations, unknowns,
 * deadlines, actors, risk words) and hand that structure to three fixed lenses:
 *
 *   DCE   Discussion Continuity Expert. Keeps scope and sequence honest.
 *   CAE   Critical Analysis Expert. Looks for what breaks.
 *   SME   Domain Expert. Looks for what the work concretely requires.
 *
 * The value is the forced decomposition, not machine intelligence. When
 * CivicOS gains a local AI gateway (APPS.md, port 5052), `runNovaProcess`
 * is the seam: same phases, same shape, real model behind it.
 *
 * Pure functions only. No React, no DOM, no I/O.
 */

/** Words that signal a hard requirement. */
const OBLIGATION = /\b(must|shall|required?|have to|has to|need(?:s|ed)? to|mandat\w*)\b/i;
/** Words that signal a preference rather than a requirement. */
const PREFERENCE = /\b(should|prefer\w*|ideally|would like|nice to have|want(?:s|ed)?)\b/i;
/** Words that signal something unresolved. */
const UNKNOWN = /\b(unclear|unknown|not sure|unsure|maybe|might|possibly|tbd|figure out|investigate|explore|decide whether)\b/i;
/** Words that signal exposure. */
const RISK = /\b(risk\w*|fail\w*|break\w*|lose|lost|danger\w*|block\w*|conflict\w*|legal|liabilit\w*|privacy|security|outage|deadline|penalt\w*)\b/i;
/** Words that signal cost or scarcity. */
const RESOURCE = /\b(budget|cost\w*|fund\w*|money|staff\w*|volunteer\w*|time|hours?|capacity|grant\w*|\$[\d,]+)\b/i;
/** Words that name people affected. */
const ACTOR = /\b(resident\w*|citizen\w*|member\w*|council|board|committee|staff|volunteer\w*|public|community|neighbor\w*|team|user\w*|voter\w*)\b/i;
/** Rough date and duration detection. */
const DEADLINE = /\b(\d{4}-\d{2}-\d{2}|by \w+ \d{1,2}|within \d+ (?:days?|weeks?|months?)|next (?:week|month|quarter|year)|q[1-4]\b|deadline)\b/i;

/* Function words plus the connective verbs that survive a naive frequency
   count and read as topics when they are not. Without the second group you get
   "the work centers on: grant, allows, bank, before" out of a roofing problem. */
const STOPWORDS = new Set(
  ('a an and are as at be but by for from has have how i if in into is it its of on or that the ' +
   'their them then there these they this to was we were what when where which who will with you your ' +
   'about after allow allowed allows also any before been being both came come could did does done ' +
   'each every get got had here just like made make many more most much must need needs not now only ' +
   'other our out over own said same say see should since some such take than that them they those ' +
   'through under until use used using very want was way well went whether while would')
    .split(' ')
);

/** Split prose into sentence-ish units. Deliberately forgiving. */
export function splitSentences(text) {
  return String(text || '')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** The content words a reader would call the subject of the text. */
export function keyTerms(text, limit = 6) {
  const counts = new Map();
  const words = String(text || '').toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [];
  for (const word of words) {
    if (STOPWORDS.has(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word]) => word);
}

/**
 * UNPACK. Sort the statement into the buckets a decision actually needs.
 * Every facet carries the sentence it came from, so nothing is asserted
 * without a line you can point at.
 */
export function unpack(problem) {
  const sentences = splitSentences(problem);
  const facets = [];
  const push = (type, label, source) => facets.push({ type, label, source });

  for (const sentence of sentences) {
    if (OBLIGATION.test(sentence)) push('requirement', sentence, sentence);
    else if (PREFERENCE.test(sentence)) push('preference', sentence, sentence);
    if (UNKNOWN.test(sentence)) push('unknown', sentence, sentence);
    if (RISK.test(sentence)) push('risk', sentence, sentence);
    if (RESOURCE.test(sentence)) push('resource', sentence, sentence);
    if (DEADLINE.test(sentence)) push('timing', sentence, sentence);
    if (ACTOR.test(sentence)) push('stakeholder', sentence, sentence);
  }

  // A statement with no detectable structure is still a problem. Say so
  // plainly rather than inventing facets that are not in the text.
  const unstructured = facets.length === 0 && sentences.length > 0;
  if (unstructured) {
    push('open', sentences[0], sentences[0]);
  }

  return {
    sentences,
    terms: keyTerms(problem),
    facets,
    counts: facets.reduce((acc, f) => ({ ...acc, [f.type]: (acc[f.type] || 0) + 1 }), {}),
    unstructured,
  };
}

const has = (unpacked, type) => (unpacked.counts[type] || 0) > 0;
const firstOf = (unpacked, type) => unpacked.facets.find((f) => f.type === type)?.label || '';

/** DCE. Scope, sequence, and whether the question is answerable as asked. */
function analyzeDCE(unpacked) {
  const points = [];
  const { counts, sentences, terms } = unpacked;

  if (unpacked.unstructured) {
    points.push({
      claim: 'The statement has no stated requirement, constraint, or deadline.',
      because: 'Nothing in the text distinguishes what must be true from what would be nice.',
      ask: 'Add one sentence starting with "It must" before going further.',
    });
  }
  if (has(unpacked, 'requirement') && has(unpacked, 'preference')) {
    points.push({
      claim: `${counts.requirement} hard requirement(s) sit next to ${counts.preference} preference(s).`,
      because: 'Mixed obligation levels are where scope creep enters unannounced.',
      ask: 'Mark each line as must or want before scheduling any of it.',
    });
  }
  if (!has(unpacked, 'timing')) {
    points.push({
      claim: 'No date, window, or deadline appears anywhere in the statement.',
      because: 'Without timing, sequencing is guesswork and nothing can be called late.',
      ask: 'Name the date that makes this urgent, or say plainly that none exists.',
    });
  }
  if (sentences.length > 6) {
    points.push({
      claim: `The statement runs ${sentences.length} sentences.`,
      because: 'Anything past roughly six sentences is usually more than one decision.',
      ask: `Split it. The likely seam is around "${terms[0] || 'the main subject'}".`,
    });
  }
  if (points.length === 0) {
    points.push({
      claim: 'Scope reads as a single answerable question.',
      because: 'Obligations, timing, and subject are all present and consistent.',
      ask: 'Proceed to analysis. Re-check scope if new requirements appear.',
    });
  }
  return points.slice(0, 3);
}

/** CAE. What breaks, who is exposed, what has not been said. */
function analyzeCAE(unpacked) {
  const points = [];
  const { counts } = unpacked;

  if (has(unpacked, 'risk')) {
    points.push({
      claim: `${counts.risk} line(s) name an exposure directly.`,
      because: `Starting with: "${firstOf(unpacked, 'risk')}"`,
      ask: 'For each, write the specific failure and who absorbs it.',
    });
  }
  if (has(unpacked, 'unknown')) {
    points.push({
      claim: `${counts.unknown} unresolved question(s) are embedded in the statement.`,
      because: 'An unknown carried into execution becomes an assumption nobody logged.',
      ask: `Resolve or explicitly accept: "${firstOf(unpacked, 'unknown')}"`,
    });
  }
  if (!has(unpacked, 'stakeholder')) {
    points.push({
      claim: 'No affected party is named.',
      because: 'A civic decision with no named party is a decision with no accountability.',
      ask: 'Name who benefits and who bears the cost. They are rarely the same group.',
    });
  }
  if (!has(unpacked, 'risk') && !has(unpacked, 'unknown')) {
    points.push({
      claim: 'The statement contains no risk and no open question.',
      because: 'That is unusual. It normally means the risk is unexamined, not absent.',
      ask: 'Write the sentence that starts "This fails if..." and see if it is easy.',
    });
  }
  return points.slice(0, 3);
}

/** SME. What the work concretely requires to happen. */
function analyzeSME(unpacked) {
  const points = [];
  const { counts, terms } = unpacked;

  if (has(unpacked, 'resource')) {
    points.push({
      claim: `${counts.resource} line(s) touch cost, time, or capacity.`,
      because: `Notably: "${firstOf(unpacked, 'resource')}"`,
      ask: 'Attach a number to each. An unquantified constraint cannot be planned against.',
    });
  } else {
    points.push({
      claim: 'No budget, hours, or capacity appear in the statement.',
      because: 'Work without a stated cost gets scheduled as if it were free.',
      ask: 'Estimate the smallest version. Cost the smallest version first.',
    });
  }
  if (terms.length > 0) {
    points.push({
      claim: `The work centers on: ${terms.slice(0, 4).join(', ')}.`,
      because: 'These are the recurring terms, so they are where the domain knowledge sits.',
      ask: `Find whoever already knows about "${terms[0]}" before designing anything new.`,
    });
  }
  if (has(unpacked, 'requirement')) {
    points.push({
      claim: 'At least one requirement is stated as binding.',
      because: `"${firstOf(unpacked, 'requirement')}"`,
      ask: 'Write the check that proves it was met. If you cannot, it is not a requirement.',
    });
  }
  return points.slice(0, 3);
}

export const EXPERTS = [
  {
    id: 'dce',
    name: 'DCE',
    fullName: 'Discussion Continuity Expert',
    lens: 'Scope and sequence',
    sprite: 'dce',
    color: '#3b5dc9',
    analyze: analyzeDCE,
  },
  {
    id: 'cae',
    name: 'CAE',
    fullName: 'Critical Analysis Expert',
    lens: 'What breaks',
    sprite: 'cae',
    color: '#a02c2c',
    analyze: analyzeCAE,
  },
  {
    id: 'sme',
    name: 'SME',
    fullName: 'Domain Expert',
    lens: 'What the work needs',
    sprite: 'sme',
    color: '#2f7d3f',
    analyze: analyzeSME,
  },
];

/** ANALYZE. Run all three lenses over the unpacked structure. */
export function analyze(unpacked) {
  return EXPERTS.map((expert) => ({
    expert,
    points: expert.analyze(unpacked),
  }));
}

/**
 * SYNTHESIZE. Merge into one readable position.
 *
 * Confidence is mechanical and says so: it rewards stated structure and
 * penalizes unresolved questions. It is a measure of how well specified the
 * problem is, not of how good the answer is. Those are different things and
 * conflating them is how dashboards start lying.
 */
export function synthesize(unpacked, analysis) {
  const { counts } = unpacked;
  const structure =
    (has(unpacked, 'requirement') ? 0.2 : 0) +
    (has(unpacked, 'timing') ? 0.15 : 0) +
    (has(unpacked, 'stakeholder') ? 0.15 : 0) +
    (has(unpacked, 'resource') ? 0.15 : 0) +
    (has(unpacked, 'risk') ? 0.1 : 0);
  const drag = Math.min(0.3, (counts.unknown || 0) * 0.1);
  const specification = Math.max(0.05, Math.min(0.95, 0.25 + structure - drag));

  const actions = analysis
    .flatMap(({ expert, points }) => points.map((p) => ({ owner: expert.name, do: p.ask })))
    .slice(0, 6);

  let verdict;
  if (specification >= 0.7) {
    verdict = 'Well specified. The decision can be made from what is written.';
  } else if (specification >= 0.45) {
    verdict = 'Partly specified. Answer the open items before committing resources.';
  } else {
    verdict = 'Under specified. Treat any decision made now as provisional.';
  }

  const gaps = [
    !has(unpacked, 'requirement') && 'no binding requirement',
    !has(unpacked, 'timing') && 'no timing',
    !has(unpacked, 'stakeholder') && 'no named party',
    !has(unpacked, 'resource') && 'no cost',
  ].filter(Boolean);

  return {
    verdict,
    specification,
    actions,
    gaps,
    summary:
      `${unpacked.facets.length} facet(s) across ${unpacked.sentences.length} sentence(s). ` +
      (gaps.length ? `Missing: ${gaps.join(', ')}.` : 'All four structural slots are filled.'),
  };
}

/** The whole process, in one call. */
export function runNovaProcess(problem) {
  const unpacked = unpack(problem);
  const analysis = analyze(unpacked);
  const synthesis = synthesize(unpacked, analysis);
  return { problem, unpacked, analysis, synthesis };
}

export const SAMPLE_PROBLEMS = [
  'The community center roof must be replaced before the rainy season. We have a $40,000 grant but the low bid came in at $62,000. Residents use the building for the food bank three days a week. It is unclear whether the grant allows a partial scope.',
  'We should probably move the council minutes online. Not sure which format. Someone mentioned accessibility requirements.',
  'The volunteer scheduling spreadsheet breaks every time two people edit it. Staff spend roughly six hours a week fixing conflicts. We need a replacement by next quarter that does not require a subscription.',
];
