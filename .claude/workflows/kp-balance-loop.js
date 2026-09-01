export const meta = {
  name: 'kp-balance-loop',
  description: 'Validate the Kernel Panic build (typecheck + sims), then have ability-agent and arc-composer write balance proposals from the fresh report',
  whenToUse: 'Inside the /kp-balance play, or whenever you want fresh sim numbers plus proposals. Does NOT integrate anything: the Orchestrator integrates between runs.',
  phases: [
    { title: 'Validate', detail: 'run the verification gate, write pipeline/validation/report.md' },
    { title: 'Propose', detail: 'ability-agent + arc-composer read the report, write proposal JSON' },
  ],
}

const REPORT_SCHEMA = {
  type: 'object',
  required: ['verdict', 'hardFailure', 'worst'],
  properties: {
    verdict: { type: 'string', enum: ['PASS', 'PASS WITH DRIFT', 'FAIL'] },
    hardFailure: { type: 'boolean', description: 'true if typecheck failed or a harness crashed/asserted (build broken, balance numbers meaningless)' },
    worst: { type: 'array', items: { type: 'string' }, description: 'the 2-3 measurements furthest from target, e.g. "D5 63% vs 58%"' },
  },
}

const SUMMARY_SCHEMA = {
  type: 'object',
  required: ['itemCount', 'summary'],
  properties: {
    itemCount: { type: 'number' },
    summary: { type: 'string' },
  },
}

phase('Validate')
const report = await agent(
  'Run your full verification gate per your instructions and write pipeline/validation/report.md. Then return the verdict, whether there was a hard failure, and the measurements furthest from target.',
  { agentType: 'validation', label: 'run gate', phase: 'Validate', schema: REPORT_SCHEMA },
)
if (!report) return { error: 'validation agent did not return a result; check pipeline/validation/report.md manually' }
if (report.hardFailure) {
  return { report, proposals: null, note: 'Build is broken (typecheck/harness failure). Fix the build before balance work; no proposals requested.' }
}

phase('Propose')
log(`Verdict ${report.verdict}; worst: ${report.worst.join('; ')}`)
const proposals = await parallel([
  () => agent(
    `A fresh validation report is at pipeline/validation/report.md (verdict: ${report.verdict}; worst deviations: ${report.worst.join('; ')}). Follow your instructions: read the report and pipeline/BRIEF.md if a cycle brief is live, then write pipeline/proposals/ability-agent.json. Return how many items you proposed and a one-line summary.`,
    { agentType: 'ability-agent', label: 'ability proposals', phase: 'Propose', schema: SUMMARY_SCHEMA },
  ),
  () => agent(
    `A fresh validation report is at pipeline/validation/report.md (verdict: ${report.verdict}; worst deviations: ${report.worst.join('; ')}). Follow your instructions: read the report and pipeline/BRIEF.md if a cycle brief is live, then write pipeline/proposals/arc-composer.json. Return how many items you proposed and a one-line summary.`,
    { agentType: 'arc-composer', label: 'arc proposals', phase: 'Propose', schema: SUMMARY_SCHEMA },
  ),
])
const [ability, arc] = proposals
return {
  report,
  ability: ability ?? { itemCount: 0, summary: 'agent failed; check pipeline/proposals/ability-agent.json' },
  arc: arc ?? { itemCount: 0, summary: 'agent failed; check pipeline/proposals/arc-composer.json' },
  next: 'Orchestrator: gate player-facing copy with loremaster, integrate approved items, then re-run this workflow to re-validate.',
}
