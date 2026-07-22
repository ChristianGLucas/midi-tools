import { MidiFile, NoteCountSummary, TrackNoteCount, ChannelNoteCount } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse } from './lib/midi-core';
import { extractPairedNotes } from './lib/notes';

/**
 * Counts paired notes per track and per channel across the whole file, plus
 * the overall total — a fast summary without returning every individual
 * note (use ExtractNotes or ExtractChannelNotes for that).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function summarizeNoteCounts(ax: AxiomContext, input: MidiFile): NoteCountSummary {
  const result = new NoteCountSummary();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  const notes = extractPairedNotes(data);
  const byTrack = new Map<number, number>();
  const byChannel = new Map<number, number>();
  for (const n of notes) {
    byTrack.set(n.trackIndex, (byTrack.get(n.trackIndex) ?? 0) + 1);
    byChannel.set(n.channel, (byChannel.get(n.channel) ?? 0) + 1);
  }

  for (const [trackIndex, count] of [...byTrack.entries()].sort((a, b) => a[0] - b[0])) {
    const tc = new TrackNoteCount();
    tc.setTrackIndex(trackIndex);
    tc.setNoteCount(count);
    result.addByTrack(tc);
  }
  for (const [channel, count] of [...byChannel.entries()].sort((a, b) => a[0] - b[0])) {
    const cc = new ChannelNoteCount();
    cc.setChannel(channel);
    cc.setNoteCount(count);
    result.addByChannel(cc);
  }
  result.setTotalNotes(notes.length);
  result.setOk(true);
  return result;
}
