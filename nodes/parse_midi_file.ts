import { MidiFile, ParseResult, MidiHeader as MidiHeaderMsg, Track, RawEvent } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { safeParse, iterateAbsoluteEvents } from './lib/midi-core';

/**
 * Parses a Standard MIDI File into its full structural representation:
 * header (format 0/1/2, track count, division) plus every track's events in
 * original order with absolute tick positions. This is the general-purpose
 * structural dump; use the more specific Extract* nodes when you only need
 * one event category. Returns ok=false with a descriptive error (never a
 * crash) on a malformed file, an oversized input, or a file whose event
 * count exceeds the safety cap.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseMidiFile(ax: AxiomContext, input: MidiFile): ParseResult {
  const result = new ParseResult();
  const { data, error } = safeParse(input.getData_asU8());
  if (!data) {
    result.setOk(false);
    result.setError(error!);
    return result;
  }

  const header = new MidiHeaderMsg();
  header.setFormat(data.header.format);
  header.setNumTracks(data.header.numTracks);
  header.setIsSmpte(data.header.isSmpte);
  header.setTicksPerQuarterNote(data.header.ticksPerQuarterNote);
  header.setFramesPerSecond(data.header.framesPerSecond);
  header.setTicksPerFrame(data.header.ticksPerFrame);
  header.setOk(true);
  result.setHeader(header);

  const tracksByIndex: Track[] = data.tracks.map((_, i) => {
    const t = new Track();
    t.setIndex(i);
    return t;
  });

  for (const { trackIndex, tick, event } of iterateAbsoluteEvents(data)) {
    const e = event as any;
    const raw = new RawEvent();
    raw.setTick(tick);
    raw.setType(e.type ?? '');
    raw.setIsMeta(!!e.meta);
    raw.setChannel(e.channel ?? 0);
    raw.setNoteNumber(e.noteNumber ?? 0);
    raw.setVelocity(e.velocity ?? 0);
    raw.setControllerNumber(e.controllerType ?? 0);
    raw.setValue(e.value ?? e.amount ?? 0);
    raw.setProgramNumber(e.programNumber ?? 0);
    raw.setText(e.text ?? '');
    raw.setMicrosecondsPerBeat(e.microsecondsPerBeat ?? 0);
    raw.setNumerator(e.numerator ?? 0);
    raw.setDenominator(e.denominator ?? 0);
    raw.setMetronomeClicks(e.metronome ?? 0);
    raw.setThirtysecondsPerQuarter(e.thirtyseconds ?? 0);
    raw.setKeySharpsFlats(e.key ?? 0);
    raw.setKeyIsMinor(e.scale === 1);

    const track = tracksByIndex[trackIndex];
    track.addEvents(raw);
    if (e.type === 'trackName' && !track.getName()) {
      track.setName(e.text ?? '');
    }
  }
  for (const t of tracksByIndex) {
    t.setEventCount(t.getEventsList().length);
    result.addTracks(t);
  }

  result.setOk(true);
  return result;
}
