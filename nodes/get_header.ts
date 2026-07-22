import { MidiFile, MidiHeader } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse } from './lib/midi-core';

/**
 * Extracts just the SMF header-chunk (MThd) fields: format (0/1/2), track
 * count, and the time division — either ticks-per-quarter-note (the common
 * case) or SMPTE frames-per-second + ticks-per-frame.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getHeader(ax: AxiomContext, input: MidiFile): MidiHeader {
  const header = new MidiHeader();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    header.setOk(false);
    header.setError(error!);
    return header;
  }

  header.setFormat(data.header.format);
  header.setNumTracks(data.header.numTracks);
  header.setIsSmpte(data.header.isSmpte);
  header.setTicksPerQuarterNote(data.header.ticksPerQuarterNote);
  header.setFramesPerSecond(data.header.framesPerSecond);
  header.setTicksPerFrame(data.header.ticksPerFrame);
  header.setOk(true);
  return header;
}
