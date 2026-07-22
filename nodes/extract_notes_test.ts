import { ExtractNotesInput } from '../gen/messages_pb';
import { extractNotes } from './extract_notes';
import { testContext } from './lib/test-context';
import { FIXTURE_A, FIXTURE_C_NOT_MIDI } from './lib/test-fixtures';

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
});
