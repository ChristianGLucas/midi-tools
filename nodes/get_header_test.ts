import { MidiFile } from '../gen/messages_pb';
import { getHeader } from './get_header';
import { testContext } from './lib/test-context';
import { FIXTURE_A, FIXTURE_B_SMPTE, FIXTURE_C_NOT_MIDI, midiFileInput } from './lib/test-fixtures';

describe('GetHeader', () => {
  it('returns the exact hand-derived header for the PPQ fixture', () => {
    const h = getHeader(testContext, midiFileInput(FIXTURE_A));
    expect(h.getOk()).toBe(true);
    expect(h.getFormat()).toBe(1);
    expect(h.getNumTracks()).toBe(2);
    expect(h.getIsSmpte()).toBe(false);
    expect(h.getTicksPerQuarterNote()).toBe(480);
    expect(h.getFramesPerSecond()).toBe(0);
    expect(h.getTicksPerFrame()).toBe(0);
  });

  it('returns the exact hand-derived header for the SMPTE fixture', () => {
    const h = getHeader(testContext, midiFileInput(FIXTURE_B_SMPTE));
    expect(h.getOk()).toBe(true);
    expect(h.getFormat()).toBe(0);
    expect(h.getNumTracks()).toBe(1);
    expect(h.getIsSmpte()).toBe(true);
    expect(h.getFramesPerSecond()).toBe(25);
    expect(h.getTicksPerFrame()).toBe(40);
    expect(h.getTicksPerQuarterNote()).toBe(0);
  });

  it('returns a structured error for non-MIDI input, never a crash', () => {
    const h = getHeader(testContext, midiFileInput(FIXTURE_C_NOT_MIDI));
    expect(h.getOk()).toBe(false);
    expect(h.getError().length).toBeGreaterThan(0);
    expect(h.getNumTracks()).toBe(0);
  });

  it('returns a structured error for empty input', () => {
    const h = getHeader(testContext, new MidiFile());
    expect(h.getOk()).toBe(false);
  });
});
