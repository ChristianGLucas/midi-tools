import { MidiFile } from '../gen/messages_pb';
import { extractLyrics } from './extract_lyrics';
import { testContext } from './lib/test-context';
import { FIXTURE_A, FIXTURE_F_LYRICS, midiFileInput } from './lib/test-fixtures';

describe('ExtractLyrics', () => {
  it('extracts both lyrics events with the exact hand-derived text/tick', () => {
    const result = extractLyrics(testContext, midiFileInput(FIXTURE_F_LYRICS));
    expect(result.getOk()).toBe(true);
    const lyrics = result.getLyricsList();
    expect(lyrics.length).toBe(2);
    expect(lyrics[0].getTick()).toBe(0);
    expect(lyrics[0].getTrackIndex()).toBe(0);
    expect(lyrics[0].getText()).toBe('La');
    expect(lyrics[1].getTick()).toBe(240);
    expect(lyrics[1].getText()).toBe('La');
  });

  it('returns an empty list for a file with no lyrics events', () => {
    const result = extractLyrics(testContext, midiFileInput(FIXTURE_A));
    expect(result.getOk()).toBe(true);
    expect(result.getLyricsList().length).toBe(0);
  });

  it('returns a structured error for empty input', () => {
    const result = extractLyrics(testContext, new MidiFile());
    expect(result.getOk()).toBe(false);
  });
});
