import { ExtractControlChangesInput } from '../gen/messages_pb';
import { extractControlChanges } from './extract_control_changes';
import { testContext } from './lib/test-context';
import { FIXTURE_A } from './lib/test-fixtures';

function input(filterByChannel: boolean, channel: number) {
  const i = new ExtractControlChangesInput();
  i.setData(FIXTURE_A);
  i.setFilterByChannel(filterByChannel);
  i.setChannel(channel);
  return i;
}

describe('ExtractControlChanges', () => {
  it('extracts the single sustain (#64) controller event with its exact hand-derived value', () => {
    const result = extractControlChanges(testContext, input(false, 0));
    expect(result.getOk()).toBe(true);
    const events = result.getEventsList();
    expect(events.length).toBe(1);
    expect(events[0].getTick()).toBe(0);
    expect(events[0].getChannel()).toBe(0);
    expect(events[0].getControllerNumber()).toBe(64);
    expect(events[0].getValue()).toBe(127);
  });

  it('filters to channel 0 and finds the event', () => {
    const result = extractControlChanges(testContext, input(true, 0));
    expect(result.getOk()).toBe(true);
    expect(result.getEventsList().length).toBe(1);
  });

  it('filters to a channel with no controller events and returns empty', () => {
    const result = extractControlChanges(testContext, input(true, 5));
    expect(result.getOk()).toBe(true);
    expect(result.getEventsList().length).toBe(0);
  });
});
