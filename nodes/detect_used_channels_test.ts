import { MidiFile } from '../gen/messages_pb';
import { detectUsedChannels } from './detect_used_channels';
import { testContext } from './lib/test-context';
import { FIXTURE_A, FIXTURE_G_TWO_TEMPOS, midiFileInput } from './lib/test-fixtures';

describe('DetectUsedChannels', () => {
  it('detects channel 0 (from programChange, controller, noteOn/noteOff) and nothing else', () => {
    const result = detectUsedChannels(testContext, midiFileInput(FIXTURE_A));
    expect(result.getOk()).toBe(true);
    expect(result.getChannelsList()).toEqual([0]);
  });

  it('returns an empty list for a file with no channel-voice events', () => {
    const result = detectUsedChannels(testContext, midiFileInput(FIXTURE_G_TWO_TEMPOS));
    expect(result.getOk()).toBe(true);
    expect(result.getChannelsList().length).toBe(0);
  });

  it('returns a structured error for empty input', () => {
    const result = detectUsedChannels(testContext, new MidiFile());
    expect(result.getOk()).toBe(false);
  });
});
