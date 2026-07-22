import { MidiFile } from '../gen/messages_pb';
import { listTracks } from './list_tracks';
import { testContext } from './lib/test-context';
import { FIXTURE_A, FIXTURE_C_NOT_MIDI, midiFileInput } from './lib/test-fixtures';

describe('ListTracks', () => {
  it('lists both tracks with the exact hand-derived name/event/note counts', () => {
    const result = listTracks(testContext, midiFileInput(FIXTURE_A));
    expect(result.getOk()).toBe(true);
    const tracks = result.getTracksList();
    expect(tracks.length).toBe(2);

    expect(tracks[0].getIndex()).toBe(0);
    expect(tracks[0].getName()).toBe('Conductor');
    expect(tracks[0].getEventCount()).toBe(5);
    expect(tracks[0].getNoteCount()).toBe(0);

    expect(tracks[1].getIndex()).toBe(1);
    expect(tracks[1].getName()).toBe('Piano');
    expect(tracks[1].getEventCount()).toBe(6);
    expect(tracks[1].getNoteCount()).toBe(1);
  });

  it('returns a structured error for non-MIDI input', () => {
    const result = listTracks(testContext, midiFileInput(FIXTURE_C_NOT_MIDI));
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
    expect(result.getTracksList().length).toBe(0);
  });

  it('returns a structured error for empty input', () => {
    const result = listTracks(testContext, new MidiFile());
    expect(result.getOk()).toBe(false);
  });
});
