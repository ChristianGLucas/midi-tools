import { MidiFile, UsedChannelsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, iterateAbsoluteEvents, isChannelEvent } from './lib/midi-core';

/**
 * Scans every track for channel-voice events (note, controller, program
 * change, pitch bend, aftertouch) and returns the sorted set of distinct
 * MIDI channels (0-15) actually used anywhere in the file.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectUsedChannels(ax: AxiomContext, input: MidiFile): UsedChannelsResult {
  const result = new UsedChannelsResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  const channels = new Set<number>();
  for (const { event } of iterateAbsoluteEvents(data)) {
    const e = event as any;
    if (isChannelEvent(e)) channels.add(e.channel);
  }

  for (const c of [...channels].sort((a, b) => a - b)) {
    result.addChannels(c);
  }
  result.setOk(true);
  return result;
}
