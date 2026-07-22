import { MidiFile } from '../gen/messages_pb';
import { extractTextEvents } from './extract_text_events';
import { testContext } from './lib/test-context';
import { FIXTURE_A, midiFileInput } from './lib/test-fixtures';

describe('ExtractTextEvents', () => {
  it('extracts both trackName events (and no others) with the exact hand-derived text/track/tick', () => {
    const result = extractTextEvents(testContext, midiFileInput(FIXTURE_A));
    expect(result.getOk()).toBe(true);
    const events = result.getEventsList();
    expect(events.length).toBe(2);

    expect(events[0].getType()).toBe('trackName');
    expect(events[0].getTrackIndex()).toBe(0);
    expect(events[0].getTick()).toBe(0);
    expect(events[0].getText()).toBe('Conductor');

    expect(events[1].getType()).toBe('trackName');
    expect(events[1].getTrackIndex()).toBe(1);
    expect(events[1].getText()).toBe('Piano');
  });

  it('returns a structured error for empty input', () => {
    const result = extractTextEvents(testContext, new MidiFile());
    expect(result.getOk()).toBe(false);
  });
});
