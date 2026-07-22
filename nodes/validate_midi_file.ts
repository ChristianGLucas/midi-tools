import { MidiFile, ValidationResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { validateStructure, MAX_INPUT_BYTES } from './lib/midi-core';

/**
 * Independently validates that the input is a well-formed Standard MIDI
 * File by walking its chunk structure from scratch (not via the parsing
 * library): confirms the MThd header chunk is present with a sane length,
 * that the declared track count matches the number of MTrk chunks actually
 * found, and that no chunk's declared length runs past the end of the file.
 * Returns is_valid plus a human-readable issue per distinct structural
 * problem found — never throws on malformed input.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateMidiFile(ax: AxiomContext, input: MidiFile): ValidationResult {
  const result = new ValidationResult();
  const bytes = input.getData_asU8();

  if (!bytes || bytes.length === 0) {
    result.setIsValid(false);
    result.addIssues('empty input: no MIDI file data was supplied');
    return result;
  }
  if (bytes.length > MAX_INPUT_BYTES) {
    result.setIsValid(false);
    result.addIssues(`input is ${bytes.length} bytes, exceeding the ${MAX_INPUT_BYTES}-byte maximum`);
    return result;
  }

  const issues = validateStructure(bytes);
  result.setIsValid(issues.length === 0);
  for (const issue of issues) result.addIssues(issue);
  return result;
}
