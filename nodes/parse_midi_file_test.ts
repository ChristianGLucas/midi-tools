import { MidiFile, ParseResult } from '../gen/messages_pb';
import { parseMidiFile } from './parse_midi_file';
import { AxiomContext, AxiomLogger, AxiomSecrets, AxiomReflection, AxiomMutation } from '../gen/axiomContext';
import { FIXTURE_A, FIXTURE_B_SMPTE, FIXTURE_C_NOT_MIDI, FIXTURE_D_TRUNCATED, midiFileInput } from './lib/test-fixtures';

const testReflection: AxiomReflection = {
  flow: { nodes: [], edges: [], loopEdges: [], position: { currentInstance: 0, depth: 0, loopIterations: {}, subflowStackGraphIds: [] }, graphId: '' },
};
const testMutation: AxiomMutation = {
  flow: { addNode: (_p: string, _v: string) => 0, addEdge: (_s: number, _d: number) => {} },
};
const testContext: AxiomContext = {
  log: { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} } satisfies AxiomLogger,
  secrets: { get: (_n: string): [string, boolean] => ['', false] } satisfies AxiomSecrets,
  executionId: 'test-execution-id',
  flowId: 'test-flow-id',
  tenantId: 'test-tenant-id',
  reflection: testReflection,
  mutation: testMutation,
};

describe('ParseMidiFile', () => {
  it('parses the hand-crafted 2-track fixture into the exact expected structure', () => {
    const result = parseMidiFile(testContext, midiFileInput(FIXTURE_A));
    expect(result).toBeInstanceOf(ParseResult);
    expect(result.getOk()).toBe(true);
    expect(result.getError()).toBe('');

    const header = result.getHeader()!;
    expect(header.getFormat()).toBe(1);
    expect(header.getNumTracks()).toBe(2);
    expect(header.getIsSmpte()).toBe(false);
    expect(header.getTicksPerQuarterNote()).toBe(480);

    const tracks = result.getTracksList();
    expect(tracks.length).toBe(2);
    expect(tracks[0].getIndex()).toBe(0);
    expect(tracks[0].getName()).toBe('Conductor');
    expect(tracks[0].getEventCount()).toBe(5);
    expect(tracks[1].getName()).toBe('Piano');
    expect(tracks[1].getEventCount()).toBe(6);

    // Spot-check the noteOn and noteOff raw events on track 1 carry the
    // right absolute ticks (noteOff at 480, not the raw delta 480).
    const events = tracks[1].getEventsList();
    const noteOn = events.find((e) => e.getType() === 'noteOn')!;
    const noteOff = events.find((e) => e.getType() === 'noteOff')!;
    expect(noteOn.getTick()).toBe(0);
    expect(noteOn.getNoteNumber()).toBe(60);
    expect(noteOn.getVelocity()).toBe(100);
    expect(noteOff.getTick()).toBe(480);
  });

  it('parses the SMPTE-division fixture header correctly', () => {
    const result = parseMidiFile(testContext, midiFileInput(FIXTURE_B_SMPTE));
    expect(result.getOk()).toBe(true);
    const header = result.getHeader()!;
    expect(header.getIsSmpte()).toBe(true);
    expect(header.getFramesPerSecond()).toBe(25);
    expect(header.getTicksPerFrame()).toBe(40);
  });

  it('returns a structured error (not a crash) for non-MIDI input', () => {
    const result = parseMidiFile(testContext, midiFileInput(FIXTURE_C_NOT_MIDI));
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
    expect(result.getTracksList().length).toBe(0);
  });

  it('returns a structured error (not a crash) for a truncated file', () => {
    const result = parseMidiFile(testContext, midiFileInput(FIXTURE_D_TRUNCATED));
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });

  it('returns a structured error for empty input', () => {
    const result = parseMidiFile(testContext, new MidiFile());
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });

  it('is deterministic across repeated invocations', () => {
    const r1 = parseMidiFile(testContext, midiFileInput(FIXTURE_A));
    const r2 = parseMidiFile(testContext, midiFileInput(FIXTURE_A));
    expect(r1.getTracksList().length).toBe(r2.getTracksList().length);
    expect(r1.getHeader()!.getTicksPerQuarterNote()).toBe(r2.getHeader()!.getTicksPerQuarterNote());
  });
});
