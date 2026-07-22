# midi-tools

Deterministic parsing and structural inspection of Standard MIDI Files (SMF,
`.mid`) — the binary format for timed musical performance/sequencing data
(note-on/off, tempo, control changes). This is distinct from music notation
(sheet music) or music-theory analysis (scales/chords/intervals): a MIDI file
encodes *performance* events, not printed notation or theoretical structure.

Built for the [Axiom](https://axiom.dev) marketplace, under the
`christiangeorgelucas` handle.

## What it does

Callers supply the raw bytes of a `.mid` file (base64-encoded over the
JSON/protobuf bridge). Nodes decode:

- **Structure**: full parse (header + every track's events), header fields
  alone (format/track count/division), a per-track listing.
- **Notes**: fully paired note-on/note-off events (per track or per channel),
  with note name, velocity, and tick timing.
- **Timing**: the tempo map (BPM over time), time signatures, total duration
  in ticks and seconds, and tick-to-second conversion via the real tempo map
  (or SMPTE frame rate).
- **Musical metadata**: key signatures (decoded to a key name), program
  changes (decoded to General MIDI instrument names), control changes.
- **Text**: track/instrument names, markers, cue points, copyright notices,
  and lyrics (karaoke-style timing).
- **Summary/validation**: note counts per track/channel, the set of MIDI
  channels used, and independent structural validation of the MThd/MTrk
  chunk layout.

Every node is a pure, deterministic struct-in/struct-out transform: no audio
synthesis, no network access, no wall-clock reads, no randomness. Malformed
or oversized input returns a structured error, never a crash.

## Implementation

Wraps [`midi-file`](https://github.com/carter-thaxton/midi-file) (MIT license,
zero runtime dependencies) for byte-level SMF decoding. All higher-level
derivations — note-on/off pairing, tempo-map integration for tick↔second
conversion, General MIDI instrument-name lookup, circle-of-fifths key-name
resolution, and independent chunk-structure validation — are implemented
directly in this package against the MIDI/GM specifications, not delegated to
the wrapped library.

## License

MIT — see [LICENSE](./LICENSE).
