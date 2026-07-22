import { validateMidiFile } from './validate_midi_file';
import { testContext } from './lib/test-context';
import {
  FIXTURE_A,
  FIXTURE_C_NOT_MIDI,
  FIXTURE_D_TRUNCATED,
  FIXTURE_E_TRACK_COUNT_MISMATCH,
  midiFileInput,
} from './lib/test-fixtures';

describe('ValidateMidiFile', () => {
  it('reports the well-formed fixture as valid with no issues', () => {
    const result = validateMidiFile(testContext, midiFileInput(FIXTURE_A));
    expect(result.getIsValid()).toBe(true);
    expect(result.getIssuesList().length).toBe(0);
  });

  it('reports non-MIDI input as invalid with a "missing MThd" style issue', () => {
    const result = validateMidiFile(testContext, midiFileInput(FIXTURE_C_NOT_MIDI));
    expect(result.getIsValid()).toBe(false);
    expect(result.getIssuesList().length).toBeGreaterThan(0);
    expect(result.getIssuesList()[0]).toMatch(/MThd/);
  });

  it('reports a truncated file as invalid, never throws', () => {
    const result = validateMidiFile(testContext, midiFileInput(FIXTURE_D_TRUNCATED));
    expect(result.getIsValid()).toBe(false);
    expect(result.getIssuesList().length).toBeGreaterThan(0);
  });

  it('reports a declared-vs-actual track count mismatch', () => {
    const result = validateMidiFile(testContext, midiFileInput(FIXTURE_E_TRACK_COUNT_MISMATCH));
    expect(result.getIsValid()).toBe(false);
    expect(result.getIssuesList().some((s) => s.includes('declares 2 track'))).toBe(true);
  });

  it('reports empty input as invalid', () => {
    const result = validateMidiFile(testContext, midiFileInput(new Uint8Array()));
    expect(result.getIsValid()).toBe(false);
  });
});
