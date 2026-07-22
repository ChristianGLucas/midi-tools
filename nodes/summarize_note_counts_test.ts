import { MidiFile } from '../gen/messages_pb';
import { summarizeNoteCounts } from './summarize_note_counts';
import { testContext } from './lib/test-context';
import { FIXTURE_A, midiFileInput } from './lib/test-fixtures';

describe('SummarizeNoteCounts', () => {
  it('counts the single note on track 1 / channel 0, totalNotes=1', () => {
    const result = summarizeNoteCounts(testContext, midiFileInput(FIXTURE_A));
    expect(result.getOk()).toBe(true);
    expect(result.getTotalNotes()).toBe(1);

    const byTrack = result.getByTrackList();
    expect(byTrack.length).toBe(1);
    expect(byTrack[0].getTrackIndex()).toBe(1);
    expect(byTrack[0].getNoteCount()).toBe(1);

    const byChannel = result.getByChannelList();
    expect(byChannel.length).toBe(1);
    expect(byChannel[0].getChannel()).toBe(0);
    expect(byChannel[0].getNoteCount()).toBe(1);
  });

  it('returns a structured error for empty input', () => {
    const result = summarizeNoteCounts(testContext, new MidiFile());
    expect(result.getOk()).toBe(false);
  });
});
