/**
 * Feature 4 — Backtest Proof.
 *
 * One known-delayed case from the mock data (MUSI-GDN-142, the Gandipet
 * survey parcel), framed after the real Musi Riverfront / Gandipet
 * situation: the engine's five factors were already present months before
 * the court stay became public. Dates are fixed here on purpose — this is a
 * static, pre-scripted proof panel, not a live simulation.
 */
import type { PlotRiskInput } from '../engine/types';
import { samplePlots } from './samplePlots';

/** The plot the backtest is run against. */
export const backtestPlot = samplePlots.find((p) => p.id === 'MUSI-GDN-142')!;

/**
 * Frozen snapshot of the parcel's risk inputs AS OF 2025-05-20 — i.e. what
 * a functioning data pipeline would have recorded two months before the
 * Telangana High Court's public stay on Gandipet dispossession (2025-07-25,
 * as reported). Identical to today's inputs except litigation, which only
 * became public with the stay itself.
 */
export const backtestSnapshotDate = '20 May 2025';
export const publicEventDate = '25 July 2025';
export const publicEventNote =
  'Telangana High Court stay on dispossession at Gandipet reported';

export const backtestInput: PlotRiskInput = {
  ...backtestPlot.input,
  litigationFlag: false, // stay not yet public on the snapshot date
};

/** Lead time between the would-have-been flag and the public event. */
export const LEAD_TIME_MONTHS = 2;
