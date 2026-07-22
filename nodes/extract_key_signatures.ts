import { MidiFile, KeySignaturesResult, KeySignatureEvent } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, iterateAbsoluteEvents, keySignatureName } from './lib/midi-core';

/**
 * Extracts every keySignature meta event across all tracks: tick position,
 * signed sharps/flats count (-7..7, negative = flats), major vs minor, and
 * the resolved key name (e.g. "D major", "B minor") via the standard
 * circle-of-fifths mapping.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractKeySignatures(ax: AxiomContext, input: MidiFile): KeySignaturesResult {
  const result = new KeySignaturesResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  for (const { tick, event } of iterateAbsoluteEvents(data)) {
    const e = event as any;
    if (e.type !== 'keySignature') continue;
    const isMinor = e.scale === 1;
    const ks = new KeySignatureEvent();
    ks.setTick(tick);
    ks.setSharpsFlats(e.key);
    ks.setIsMinor(isMinor);
    ks.setKeyName(keySignatureName(e.key, isMinor));
    result.addEvents(ks);
  }
  result.setOk(true);
  return result;
}
