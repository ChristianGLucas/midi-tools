import { ExtractChannelNotesInput, ExtractChannelNotesResult, Note } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse } from './lib/midi-core';
import { extractPairedNotes } from './lib/notes';

/**
 * Extracts every fully-paired note across all tracks that plays on one
 * specific MIDI channel (0-15), with the same note_name/velocity/tick/
 * duration fields as ExtractNotes.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractChannelNotes(ax: AxiomContext, input: ExtractChannelNotesInput): ExtractChannelNotesResult {
  const result = new ExtractChannelNotesResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  const channel = input.getChannel();
  if (channel < 0 || channel > 15) {
    result.setOk(false);
    result.setError(`channel ${channel} is out of range (must be 0-15)`);
    return result;
  }

  for (const n of extractPairedNotes(data, { channel })) {
    const note = new Note();
    note.setTrackIndex(n.trackIndex);
    note.setChannel(n.channel);
    note.setNoteNumber(n.noteNumber);
    note.setNoteName(n.noteName);
    note.setVelocity(n.velocity);
    note.setStartTick(n.startTick);
    note.setEndTick(n.endTick);
    note.setDurationTick(n.durationTick);
    result.addNotes(note);
  }
  result.setOk(true);
  return result;
}
