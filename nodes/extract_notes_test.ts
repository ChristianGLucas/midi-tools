import { ExtractNotesInput } from '../gen/messages_pb';
import { extractNotes } from './extract_notes';
import { testContext } from './lib/test-context';
import {
  FIXTURE_A,
  FIXTURE_C_NOT_MIDI,
  FIXTURE_H_DANGLING_NOTE,
  FIXTURE_I_OVERLAPPING_NOTES,
  FIXTURE_J_UNMATCHED_NOTEOFF,
} from './lib/test-fixtures';

function input(trackIndex: number) {
  const i = new ExtractNotesInput();
  i.setData(FIXTURE_A);
  i.setTrackIndex(trackIndex);
  return i;
}

describe('ExtractNotes', () => {
  it('pairs the single noteOn/noteOff on track 1 into the exact hand-derived note', () => {
    const result = extractNotes(testContext, input(1));
    expect(result.getOk()).toBe(true);
    const notes = result.getNotesList();
    expect(notes.length).toBe(1);
    const n = notes[0];
    expect(n.getTrackIndex()).toBe(1);
    expect(n.getChannel()).toBe(0);
    expect(n.getNoteNumber()).toBe(60);
    expect(n.getNoteName()).toBe('C4');
    expect(n.getVelocity()).toBe(100);
    expect(n.getStartTick()).toBe(0);
    expect(n.getEndTick()).toBe(480);
    expect(n.getDurationTick()).toBe(480);
  });

  it('returns zero notes for the conductor track (no note events)', () => {
    const result = extractNotes(testContext, input(0));
    expect(result.getOk()).toBe(true);
    expect(result.getNotesList().length).toBe(0);
  });

  it('rejects an out-of-range track_index with a structured error', () => {
    const result = extractNotes(testContext, input(99));
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });

  it('returns a structured error for non-MIDI input', () => {
    const i = new ExtractNotesInput();
    i.setData(FIXTURE_C_NOT_MIDI);
    i.setTrackIndex(0);
    const result = extractNotes(testContext, i);
    expect(result.getOk()).toBe(false);
  });

  // Note-on/note-off pairing edge cases — this package's own logic (the
  // wrapped library only decodes individual events, it never pairs them).
  it('closes a note with no matching noteOff at the track\'s last observed tick (dangling noteOn)', () => {
    const i = new ExtractNotesInput();
    i.setData(FIXTURE_H_DANGLING_NOTE);
    i.setTrackIndex(0);
    const result = extractNotes(testContext, i);
    expect(result.getOk()).toBe(true);
    const notes = result.getNotesList();
    expect(notes.length).toBe(1);
    expect(notes[0].getNoteNumber()).toBe(60);
    expect(notes[0].getVelocity()).toBe(90);
    expect(notes[0].getStartTick()).toBe(0);
    expect(notes[0].getEndTick()).toBe(200);
    expect(notes[0].getDurationTick()).toBe(200);
  });

  it('pairs two overlapping same-pitch/same-channel notes FIFO, not by nearest match', () => {
    const i = new ExtractNotesInput();
    i.setData(FIXTURE_I_OVERLAPPING_NOTES);
    i.setTrackIndex(0);
    const result = extractNotes(testContext, i);
    expect(result.getOk()).toBe(true);
    const notes = result.getNotesList();
    expect(notes.length).toBe(2);
    // Sorted by startTick: the earlier noteOn (vel80) must close on the
    // FIRST noteOff (tick 100), not the second.
    expect(notes[0].getVelocity()).toBe(80);
    expect(notes[0].getStartTick()).toBe(0);
    expect(notes[0].getEndTick()).toBe(100);
    expect(notes[1].getVelocity()).toBe(90);
    expect(notes[1].getStartTick()).toBe(50);
    expect(notes[1].getEndTick()).toBe(150);
  });

  it('silently drops a leading unmatched noteOff instead of producing a phantom note', () => {
    const i = new ExtractNotesInput();
    i.setData(FIXTURE_J_UNMATCHED_NOTEOFF);
    i.setTrackIndex(0);
    const result = extractNotes(testContext, i);
    expect(result.getOk()).toBe(true);
    const notes = result.getNotesList();
    expect(notes.length).toBe(1);
    expect(notes[0].getStartTick()).toBe(20);
    expect(notes[0].getEndTick()).toBe(120);
    expect(notes[0].getVelocity()).toBe(70);
  });
});
