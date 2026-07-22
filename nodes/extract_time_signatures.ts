import { MidiFile, TimeSignaturesResult, TimeSignatureEvent } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, iterateAbsoluteEvents } from './lib/midi-core';

/**
 * Extracts every timeSignature meta event across all tracks: tick position,
 * numerator, denominator (as a real fraction denominator, e.g. 4 for
 * quarter-note beats), MIDI clocks per metronome click, and 32nd-notes per
 * quarter note.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractTimeSignatures(ax: AxiomContext, input: MidiFile): TimeSignaturesResult {
  const result = new TimeSignaturesResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  for (const { tick, event } of iterateAbsoluteEvents(data)) {
    const e = event as any;
    if (e.type !== 'timeSignature') continue;
    const ts = new TimeSignatureEvent();
    ts.setTick(tick);
    ts.setNumerator(e.numerator);
    ts.setDenominator(e.denominator);
    ts.setMetronomeClicks(e.metronome);
    ts.setThirtysecondsPerQuarter(e.thirtyseconds);
    result.addEvents(ts);
  }
  result.setOk(true);
  return result;
}
