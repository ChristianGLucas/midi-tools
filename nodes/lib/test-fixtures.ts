// Hand-crafted Standard MIDI File byte fixtures for tests.
//
// These bytes are constructed by hand, byte-by-byte, directly from the SMF
// spec (MThd/MTrk chunk framing, variable-length-quantity delta times, meta
// event 0xFF <type> <len> <data>, channel-voice status bytes) — NOT
// generated via midi-file's own writeMidi(). This makes every expected
// value asserted against them (in the *_test.ts files) an independent
// oracle: the ground truth comes from the spec + hand arithmetic, not from
// round-tripping through the same library under test.
import { MidiFile } from '../../gen/messages_pb';

function bytes(...vals: number[]): number[] {
  return vals;
}

function textBytes(s: string): number[] {
  return Array.from(s).map((c) => c.charCodeAt(0));
}

// VLQ (variable-length quantity) encoder — the SMF delta-time encoding.
// Independently implemented from the spec (7 bits per byte, MSB=1 means
// "more bytes follow"), deliberately separate from midi-file's own reader.
function vlq(value: number): number[] {
  if (value === 0) return [0x00];
  const out: number[] = [];
  let v = value;
  const chunks: number[] = [];
  chunks.push(v & 0x7f);
  v = Math.floor(v / 128);
  while (v > 0) {
    chunks.push(v & 0x7f);
    v = Math.floor(v / 128);
  }
  chunks.reverse();
  for (let i = 0; i < chunks.length; i++) {
    out.push(i < chunks.length - 1 ? chunks[i] | 0x80 : chunks[i]);
  }
  return out;
}

function u32be(value: number): number[] {
  return [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff];
}

function u16be(value: number): number[] {
  return [(value >>> 8) & 0xff, value & 0xff];
}

function chunk(id: string, data: number[]): number[] {
  return [...textBytes(id), ...u32be(data.length), ...data];
}

// ---- Fixture A: format-1, 2-track, 480 ticks/quarter-note -----------------
// Track 0 (conductor): trackName "Conductor", setTempo 500000us (=120 BPM),
// timeSignature 4/4 (metronome=24, 32nds=8), keySignature C major, endOfTrack.
// Track 1 (piano): trackName "Piano", programChange ch0 program0 (Acoustic
// Grand Piano), controller ch0 #64 (sustain) value 127, noteOn ch0 note60
// (C4) vel100 at tick 0, noteOff ch0 note60 at tick 480, endOfTrack.
//
// Hand-derived expected values (used directly in tests, computed from the
// bytes below by spec, not by running the parser):
//   header: format=1, numTracks=2, isSmpte=false, ticksPerQuarterNote=480
//   track0: name="Conductor", eventCount=5, noteCount=0
//   track1: name="Piano", eventCount=6, noteCount=1
//   the one note: channel=0, noteNumber=60, noteName="C4", velocity=100,
//     startTick=0, endTick=480, durationTick=480
//   tempo map: [{tick:0, microsecondsPerBeat:500000, bpm:120}]
//   time signature: [{tick:0, numerator:4, denominator:4, metronomeClicks:24, thirtysecondsPerQuarter:8}]
//   key signature: [{tick:0, sharpsFlats:0, isMinor:false, keyName:"C major"}]
//   program change: [{tick:0, channel:0, programNumber:0, instrumentName:"Acoustic Grand Piano"}]
//   control change: [{tick:0, channel:0, controllerNumber:64, value:127}]
//   total_ticks=480, total_seconds=0.5 (480 ticks @ 480 tpq @ 120 BPM = 1 quarter note = 0.5s)
//   used channels: [0]
const track0Data: number[] = [
  ...vlq(0), 0xff, 0x03, 0x09, ...textBytes('Conductor'), // trackName
  ...vlq(0), 0xff, 0x51, 0x03, 0x07, 0xa1, 0x20, // setTempo 500000 (0x07A120)
  ...vlq(0), 0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08, // timeSignature 4/4, metro 24, 32nds 8
  ...vlq(0), 0xff, 0x59, 0x02, 0x00, 0x00, // keySignature: 0 sharps/flats, major
  ...vlq(0), 0xff, 0x2f, 0x00, // endOfTrack
];

const track1Data: number[] = [
  ...vlq(0), 0xff, 0x03, 0x05, ...textBytes('Piano'), // trackName
  ...vlq(0), 0xc0, 0x00, // programChange ch0 program0
  ...vlq(0), 0xb0, 0x40, 0x7f, // controller ch0 #64 value127
  ...vlq(0), 0x90, 0x3c, 0x64, // noteOn ch0 note60 vel100
  ...vlq(480), 0x80, 0x3c, 0x40, // noteOff ch0 note60 vel64(release)
  ...vlq(0), 0xff, 0x2f, 0x00, // endOfTrack
];

const HEADER_A = chunk('MThd', [...u16be(1), ...u16be(2), ...u16be(480)]);
const FIXTURE_A_BYTES = new Uint8Array([...HEADER_A, ...chunk('MTrk', track0Data), ...chunk('MTrk', track1Data)]);

// ---- Fixture B: format-0, 1-track, SMPTE division (25 fps, 40 ticks/frame) -
// 1000 ticks/second exactly. Single endOfTrack at tick 1000 -> 1.0 second.
const smpteTrackData: number[] = [...vlq(1000), 0xff, 0x2f, 0x00];
// timeDivision top byte = 0x100 - framesPerSecond = 256-25 = 231 = 0xE7 (bit15 set => SMPTE)
// timeDivision low byte = ticksPerFrame = 40 = 0x28
const HEADER_B = chunk('MThd', [...u16be(0), ...u16be(1), 0xe7, 0x28]);
const FIXTURE_B_BYTES = new Uint8Array([...HEADER_B, ...chunk('MTrk', smpteTrackData)]);

// ---- Fixture C: not a MIDI file at all -------------------------------------
const FIXTURE_C_BYTES = new Uint8Array(textBytes('this is not a midi file at all, just text'));

// ---- Fixture D: fixture A truncated mid-track (malformed/truncated) -------
const FIXTURE_D_BYTES = FIXTURE_A_BYTES.slice(0, FIXTURE_A_BYTES.length - 10);

// ---- Fixture E: MThd declares 2 tracks but only 1 MTrk chunk follows ------
const HEADER_E = chunk('MThd', [...u16be(1), ...u16be(2), ...u16be(480)]);
const FIXTURE_E_BYTES = new Uint8Array([...HEADER_E, ...chunk('MTrk', track0Data)]);

// ---- Fixture F: format-0, 1-track, two lyrics meta events -----------------
// lyrics "La" at tick 0, lyrics "La" at tick 240 (half a quarter note later).
const lyricsTrackData: number[] = [
  ...vlq(0), 0xff, 0x05, 0x02, ...textBytes('La'),
  ...vlq(240), 0xff, 0x05, 0x02, ...textBytes('La'),
  ...vlq(0), 0xff, 0x2f, 0x00,
];
const HEADER_F = chunk('MThd', [...u16be(0), ...u16be(1), ...u16be(480)]);
const FIXTURE_F_BYTES = new Uint8Array([...HEADER_F, ...chunk('MTrk', lyricsTrackData)]);

export function midiFileInput(data: Uint8Array): MidiFile {
  const m = new MidiFile();
  m.setData(data);
  return m;
}

export const FIXTURE_A = FIXTURE_A_BYTES;
export const FIXTURE_B_SMPTE = FIXTURE_B_BYTES;
export const FIXTURE_C_NOT_MIDI = FIXTURE_C_BYTES;
export const FIXTURE_D_TRUNCATED = FIXTURE_D_BYTES;
// ---- Fixture G: two tempo segments, format-0, 1-track ----------------------
// setTempo 500000us (120 BPM) at tick 0; setTempo 1000000us (60 BPM) at tick
// 480; endOfTrack at tick 960 (480 ticks after the tempo change).
// Hand-derived expected total_seconds at tick 960: first 480 ticks @ 120 BPM
// = 0.5s, next 480 ticks @ 60 BPM = (480/480)*(1000000/1e6) = 1.0s.
// Total = 1.5s — genuinely exercises segment-by-segment tempo-map
// integration, not just a single constant tempo.
const twoTempoTrackData: number[] = [
  ...vlq(0), 0xff, 0x51, 0x03, 0x07, 0xa1, 0x20, // setTempo 500000 @ tick 0
  ...vlq(480), 0xff, 0x51, 0x03, 0x0f, 0x42, 0x40, // setTempo 1000000 (0x0F4240) @ tick 480
  ...vlq(480), 0xff, 0x2f, 0x00, // endOfTrack @ tick 960
];
const HEADER_G = chunk('MThd', [...u16be(0), ...u16be(1), ...u16be(480)]);
const FIXTURE_G_BYTES = new Uint8Array([...HEADER_G, ...chunk('MTrk', twoTempoTrackData)]);

export const FIXTURE_E_TRACK_COUNT_MISMATCH = FIXTURE_E_BYTES;
export const FIXTURE_F_LYRICS = FIXTURE_F_BYTES;
export const FIXTURE_G_TWO_TEMPOS = FIXTURE_G_BYTES;

// ---- Fixture H: a noteOn with no matching noteOff before endOfTrack -------
// noteOn ch0 note60 vel90 @ tick 0, then endOfTrack @ tick 200 (no noteOff
// ever arrives). Hand-derived expected: the note is still reported, closed
// at the track's last observed tick (200) rather than dropped or hung.
const danglingNoteTrackData: number[] = [
  ...vlq(0), 0x90, 0x3c, 0x5a, // noteOn ch0 note60 vel90
  ...vlq(200), 0xff, 0x2f, 0x00, // endOfTrack @ tick 200
];
const HEADER_H = chunk('MThd', [...u16be(0), ...u16be(1), ...u16be(480)]);
const FIXTURE_H_BYTES = new Uint8Array([...HEADER_H, ...chunk('MTrk', danglingNoteTrackData)]);

// ---- Fixture I: two overlapping same-pitch/same-channel notes -------------
// noteOn note60 vel80 @0, noteOn note60 vel90 @50 (still overlapping the
// first), noteOff @100 (should close the FIRST/earlier noteOn, FIFO), noteOff
// @150 (closes the second). Hand-derived expected: two notes,
// {start:0,end:100,vel:80} and {start:50,end:150,vel:90}.
const overlappingNotesTrackData: number[] = [
  ...vlq(0), 0x90, 0x3c, 0x50, // noteOn note60 vel80 @ tick 0
  ...vlq(50), 0x90, 0x3c, 0x5a, // noteOn note60 vel90 @ tick 50
  ...vlq(50), 0x80, 0x3c, 0x40, // noteOff note60 @ tick 100
  ...vlq(50), 0x80, 0x3c, 0x40, // noteOff note60 @ tick 150
  ...vlq(0), 0xff, 0x2f, 0x00,
];
const HEADER_I = chunk('MThd', [...u16be(0), ...u16be(1), ...u16be(480)]);
const FIXTURE_I_BYTES = new Uint8Array([...HEADER_I, ...chunk('MTrk', overlappingNotesTrackData)]);

// ---- Fixture J: a leading unmatched noteOff, then one real note -----------
// noteOff note64 @ tick 10 with NO prior noteOn (malformed-but-real-world),
// then a proper noteOn/noteOff pair for note64 @ tick 20..120.
// Hand-derived expected: exactly ONE note {start:20,end:120}; the leading
// unmatched noteOff is silently dropped, not turned into a phantom note.
const unmatchedNoteOffTrackData: number[] = [
  ...vlq(10), 0x80, 0x40, 0x40, // noteOff note64 @ tick 10 (unmatched)
  ...vlq(10), 0x90, 0x40, 0x46, // noteOn note64 vel70 @ tick 20
  ...vlq(100), 0x80, 0x40, 0x40, // noteOff note64 @ tick 120
  ...vlq(0), 0xff, 0x2f, 0x00,
];
const HEADER_J = chunk('MThd', [...u16be(0), ...u16be(1), ...u16be(480)]);
const FIXTURE_J_BYTES = new Uint8Array([...HEADER_J, ...chunk('MTrk', unmatchedNoteOffTrackData)]);

export const FIXTURE_H_DANGLING_NOTE = FIXTURE_H_BYTES;
export const FIXTURE_I_OVERLAPPING_NOTES = FIXTURE_I_BYTES;
export const FIXTURE_J_UNMATCHED_NOTEOFF = FIXTURE_J_BYTES;
