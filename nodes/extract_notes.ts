import { ExtractNotesInput, ExtractNotesResult, Note } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse } from './lib/midi-core';
import { extractPairedNotes } from './lib/notes';

/**
 * Extracts fully-paired musical notes from one track (by track_index): each
 * noteOn is matched to its terminating noteOff (or the equivalent
 * zero-velocity noteOn, per SMF convention) to produce a note number
 * (0-127), scientific-pitch note name (e.g. "C4" for note 60 / middle C),
 * velocity, absolute start tick, end tick, and duration in ticks. Correctly
 * pairs overlapping notes of the same pitch on the same channel using
 * per-pitch queues in event order.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractNotes(ax: AxiomContext, input: ExtractNotesInput): ExtractNotesResult {
  const result = new ExtractNotesResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  const trackIndex = input.getTrackIndex();
  if (trackIndex < 0 || trackIndex >= data.tracks.length) {
    result.setOk(false);
    result.setError(`track_index ${trackIndex} is out of range (file has ${data.tracks.length} track(s))`);
    return result;
  }

  for (const n of extractPairedNotes(data, { trackIndex })) {
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
