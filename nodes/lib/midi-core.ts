// Shared SMF (Standard MIDI File) decode/derive helpers used by every node.
// Wraps midi-file (MIT, zero runtime deps) for byte-level chunk/event
// decoding; all higher-level derivations (note pairing, tempo-map
// integration, key/instrument naming, structural validation) are
// implemented here directly against the MIDI/GM specifications, not by the
// wrapped library.
import { parseMidi, MidiEvent as LibMidiEvent, MidiData as LibMidiData } from 'midi-file';

// ---- Input-surface safety bounds -------------------------------------------
// A malformed/adversarial input must fail with a structured error, never a
// crash or an unbounded allocation. MIDI files are small (well under the
// platform's ~4 MiB node-to-node transport cap), so these bounds are
// generous for any real file while still capping worst-case cost/output size.
export const MAX_INPUT_BYTES = 5 * 1024 * 1024; // 5 MiB
export const MAX_TOTAL_EVENTS = 500_000; // across all tracks combined

export interface ParsedHeader {
  format: number;
  numTracks: number;
  isSmpte: boolean;
  ticksPerQuarterNote: number;
  framesPerSecond: number;
  ticksPerFrame: number;
}

export interface ParsedMidi {
  header: ParsedHeader;
  // One array of events per track, in original file order, each already
  // carrying its own deltaTime (not yet summed to an absolute tick).
  tracks: LibMidiEvent[][];
}

export type { LibMidiEvent as MidiEvent };

function readUInt32BE(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]) >>>
    0
  );
}

// Independent structural walk of the SMF chunk layout (MThd + MTrk chunks),
// deliberately NOT using the parsing library — this is the second,
// from-scratch check that keeps a truncated/malformed file from being
// silently mis-parsed (the wrapped library's variable-length-int reader is
// permissive: it returns a partial value on premature EOF instead of
// throwing). Returns a list of distinct issues; empty means well-formed.
export function validateStructure(bytes: Uint8Array): string[] {
  const issues: string[] = [];
  if (bytes.length < 14) {
    issues.push(`file is only ${bytes.length} byte(s), too short to contain an MThd header chunk`);
    return issues;
  }
  const headerId = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  if (headerId !== 'MThd') {
    issues.push(`expected 'MThd' as the first chunk, found '${headerId.replace(/[^\x20-\x7e]/g, '?')}'`);
    return issues;
  }
  const headerLen = readUInt32BE(bytes, 4);
  if (headerLen < 6) {
    issues.push(`MThd chunk declares length ${headerLen}, smaller than the required 6 bytes`);
  }
  const headerDataStart = 8;
  if (headerDataStart + 6 > bytes.length) {
    issues.push('file is truncated inside the MThd chunk (cannot read format/numTracks/division)');
    return issues;
  }
  const declaredNumTracks = (bytes[headerDataStart + 2] << 8) | bytes[headerDataStart + 3];

  let pos = 8 + headerLen;
  let mtrkCount = 0;
  while (pos < bytes.length) {
    if (pos + 8 > bytes.length) {
      issues.push(`truncated chunk header at byte offset ${pos} (need 8 bytes for id+length, only ${bytes.length - pos} remain)`);
      break;
    }
    const id = String.fromCharCode(bytes[pos], bytes[pos + 1], bytes[pos + 2], bytes[pos + 3]);
    const len = readUInt32BE(bytes, pos + 4);
    const chunkDataStart = pos + 8;
    const chunkDataEnd = chunkDataStart + len;
    if (chunkDataEnd > bytes.length || len < 0) {
      issues.push(
        `chunk '${id.replace(/[^\x20-\x7e]/g, '?')}' at byte offset ${pos} declares length ${len} but only ${Math.max(0, bytes.length - chunkDataStart)} byte(s) remain`
      );
      break;
    }
    if (id === 'MTrk') mtrkCount++;
    pos = chunkDataEnd;
  }

  if (mtrkCount !== declaredNumTracks) {
    issues.push(`MThd declares ${declaredNumTracks} track(s) but ${mtrkCount} 'MTrk' chunk(s) were found`);
  }
  return issues;
}

// Decodes raw SMF bytes into a ParsedMidi, or a structured error string.
// Every node funnels through this single choke point so the size/event
// caps and the structural pre-check are enforced identically everywhere.
export function safeParse(bytes: Uint8Array | undefined | null): { data?: ParsedMidi; error?: string } {
  if (!bytes || bytes.length === 0) {
    return { error: 'empty input: no MIDI file data was supplied' };
  }
  if (bytes.length > MAX_INPUT_BYTES) {
    return { error: `input is ${bytes.length} bytes, exceeding the ${MAX_INPUT_BYTES}-byte maximum` };
  }

  const structuralIssues = validateStructure(bytes);
  if (structuralIssues.length > 0) {
    return { error: `not a well-formed Standard MIDI File: ${structuralIssues.join('; ')}` };
  }

  let raw: LibMidiData;
  try {
    raw = parseMidi(bytes);
  } catch (e) {
    return { error: `failed to parse MIDI file: ${String(e)}` };
  }

  const totalEvents = raw.tracks.reduce((sum, t) => sum + t.length, 0);
  if (totalEvents > MAX_TOTAL_EVENTS) {
    return { error: `midi file has ${totalEvents} events, exceeding the ${MAX_TOTAL_EVENTS}-event maximum` };
  }

  const h = raw.header as any;
  const isSmpte = typeof h.framesPerSecond === 'number';
  const header: ParsedHeader = {
    format: h.format,
    numTracks: h.numTracks,
    isSmpte,
    ticksPerQuarterNote: isSmpte ? 0 : h.ticksPerBeat ?? 0,
    framesPerSecond: isSmpte ? h.framesPerSecond : 0,
    ticksPerFrame: isSmpte ? h.ticksPerFrame : 0,
  };

  return { data: { header, tracks: raw.tracks as LibMidiEvent[][] } };
}

// ---- Absolute-tick event iteration -----------------------------------------

export interface AbsoluteEvent {
  trackIndex: number;
  tick: number;
  event: LibMidiEvent;
}

// Yields every event across every track with its absolute tick position
// (each track's delta-times summed independently, per the SMF spec — a
// track's timeline starts at 0 regardless of format 1's other tracks).
export function* iterateAbsoluteEvents(parsed: ParsedMidi): Generator<AbsoluteEvent> {
  for (let trackIndex = 0; trackIndex < parsed.tracks.length; trackIndex++) {
    let tick = 0;
    for (const event of parsed.tracks[trackIndex]) {
      tick += (event as any).deltaTime;
      yield { trackIndex, tick, event };
    }
  }
}

// ---- Tempo map & tick<->second conversion ----------------------------------

export interface TempoMapEntry {
  tick: number;
  microsecondsPerBeat: number;
}

export const DEFAULT_MICROSECONDS_PER_BEAT = 500_000; // MIDI spec default: 120 BPM

export function buildTempoMap(parsed: ParsedMidi): TempoMapEntry[] {
  const entries: TempoMapEntry[] = [];
  for (const { tick, event } of iterateAbsoluteEvents(parsed)) {
    if ((event as any).type === 'setTempo') {
      entries.push({ tick, microsecondsPerBeat: (event as any).microsecondsPerBeat });
    }
  }
  entries.sort((a, b) => a.tick - b.tick);
  if (entries.length === 0 || entries[0].tick > 0) {
    entries.unshift({ tick: 0, microsecondsPerBeat: DEFAULT_MICROSECONDS_PER_BEAT });
  }
  return entries;
}

export function bpmFromMicrosecondsPerBeat(microsecondsPerBeat: number): number {
  if (microsecondsPerBeat <= 0) return 0;
  return 60_000_000 / microsecondsPerBeat;
}

// Converts one absolute tick to seconds, either by integrating the tempo
// map segment-by-segment (ticks-per-quarter-note division) or, for SMPTE
// division, directly from the fixed frame rate (SMPTE ticks are wall-clock
// locked and do not use tempo events at all).
export function ticksToSeconds(tick: number, header: ParsedHeader, tempoMap: TempoMapEntry[]): number {
  if (tick <= 0) return 0;

  if (header.isSmpte) {
    const ticksPerSecond = header.framesPerSecond * header.ticksPerFrame;
    if (ticksPerSecond <= 0) return 0;
    return tick / ticksPerSecond;
  }

  const ticksPerBeat = header.ticksPerQuarterNote || 1;
  let seconds = 0;
  for (let i = 0; i < tempoMap.length; i++) {
    const segStart = tempoMap[i].tick;
    if (tick <= segStart) break;
    const segEnd = i + 1 < tempoMap.length ? tempoMap[i + 1].tick : tick;
    const effectiveEnd = Math.min(tick, segEnd);
    const spanTicks = effectiveEnd - segStart;
    if (spanTicks > 0) {
      seconds += (spanTicks / ticksPerBeat) * (tempoMap[i].microsecondsPerBeat / 1_000_000);
    }
    if (tick <= segEnd) break;
  }
  return seconds;
}

// ---- Note naming (scientific pitch notation) -------------------------------

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// MIDI note 60 = C4 (middle C) — the widely-used Yamaha/DAW convention.
export function noteName(noteNumber: number): string {
  const octave = Math.floor(noteNumber / 12) - 1;
  return `${NOTE_NAMES[noteNumber % 12]}${octave}`;
}

// ---- Key signature naming (circle of fifths) -------------------------------

const MAJOR_KEY_BY_SHARPS_FLATS: Record<number, string> = {
  [-7]: 'Cb', [-6]: 'Gb', [-5]: 'Db', [-4]: 'Ab', [-3]: 'Eb', [-2]: 'Bb', [-1]: 'F',
  [0]: 'C',
  [1]: 'G', [2]: 'D', [3]: 'A', [4]: 'E', [5]: 'B', [6]: 'F#', [7]: 'C#',
};

const MINOR_KEY_BY_SHARPS_FLATS: Record<number, string> = {
  [-7]: 'Ab', [-6]: 'Eb', [-5]: 'Bb', [-4]: 'F', [-3]: 'C', [-2]: 'G', [-1]: 'D',
  [0]: 'A',
  [1]: 'E', [2]: 'B', [3]: 'F#', [4]: 'C#', [5]: 'G#', [6]: 'D#', [7]: 'A#',
};

export function keySignatureName(sharpsFlats: number, isMinor: boolean): string {
  const table = isMinor ? MINOR_KEY_BY_SHARPS_FLATS : MAJOR_KEY_BY_SHARPS_FLATS;
  const tonic = table[sharpsFlats] ?? '?';
  return `${tonic} ${isMinor ? 'minor' : 'major'}`;
}

// ---- Channel-voice event predicate -----------------------------------------

const CHANNEL_EVENT_TYPES = new Set([
  'noteOn', 'noteOff', 'noteAftertouch', 'controller', 'programChange',
  'channelAftertouch', 'pitchBend',
]);

export function isChannelEvent(event: LibMidiEvent): boolean {
  return CHANNEL_EVENT_TYPES.has((event as any).type);
}
