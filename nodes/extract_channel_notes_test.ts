import { ExtractChannelNotesInput } from '../gen/messages_pb';
import { extractChannelNotes } from './extract_channel_notes';
import { testContext } from './lib/test-context';
import { FIXTURE_A } from './lib/test-fixtures';

function input(channel: number) {
  const i = new ExtractChannelNotesInput();
  i.setData(FIXTURE_A);
  i.setChannel(channel);
  return i;
}

describe('ExtractChannelNotes', () => {
  it('finds the single note on channel 0 with the exact hand-derived fields', () => {
    const result = extractChannelNotes(testContext, input(0));
    expect(result.getOk()).toBe(true);
    const notes = result.getNotesList();
    expect(notes.length).toBe(1);
    expect(notes[0].getChannel()).toBe(0);
    expect(notes[0].getNoteNumber()).toBe(60);
    expect(notes[0].getNoteName()).toBe('C4');
    expect(notes[0].getStartTick()).toBe(0);
    expect(notes[0].getEndTick()).toBe(480);
  });

  it('returns empty for a channel with no notes', () => {
    const result = extractChannelNotes(testContext, input(3));
    expect(result.getOk()).toBe(true);
    expect(result.getNotesList().length).toBe(0);
  });

  it('rejects an out-of-range channel with a structured error', () => {
    const result = extractChannelNotes(testContext, input(16));
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });
});
