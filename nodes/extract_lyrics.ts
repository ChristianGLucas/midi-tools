import { MidiFile, LyricsResult, LyricEvent } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, iterateAbsoluteEvents } from './lib/midi-core';

/**
 * Extracts every lyrics meta event across all tracks (tick position, track
 * index, text) — the per-syllable/word timing data karaoke-style MIDI files
 * encode.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractLyrics(ax: AxiomContext, input: MidiFile): LyricsResult {
  const result = new LyricsResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  for (const { trackIndex, tick, event } of iterateAbsoluteEvents(data)) {
    const e = event as any;
    if (e.type !== 'lyrics') continue;
    const le = new LyricEvent();
    le.setTick(tick);
    le.setTrackIndex(trackIndex);
    le.setText(e.text ?? '');
    result.addLyrics(le);
  }
  result.setOk(true);
  return result;
}
