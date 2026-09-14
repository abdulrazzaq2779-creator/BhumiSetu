/**
 * Dashboard project card — the Important Links tile pattern applied to the
 * Risk Dashboard's project list (see PhotoTile.tsx for the shared classes).
 *
 * Carries every field the old table row showed: risk badge + score, project
 * name, project ID, district/state, stage, progress % and the primary
 * driver (unclamped — the card grows to fit long text). Hover/focus reveals
 * the project's thematic photo under a dark scrim; the whole card is the
 * link to the project's detail page, so it is keyboard-focusable and
 * Enter-activatable by default.
 */
import type { RiskLevel } from '../engine/types';
import { projectHref } from '../hooks/useRoute';
import {
  TILE_CONTAINER,
  TILE_TEXT_FLIP,
  TILE_TEXT_FLIP_SOFT,
  TileFooter,
  TilePhoto,
} from './PhotoTile';

const LEVEL_CLASS: Record<RiskLevel, string> = {
  High: 'border-risk-high text-risk-high',
  Medium: 'border-risk-medium text-risk-medium',
  Low: 'border-risk-low text-risk-low',
};

/** Everything a card (and the detail page) needs, pre-scored. */
export interface ProjectCardModel {
  id: string;
  name: string;
  district: string;
  state: string;
  stage: string;
  progressPct: number;
  score: number;
  level: RiskLevel;
  primaryDriver: string;
  summary: string;
  thumbnailImage: string;
}

export default function ProjectCard({
  project,
}: {
  project: ProjectCardModel;
}) {
  return (
    <a
      href={projectHref(project.id)}
      aria-label={`Open project details for ${project.name}`}
      className={`${TILE_CONTAINER} cursor-pointer text-left hover:border-line-strong focus-visible:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-safe:transition-[border-color,transform] motion-safe:duration-300 motion-safe:hover:scale-[1.02] motion-safe:focus-visible:scale-[1.02]`}
    >
      <TilePhoto src={project.thumbnailImage} />

      {/* Risk badge + score, project ID pinned to the far edge. The badge
          keeps its level colour over the photo — red/amber/green read fine
          on the dark scrim. */}
      <span className="relative flex items-start justify-between gap-3">
        <span
          className={`inline-block border-l-4 px-2 py-1 text-xs font-semibold ${LEVEL_CLASS[project.level]}`}
        >
          {project.level} · {project.score}
        </span>
        <span className={`text-[11px] text-ink-faint ${TILE_TEXT_FLIP_SOFT}`}>
          {project.id}
        </span>
      </span>

      <span
        className={`relative mt-4 block text-lg font-semibold leading-snug text-ink ${TILE_TEXT_FLIP}`}
      >
        {project.name}
      </span>
      <span
        className={`relative mt-1 block text-sm text-ink-soft ${TILE_TEXT_FLIP_SOFT}`}
      >
        {project.district}, {project.state} · {project.stage}
      </span>

      {/* Progress — bar drawn with bg-current so it flips light with the
          text on hover. */}
      <span
        className={`relative mt-3 flex items-center gap-2 text-xs tabular-nums text-ink-soft ${TILE_TEXT_FLIP_SOFT}`}
      >
        <span className="h-1.5 w-16 bg-parchment-deep">
          <span
            className="block h-full bg-current"
            style={{ width: `${project.progressPct}%` }}
          />
        </span>
        {project.progressPct}% acquired
      </span>

      {/* Primary driver — never clamped; a long driver simply grows the
          card (the Read More footer stays pinned via its own mt-auto). */}
      <span
        className={`relative mt-4 block text-[13px] leading-relaxed text-ink-soft ${TILE_TEXT_FLIP_SOFT}`}
      >
        {project.primaryDriver}
      </span>

      <TileFooter />
    </a>
  );
}
