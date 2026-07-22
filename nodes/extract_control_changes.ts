import { ExtractControlChangesInput, ControlChangesResult, ControlChangeEvent } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, iterateAbsoluteEvents } from './lib/midi-core';

/**
 * Extracts controller (control-change) events across all tracks — tick
 * position, channel, controller number (e.g. 7 = channel volume, 64 =
 * sustain pedal), and value. Set filter_by_channel=true with a channel to
 * restrict to one channel; otherwise every channel's controller events are
 * returned.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractControlChanges(ax: AxiomContext, input: ExtractControlChangesInput): ControlChangesResult {
  const result = new ControlChangesResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  const filterByChannel = input.getFilterByChannel();
  const channel = input.getChannel();

  for (const { tick, event } of iterateAbsoluteEvents(data)) {
    const e = event as any;
    if (e.type !== 'controller') continue;
    if (filterByChannel && e.channel !== channel) continue;
    const cc = new ControlChangeEvent();
    cc.setTick(tick);
    cc.setChannel(e.channel);
    cc.setControllerNumber(e.controllerType);
    cc.setValue(e.value);
    result.addEvents(cc);
  }
  result.setOk(true);
  return result;
}
