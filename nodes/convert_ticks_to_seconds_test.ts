import { TicksToSecondsInput } from '../gen/messages_pb';
import { convertTicksToSeconds } from './convert_ticks_to_seconds';
import { testContext } from './lib/test-context';
import { FIXTURE_A, FIXTURE_G_TWO_TEMPOS } from './lib/test-fixtures';

function input(data: Uint8Array, ticks: number[]) {
  const i = new TicksToSecondsInput();
  i.setData(data);
  for (const t of ticks) i.addTicks(t);
  return i;
}

describe('ConvertTicksToSeconds', () => {
  it('converts ticks 0/240/480 at a constant 120 BPM to the exact hand-derived seconds', () => {
    const result = convertTicksToSeconds(testContext, input(FIXTURE_A, [0, 240, 480]));
    expect(result.getOk()).toBe(true);
    const seconds = result.getSecondsList();
    expect(seconds.length).toBe(3);
    expect(seconds[0]).toBeCloseTo(0, 9);
    expect(seconds[1]).toBeCloseTo(0.25, 9);
    expect(seconds[2]).toBeCloseTo(0.5, 9);
  });

  it('correctly integrates across a tempo change (120 BPM then 60 BPM at tick 480)', () => {
    // tick 480 = end of the 120 BPM segment = 0.5s.
    // tick 720 = 240 ticks into the 60 BPM segment = 0.5 + (240/480)*(60/60) = 0.5 + 0.5 = 1.0s.
    // tick 960 = end of file = 0.5 + 1.0 = 1.5s.
    const result = convertTicksToSeconds(testContext, input(FIXTURE_G_TWO_TEMPOS, [0, 480, 720, 960]));
    expect(result.getOk()).toBe(true);
    const seconds = result.getSecondsList();
    expect(seconds[0]).toBeCloseTo(0, 9);
    expect(seconds[1]).toBeCloseTo(0.5, 9);
    expect(seconds[2]).toBeCloseTo(1.0, 9);
    expect(seconds[3]).toBeCloseTo(1.5, 9);
  });
});
