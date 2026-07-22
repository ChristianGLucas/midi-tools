import { MidiFile } from '../gen/messages_pb';
import { extractTempoMap } from './extract_tempo_map';
import { testContext } from './lib/test-context';
import { FIXTURE_A, FIXTURE_B_SMPTE, midiFileInput } from './lib/test-fixtures';

describe('ExtractTempoMap', () => {
  it('extracts the single explicit setTempo event (500000us = 120 BPM) at tick 0', () => {
    const result = extractTempoMap(testContext, midiFileInput(FIXTURE_A));
    expect(result.getOk()).toBe(true);
    const events = result.getTempoEventsList();
    expect(events.length).toBe(1);
    expect(events[0].getTick()).toBe(0);
    expect(events[0].getMicrosecondsPerBeat()).toBe(500000);
    expect(events[0].getBpm()).toBeCloseTo(120, 6);
  });

  it('supplies the implicit 120 BPM default when a file has no setTempo event', () => {
    const result = extractTempoMap(testContext, midiFileInput(FIXTURE_B_SMPTE));
    expect(result.getOk()).toBe(true);
    const events = result.getTempoEventsList();
    expect(events.length).toBe(1);
    expect(events[0].getTick()).toBe(0);
    expect(events[0].getMicrosecondsPerBeat()).toBe(500000);
  });

  it('returns a structured error for empty input', () => {
    const result = extractTempoMap(testContext, new MidiFile());
    expect(result.getOk()).toBe(false);
  });
});
