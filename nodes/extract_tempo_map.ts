import { MidiFile, TempoMapResult, TempoEvent } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, buildTempoMap, bpmFromMicrosecondsPerBeat } from './lib/midi-core';

/**
 * Extracts every setTempo meta event across all tracks (tick position,
 * microseconds-per-quarter-note, and the equivalent BPM), sorted by tick
 * ascending, forming the file's tempo map. Always includes an implicit
 * tick-0 entry at the MIDI-default 120 BPM if the file has no explicit
 * tempo event before the first tick that needs one — this is the same map
 * ComputeDuration and ConvertTicksToSeconds use internally for tick<->second
 * conversion.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractTempoMap(ax: AxiomContext, input: MidiFile): TempoMapResult {
  const result = new TempoMapResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  for (const e of buildTempoMap(data)) {
    const te = new TempoEvent();
    te.setTick(e.tick);
    te.setMicrosecondsPerBeat(e.microsecondsPerBeat);
    te.setBpm(bpmFromMicrosecondsPerBeat(e.microsecondsPerBeat));
    result.addTempoEvents(te);
  }
  result.setOk(true);
  return result;
}
