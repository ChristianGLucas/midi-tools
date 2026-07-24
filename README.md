# midi-tools

Deterministic parsing and structural inspection of Standard MIDI Files (SMF,
`.mid`) — the binary format for timed musical performance/sequencing data
(note-on/off, tempo, control changes). This is distinct from music notation
(sheet music) or music-theory analysis (scales/chords/intervals): a MIDI file
encodes *performance* events, not printed notation or theoretical structure.

Built for the [Axiom](https://axiomide.com) marketplace, under the
`christiangeorgelucas` handle.

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/midi-tools@0.1.2

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/midi-tools/ParseMidiFile --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/midi-tools/0.1.2/ParseMidiFile \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/midi-tools/ParseMidiFile`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

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
input returns a structured error, never a crash.

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
