import { MidiFile } from '../gen/messages_pb';
import { extractKeySignatures } from './extract_key_signatures';
import { keySignatureName } from './lib/midi-core';
import { testContext } from './lib/test-context';
import { FIXTURE_A, midiFileInput } from './lib/test-fixtures';

describe('ExtractKeySignatures', () => {
  it('extracts the single C major key signature with the exact hand-derived fields', () => {
    const result = extractKeySignatures(testContext, midiFileInput(FIXTURE_A));
    expect(result.getOk()).toBe(true);
    const events = result.getEventsList();
    expect(events.length).toBe(1);
    expect(events[0].getTick()).toBe(0);
    expect(events[0].getSharpsFlats()).toBe(0);
    expect(events[0].getIsMinor()).toBe(false);
    expect(events[0].getKeyName()).toBe('C major');
  });

  it('returns a structured error for empty input', () => {
    const result = extractKeySignatures(testContext, new MidiFile());
    expect(result.getOk()).toBe(false);
  });

  // The circle-of-fifths naming table itself, independently hand-verified
  // against standard music theory (not just the trivial 0-sharps/flats case
  // the fixture exercises above).
  describe('keySignatureName (circle of fifths)', () => {
    it.each([
      [0, false, 'C major'],
      [1, false, 'G major'],
      [-1, false, 'F major'],
      [7, false, 'C# major'],
      [-7, false, 'Cb major'],
      [0, true, 'A minor'],
      [3, true, 'F# minor'],
      [-3, true, 'C minor'],
    ])('sharpsFlats=%i isMinor=%s -> %s', (sf, minor, expected) => {
      expect(keySignatureName(sf as number, minor as boolean)).toBe(expected);
    });
  });
});
