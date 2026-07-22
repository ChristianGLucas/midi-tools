import { MidiFile, DurationResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, buildTempoMap, ticksToSeconds, iterateAbsoluteEvents } from './lib/midi-core';

/**
 * Computes the file's total length: total_ticks (the highest absolute tick
 * reached by any event in any track) and total_seconds, derived exactly
 * from total_ticks via the file's own tempo map (ticks-per-quarter-note
 * division) or its SMPTE frame rate (SMPTE division) — the same conversion
 * ConvertTicksToSeconds exposes for arbitrary tick positions.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function computeDuration(ax: AxiomContext, input: MidiFile): DurationResult {
  const result = new DurationResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  let totalTicks = 0;
  for (const { tick } of iterateAbsoluteEvents(data)) {
    if (tick > totalTicks) totalTicks = tick;
  }

  const tempoMap = buildTempoMap(data);
  result.setTotalTicks(totalTicks);
  result.setTotalSeconds(ticksToSeconds(totalTicks, data.header, tempoMap));
  result.setOk(true);
  return result;
}
