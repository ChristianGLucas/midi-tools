import { MidiFile } from '../gen/messages_pb';
import { extractProgramChanges } from './extract_program_changes';
import { gmInstrumentName, GM_INSTRUMENT_NAMES } from './lib/gm-instruments';
import { testContext } from './lib/test-context';
import { FIXTURE_A, midiFileInput } from './lib/test-fixtures';

describe('ExtractProgramChanges', () => {
  it('extracts the single programChange decoded to the correct GM instrument name', () => {
    const result = extractProgramChanges(testContext, midiFileInput(FIXTURE_A));
    expect(result.getOk()).toBe(true);
    const events = result.getEventsList();
    expect(events.length).toBe(1);
    expect(events[0].getTick()).toBe(0);
    expect(events[0].getChannel()).toBe(0);
    expect(events[0].getProgramNumber()).toBe(0);
    expect(events[0].getInstrumentName()).toBe('Acoustic Grand Piano');
  });

  it('returns a structured error for empty input', () => {
    const result = extractProgramChanges(testContext, new MidiFile());
    expect(result.getOk()).toBe(false);
  });

  // The GM program-number -> instrument-name table itself, checked against
  // the public General MIDI Level 1 spec independent of any fixture.
  describe('gmInstrumentName', () => {
    it('has exactly 128 entries', () => {
      expect(GM_INSTRUMENT_NAMES.length).toBe(128);
    });
    it('maps known program numbers to their spec names', () => {
      expect(gmInstrumentName(0, 0)).toBe('Acoustic Grand Piano');
      expect(gmInstrumentName(0, 40)).toBe('Violin');
      expect(gmInstrumentName(0, 127)).toBe('Gunshot');
      expect(gmInstrumentName(0, 24)).toBe('Acoustic Guitar (nylon)');
    });
    it('reports channel 9 (GM percussion) as the standard drum kit regardless of program number', () => {
      expect(gmInstrumentName(9, 0)).toBe('Standard Drum Kit (GM percussion channel)');
      expect(gmInstrumentName(9, 50)).toBe('Standard Drum Kit (GM percussion channel)');
    });
  });
});
