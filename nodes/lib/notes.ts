// Note-on/note-off pairing — the one genuinely nontrivial parsing step this
// package owns itself (the wrapped library only decodes individual events;
// it does not pair them into notes).
import { ParsedMidi, iterateAbsoluteEvents, noteName as toNoteName } from './midi-core';

export interface PairedNote {
  trackIndex: number;
  channel: number;
  noteNumber: number;
  noteName: string;
  velocity: number;
  startTick: number;
  endTick: number;
  durationTick: number;
}

export interface NoteFilter {
  trackIndex?: number;
  channel?: number;
}

// Pairs every noteOn with its terminating noteOff. midi-file already folds
// a zero-velocity noteOn into type "noteOff" (the SMF-legal alternate
// encoding), so only "noteOn"/"noteOff" need handling here. Overlapping
// notes of the same pitch on the same channel are paired FIFO (the first
// still-open noteOn is closed by the next matching noteOff) — the standard,
// unambiguous interpretation when a MIDI stream never sends two identical
// noteOns for the same pitch/channel without an intervening noteOff.
export function extractPairedNotes(parsed: ParsedMidi, filter: NoteFilter = {}): PairedNote[] {
  const notes: PairedNote[] = [];
  // key -> FIFO queue of open noteOns
  const open = new Map<string, { startTick: number; velocity: number }[]>();
  // Track each track's last-seen tick so any note left open at end-of-track
  // (a malformed-but-common real-world case) still gets a bounded duration.
  const lastTickByTrack = new Map<number, number>();

  for (const { trackIndex, tick, event } of iterateAbsoluteEvents(parsed)) {
    if (filter.trackIndex !== undefined && trackIndex !== filter.trackIndex) continue;
    lastTickByTrack.set(trackIndex, tick);

    const type = (event as any).type;
    if (type !== 'noteOn' && type !== 'noteOff') continue;

    const channel = (event as any).channel;
    if (filter.channel !== undefined && channel !== filter.channel) continue;

    const noteNumber = (event as any).noteNumber;
    const key = `${trackIndex}:${channel}:${noteNumber}`;

    if (type === 'noteOn') {
      const velocity = (event as any).velocity;
      if (!open.has(key)) open.set(key, []);
      open.get(key)!.push({ startTick: tick, velocity });
    } else {
      const queue = open.get(key);
      if (queue && queue.length > 0) {
        const { startTick, velocity } = queue.shift()!;
        notes.push({
          trackIndex,
          channel,
          noteNumber,
          noteName: toNoteName(noteNumber),
          velocity,
          startTick,
          endTick: tick,
          durationTick: tick - startTick,
        });
      }
      // A noteOff with no matching open noteOn is silently dropped — it
      // cannot represent a real note.
    }
  }

  // Close out any notes still open at end-of-track (missing noteOff before
  // the track ended) at that track's last observed tick, duration 0 or
  // more — better than losing the note entirely or hanging.
  for (const [key, queue] of open) {
    if (queue.length === 0) continue;
    const [trackIndexStr, channelStr, noteNumberStr] = key.split(':');
    const trackIndex = Number(trackIndexStr);
    const channel = Number(channelStr);
    const noteNumber = Number(noteNumberStr);
    const endTick = lastTickByTrack.get(trackIndex) ?? 0;
    for (const { startTick, velocity } of queue) {
      notes.push({
        trackIndex,
        channel,
        noteNumber,
        noteName: toNoteName(noteNumber),
        velocity,
        startTick,
        endTick: Math.max(endTick, startTick),
        durationTick: Math.max(endTick, startTick) - startTick,
      });
    }
  }

  notes.sort((a, b) => a.startTick - b.startTick || a.trackIndex - b.trackIndex);
  return notes;
}
