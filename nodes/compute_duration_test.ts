import { MidiFile } from '../gen/messages_pb';
import { computeDuration } from './compute_duration';
import { testContext } from './lib/test-context';
import { FIXTURE_A, FIXTURE_B_SMPTE, midiFileInput } from './lib/test-fixtures';

describe('ComputeDuration', () => {
  it('computes 480 ticks / 0.5s for the PPQ fixture (480 tpq @ 120 BPM = 1 quarter note)', () => {
    const result = computeDuration(testContext, midiFileInput(FIXTURE_A));
    expect(result.getOk()).toBe(true);
    expect(result.getTotalTicks()).toBe(480);
    expect(result.getTotalSeconds()).toBeCloseTo(0.5, 9);
  });

  it('computes 1000 ticks / 1.0s for the SMPTE fixture (25fps * 40 ticks/frame = 1000 ticks/sec)', () => {
    const result = computeDuration(testContext, midiFileInput(FIXTURE_B_SMPTE));
    expect(result.getOk()).toBe(true);
    expect(result.getTotalTicks()).toBe(1000);
    expect(result.getTotalSeconds()).toBeCloseTo(1.0, 9);
  });

  it('returns a structured error for empty input', () => {
    const result = computeDuration(testContext, new MidiFile());
    expect(result.getOk()).toBe(false);
  });
});
