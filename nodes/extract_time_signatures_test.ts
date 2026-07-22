import { MidiFile } from '../gen/messages_pb';
import { extractTimeSignatures } from './extract_time_signatures';
import { testContext } from './lib/test-context';
import { FIXTURE_A, FIXTURE_B_SMPTE, midiFileInput } from './lib/test-fixtures';

describe('ExtractTimeSignatures', () => {
  it('extracts the single 4/4 time signature with the exact hand-derived fields', () => {
    const result = extractTimeSignatures(testContext, midiFileInput(FIXTURE_A));
    expect(result.getOk()).toBe(true);
    const events = result.getEventsList();
    expect(events.length).toBe(1);
    expect(events[0].getTick()).toBe(0);
    expect(events[0].getNumerator()).toBe(4);
    expect(events[0].getDenominator()).toBe(4);
    expect(events[0].getMetronomeClicks()).toBe(24);
    expect(events[0].getThirtysecondsPerQuarter()).toBe(8);
  });

  it('returns an empty list for a file with no time signature events', () => {
    const result = extractTimeSignatures(testContext, midiFileInput(FIXTURE_B_SMPTE));
    expect(result.getOk()).toBe(true);
    expect(result.getEventsList().length).toBe(0);
  });

  it('returns a structured error for empty input', () => {
    const result = extractTimeSignatures(testContext, new MidiFile());
    expect(result.getOk()).toBe(false);
  });
});
