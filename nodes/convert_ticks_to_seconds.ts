import { TicksToSecondsInput, TicksToSecondsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, buildTempoMap, ticksToSeconds } from './lib/midi-core';

/**
 * Converts a batch of absolute tick positions to seconds using the file's
 * real tempo map (ticks-per-quarter-note division) or SMPTE frame rate
 * (SMPTE division) — the exact math ComputeDuration uses internally,
 * exposed for arbitrary caller-supplied tick positions (e.g. to time-align
 * a Note's start_tick from ExtractNotes). Output seconds are parallel to
 * the input ticks array.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function convertTicksToSeconds(ax: AxiomContext, input: TicksToSecondsInput): TicksToSecondsResult {
  const result = new TicksToSecondsResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  const ticks = input.getTicksList();

  const tempoMap = buildTempoMap(data);
  for (const tick of ticks) {
    result.addSeconds(ticksToSeconds(tick, data.header, tempoMap));
  }
  result.setOk(true);
  return result;
}
