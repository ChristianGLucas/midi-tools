import { MidiFile, ListTracksResult, TrackInfo } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, iterateAbsoluteEvents } from './lib/midi-core';

/**
 * Lists every track with its index, name (from the track's first trackName
 * meta event, empty if none), total event count, and note count — a quick
 * structural overview before extracting specific event types.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listTracks(ax: AxiomContext, input: MidiFile): ListTracksResult {
  const result = new ListTracksResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  const names: string[] = new Array(data.tracks.length).fill('');
  const eventCounts: number[] = data.tracks.map((t) => t.length);
  const noteCounts: number[] = new Array(data.tracks.length).fill(0);

  for (const { trackIndex, event } of iterateAbsoluteEvents(data)) {
    const e = event as any;
    if (e.type === 'trackName' && !names[trackIndex]) names[trackIndex] = e.text ?? '';
    if (e.type === 'noteOn') noteCounts[trackIndex]++;
  }

  for (let i = 0; i < data.tracks.length; i++) {
    const info = new TrackInfo();
    info.setIndex(i);
    info.setName(names[i]);
    info.setEventCount(eventCounts[i]);
    info.setNoteCount(noteCounts[i]);
    result.addTracks(info);
  }
  result.setOk(true);
  return result;
}
