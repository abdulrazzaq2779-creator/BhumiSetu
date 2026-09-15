/**
 * assistantEngine — pattern-matched answers over existing mock data.
 *
 * NO LLM call: questions are matched against the host's own data
 * (monitoredProjects + rule engine for officials; the citizen's single
 * linked record for citizens). The citizen branch can never surface
 * another project's data — it only reads DEMO_CITIZEN's record.
 */
import { monitoredProjects } from '../../src/data/projects';
import { createRuleEngine } from '../../src/engine';
import { DEMO_CITIZEN } from './mockData';
import type { AssistantSource, CitizenDocument, NotificationItem } from './portalTypes';

const engine = createRuleEngine();

export interface AssistantAnswer {
  text: string;
  source: AssistantSource;
}

export const FALLBACK_TEXT =
  'I can help with risk scores, project status, and document requirements. Try asking about a specific project or your property status.';

const STAGE_SENTENCES: Record<number, string> = {
  0: 'Your property is at the notification stage. Officials will visit to record survey details within the next few weeks.',
  1: 'Your property is under survey. A valuation visit will follow once survey numbers are confirmed.',
  2: 'Your property is under valuation. Estimated compensation decision in 30–45 days.',
  3: 'Your compensation award is being prepared. Disbursement follows once documents are verified.',
  4: 'Compensation has been awarded. Possession formalities will conclude after final payment.',
};

function citizenStageIndex(): number {
  const project = monitoredProjects.find((p) => p.id === DEMO_CITIZEN.projectId);
  if (!project) return 0;
  switch (project.stage) {
    case 'Notification & survey':
      return project.progressPct < 15 ? 0 : 1;
    case 'Compensation':
      return 3;
    case 'Possession':
    case 'R&R':
      return 4;
  }
}

/** ── Official answers (portfolio-wide scope) ─────────────────────────── */

function officialAnswer(q: string): AssistantAnswer {
  // "risk above 60" / "score above 45" / "risk over 70"
  const threshold = q.match(/(?:risk|score)\s+(?:above|over|greater than|beyond)\s+(\d{1,3})/i);
  if (threshold) {
    const min = Number(threshold[1]);
    const matches = monitoredProjects
      .map((p) => ({ p, r: engine.predict(p.riskInput) }))
      .filter((s) => s.r.score > min)
      .sort((a, b) => b.r.score - a.r.score);
    if (matches.length === 0) {
      return {
        text: `No monitored project scores above ${min} in the current cycle. The highest score right now is ${Math.max(
          ...monitoredProjects.map((p) => engine.predict(p.riskInput).score),
        )}.`,
        source: 'official',
      };
    }
    return {
      text: `${matches.length} project${matches.length === 1 ? '' : 's'} score above ${min}:\n${matches
        .map((s) => `• ${s.p.name} — ${s.r.level} risk, score ${s.r.score}`)
        .join('\n')}`,
      source: 'official',
    };
  }

  // A specific project ID: "LAP-2023-014"
  const idMatch = q.match(/LAP-\d{4}-\d{2,3}/i);
  if (idMatch) {
    const project = monitoredProjects.find(
      (p) => p.id.toLowerCase() === idMatch[0].toLowerCase(),
    );
    if (project) {
      const r = engine.predict(project.riskInput);
      const driver =
        project.litigationNote ??
        r.explanations[0] ??
        'No dominant driver this cycle';
      return {
        text: `${project.name} (${project.id}) is ${r.level} risk with a score of ${r.score}. Top risk driver: ${driver}. The project is at the "${project.stage}" stage, ${project.progressPct}% acquired.`,
        source: 'official',
      };
    }
    return {
      text: `I couldn't find a project with ID ${idMatch[0]} in the monitored list. Try an ID like LAP-2023-014.`,
      source: 'official',
    };
  }

  // Highest / most risky project
  if (/(highest|top|most|worst)\s+(risk|risky|score)/i.test(q) || /which project.*risk/i.test(q)) {
    const top = monitoredProjects
      .map((p) => ({ p, r: engine.predict(p.riskInput) }))
      .sort((a, b) => b.r.score - a.r.score)[0];
    return {
      text: `${top.p.name} carries the highest risk right now — ${top.r.level} (${top.r.score}/100). Primary driver: ${top.p.litigationNote ?? top.r.explanations[0]}.`,
      source: 'official',
    };
  }

  // Counts by level
  if (/how many.*(high|medium|low|risk)/i.test(q)) {
    const scored = monitoredProjects.map((p) => engine.predict(p.riskInput));
    const high = scored.filter((r) => r.level === 'High').length;
    const medium = scored.filter((r) => r.level === 'Medium').length;
    const low = scored.filter((r) => r.level === 'Low').length;
    return {
      text: `Current cycle: ${high} High, ${medium} Medium and ${low} Low risk projects across ${monitoredProjects.length} monitored.`,
      source: 'official',
    };
  }

  return { text: FALLBACK_TEXT, source: 'fallback' };
}

/** ── Citizen answers (own-record scope ONLY) ─────────────────────────── */

function citizenAnswer(
  q: string,
  documents: CitizenDocument[],
  notifications: NotificationItem[],
): AssistantAnswer {
  // Status / stage questions.
  if (/status|stage|where|progress|update/i.test(q)) {
    const idx = citizenStageIndex();
    return {
      text: `${STAGE_SENTENCES[idx]} You can see the full stepper on the My Property Status page.`,
      source: 'citizen',
    };
  }

  // Documents: outstanding = anything not yet Approved.
  if (/document|upload|patta|proof|papers/i.test(q)) {
    const pending = documents.filter((d) => d.status !== 'Approved');
    if (pending.length === 0) {
      return {
        text: `All ${documents.length} of your documents have been approved — nothing outstanding. New requirements will appear in your notifications.`,
        source: 'citizen',
      };
    }
    return {
      text: `You have ${pending.length} document${pending.length === 1 ? '' : 's'} still in process:\n${pending
        .map((d) => `• ${d.name} — ${d.status}`)
        .join('\n')}\nApproved documents: ${documents.length - pending.length}. Upload anything new from the Documents page.`,
      source: 'citizen',
    };
  }

  // Compensation / money.
  if (/compensation|money|payment|amount|award/i.test(q)) {
    return {
      text: STAGE_SENTENCES[citizenStageIndex()],
      source: 'citizen',
    };
  }

  // Messages / notices.
  if (/notification|message|notice|alert|hearing/i.test(q)) {
    return {
      text:
        notifications.length === 0
          ? 'You have no messages from the District Collector\'s office yet. When one arrives it will appear in your Notifications page.'
          : `You have ${notifications.length} message${notifications.length === 1 ? '' : 's'}, the latest being "${notifications[0].type}" regarding ${notifications[0].projectName}. Open the Notifications page to read it in full.`,
      source: 'citizen',
    };
  }

  return { text: FALLBACK_TEXT, source: 'fallback' };
}

/** Entry point — routes by role. Context objects come from the store. */
export function answerQuestion(
  question: string,
  role: 'official' | 'citizen',
  ctx: { documents: CitizenDocument[]; notifications: NotificationItem[] },
): AssistantAnswer {
  const q = question.trim();
  if (q === '') return { text: FALLBACK_TEXT, source: 'fallback' };
  return role === 'official' ? officialAnswer(q) : citizenAnswer(q, ctx.documents, ctx.notifications);
}
