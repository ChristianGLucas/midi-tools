import { MidiFile, ProgramChangesResult, ProgramChangeEvent } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, iterateAbsoluteEvents } from './lib/midi-core';
import { gmInstrumentName } from './lib/gm-instruments';

/**
 * Extracts every programChange event across all tracks — tick position,
 * channel, the raw General MIDI program number (0-127), and the program
 * number decoded to its General MIDI Level 1 instrument name (e.g. 0 ->
 * "Acoustic Grand Piano"). Channel 9 (MIDI channel 10, the GM percussion
 * channel) is reported as the standard drum kit rather than a melodic
 * instrument, per the GM spec.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractProgramChanges(ax: AxiomContext, input: MidiFile): ProgramChangesResult {
  const result = new ProgramChangesResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  for (const { tick, event } of iterateAbsoluteEvents(data)) {
    const e = event as any;
    if (e.type !== 'programChange') continue;
    const pc = new ProgramChangeEvent();
    pc.setTick(tick);
    pc.setChannel(e.channel);
    pc.setProgramNumber(e.programNumber);
    pc.setInstrumentName(gmInstrumentName(e.channel, e.programNumber));
    result.addEvents(pc);
  }
  result.setOk(true);
  return result;
}
