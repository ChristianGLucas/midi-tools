import { MidiFile, TextEventsResult, TextEvent } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, iterateAbsoluteEvents } from './lib/midi-core';

const TEXT_META_TYPES = new Set(['trackName', 'instrumentName', 'text', 'marker', 'cuePoint', 'copyrightNotice']);

/**
 * Extracts every non-lyric text-bearing meta event across all tracks —
 * trackName, instrumentName, text, marker, cuePoint, and copyrightNotice —
 * each tagged with its type, track index, and tick position. Lyrics are
 * intentionally excluded here; use ExtractLyrics for karaoke-style lyric
 * events.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractTextEvents(ax: AxiomContext, input: MidiFile): TextEventsResult {
  const result = new TextEventsResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  for (const { trackIndex, tick, event } of iterateAbsoluteEvents(data)) {
    const e = event as any;
    if (!TEXT_META_TYPES.has(e.type)) continue;
    const te = new TextEvent();
    te.setTick(tick);
    te.setTrackIndex(trackIndex);
    te.setType(e.type);
    te.setText(e.text ?? '');
    result.addEvents(te);
  }
  result.setOk(true);
  return result;
}
