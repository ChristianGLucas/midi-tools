// package: christiangeorgelucas.midi_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class MidiFile extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MidiFile.AsObject;
  static toObject(includeInstance: boolean, msg: MidiFile): MidiFile.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MidiFile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MidiFile;
  static deserializeBinaryFromReader(message: MidiFile, reader: jspb.BinaryReader): MidiFile;
}

export namespace MidiFile {
  export type AsObject = {
    data: Uint8Array | string,
  }
}

export class MidiHeader extends jspb.Message {
  getFormat(): number;
  setFormat(value: number): void;

  getNumTracks(): number;
  setNumTracks(value: number): void;

  getIsSmpte(): boolean;
  setIsSmpte(value: boolean): void;

  getTicksPerQuarterNote(): number;
  setTicksPerQuarterNote(value: number): void;

  getFramesPerSecond(): number;
  setFramesPerSecond(value: number): void;

  getTicksPerFrame(): number;
  setTicksPerFrame(value: number): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MidiHeader.AsObject;
  static toObject(includeInstance: boolean, msg: MidiHeader): MidiHeader.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MidiHeader, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MidiHeader;
  static deserializeBinaryFromReader(message: MidiHeader, reader: jspb.BinaryReader): MidiHeader;
}

export namespace MidiHeader {
  export type AsObject = {
    format: number,
    numTracks: number,
    isSmpte: boolean,
    ticksPerQuarterNote: number,
    framesPerSecond: number,
    ticksPerFrame: number,
    ok: boolean,
    error: string,
  }
}

export class RawEvent extends jspb.Message {
  getTick(): number;
  setTick(value: number): void;

  getType(): string;
  setType(value: string): void;

  getIsMeta(): boolean;
  setIsMeta(value: boolean): void;

  getChannel(): number;
  setChannel(value: number): void;

  getNoteNumber(): number;
  setNoteNumber(value: number): void;

  getVelocity(): number;
  setVelocity(value: number): void;

  getControllerNumber(): number;
  setControllerNumber(value: number): void;

  getValue(): number;
  setValue(value: number): void;

  getProgramNumber(): number;
  setProgramNumber(value: number): void;

  getText(): string;
  setText(value: string): void;

  getMicrosecondsPerBeat(): number;
  setMicrosecondsPerBeat(value: number): void;

  getNumerator(): number;
  setNumerator(value: number): void;

  getDenominator(): number;
  setDenominator(value: number): void;

  getMetronomeClicks(): number;
  setMetronomeClicks(value: number): void;

  getThirtysecondsPerQuarter(): number;
  setThirtysecondsPerQuarter(value: number): void;

  getKeySharpsFlats(): number;
  setKeySharpsFlats(value: number): void;

  getKeyIsMinor(): boolean;
  setKeyIsMinor(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RawEvent.AsObject;
  static toObject(includeInstance: boolean, msg: RawEvent): RawEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RawEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RawEvent;
  static deserializeBinaryFromReader(message: RawEvent, reader: jspb.BinaryReader): RawEvent;
}

export namespace RawEvent {
  export type AsObject = {
    tick: number,
    type: string,
    isMeta: boolean,
    channel: number,
    noteNumber: number,
    velocity: number,
    controllerNumber: number,
    value: number,
    programNumber: number,
    text: string,
    microsecondsPerBeat: number,
    numerator: number,
    denominator: number,
    metronomeClicks: number,
    thirtysecondsPerQuarter: number,
    keySharpsFlats: number,
    keyIsMinor: boolean,
  }
}

export class Track extends jspb.Message {
  getIndex(): number;
  setIndex(value: number): void;

  getName(): string;
  setName(value: string): void;

  getEventCount(): number;
  setEventCount(value: number): void;

  clearEventsList(): void;
  getEventsList(): Array<RawEvent>;
  setEventsList(value: Array<RawEvent>): void;
  addEvents(value?: RawEvent, index?: number): RawEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Track.AsObject;
  static toObject(includeInstance: boolean, msg: Track): Track.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Track, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Track;
  static deserializeBinaryFromReader(message: Track, reader: jspb.BinaryReader): Track;
}

export namespace Track {
  export type AsObject = {
    index: number,
    name: string,
    eventCount: number,
    eventsList: Array<RawEvent.AsObject>,
  }
}

export class ParseResult extends jspb.Message {
  hasHeader(): boolean;
  clearHeader(): void;
  getHeader(): MidiHeader | undefined;
  setHeader(value?: MidiHeader): void;

  clearTracksList(): void;
  getTracksList(): Array<Track>;
  setTracksList(value: Array<Track>): void;
  addTracks(value?: Track, index?: number): Track;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseResult.AsObject;
  static toObject(includeInstance: boolean, msg: ParseResult): ParseResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseResult;
  static deserializeBinaryFromReader(message: ParseResult, reader: jspb.BinaryReader): ParseResult;
}

export namespace ParseResult {
  export type AsObject = {
    header?: MidiHeader.AsObject,
    tracksList: Array<Track.AsObject>,
    ok: boolean,
    error: string,
  }
}

export class TrackInfo extends jspb.Message {
  getIndex(): number;
  setIndex(value: number): void;

  getName(): string;
  setName(value: string): void;

  getEventCount(): number;
  setEventCount(value: number): void;

  getNoteCount(): number;
  setNoteCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrackInfo.AsObject;
  static toObject(includeInstance: boolean, msg: TrackInfo): TrackInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrackInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrackInfo;
  static deserializeBinaryFromReader(message: TrackInfo, reader: jspb.BinaryReader): TrackInfo;
}

export namespace TrackInfo {
  export type AsObject = {
    index: number,
    name: string,
    eventCount: number,
    noteCount: number,
  }
}

export class ListTracksResult extends jspb.Message {
  clearTracksList(): void;
  getTracksList(): Array<TrackInfo>;
  setTracksList(value: Array<TrackInfo>): void;
  addTracks(value?: TrackInfo, index?: number): TrackInfo;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListTracksResult.AsObject;
  static toObject(includeInstance: boolean, msg: ListTracksResult): ListTracksResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListTracksResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListTracksResult;
  static deserializeBinaryFromReader(message: ListTracksResult, reader: jspb.BinaryReader): ListTracksResult;
}

export namespace ListTracksResult {
  export type AsObject = {
    tracksList: Array<TrackInfo.AsObject>,
    ok: boolean,
    error: string,
  }
}

export class Note extends jspb.Message {
  getTrackIndex(): number;
  setTrackIndex(value: number): void;

  getChannel(): number;
  setChannel(value: number): void;

  getNoteNumber(): number;
  setNoteNumber(value: number): void;

  getNoteName(): string;
  setNoteName(value: string): void;

  getVelocity(): number;
  setVelocity(value: number): void;

  getStartTick(): number;
  setStartTick(value: number): void;

  getEndTick(): number;
  setEndTick(value: number): void;

  getDurationTick(): number;
  setDurationTick(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Note.AsObject;
  static toObject(includeInstance: boolean, msg: Note): Note.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Note, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Note;
  static deserializeBinaryFromReader(message: Note, reader: jspb.BinaryReader): Note;
}

export namespace Note {
  export type AsObject = {
    trackIndex: number,
    channel: number,
    noteNumber: number,
    noteName: string,
    velocity: number,
    startTick: number,
    endTick: number,
    durationTick: number,
  }
}

export class ExtractNotesInput extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  getTrackIndex(): number;
  setTrackIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractNotesInput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractNotesInput): ExtractNotesInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractNotesInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractNotesInput;
  static deserializeBinaryFromReader(message: ExtractNotesInput, reader: jspb.BinaryReader): ExtractNotesInput;
}

export namespace ExtractNotesInput {
  export type AsObject = {
    data: Uint8Array | string,
    trackIndex: number,
  }
}

export class ExtractNotesResult extends jspb.Message {
  clearNotesList(): void;
  getNotesList(): Array<Note>;
  setNotesList(value: Array<Note>): void;
  addNotes(value?: Note, index?: number): Note;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractNotesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractNotesResult): ExtractNotesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractNotesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractNotesResult;
  static deserializeBinaryFromReader(message: ExtractNotesResult, reader: jspb.BinaryReader): ExtractNotesResult;
}

export namespace ExtractNotesResult {
  export type AsObject = {
    notesList: Array<Note.AsObject>,
    ok: boolean,
    error: string,
  }
}

export class TempoEvent extends jspb.Message {
  getTick(): number;
  setTick(value: number): void;

  getMicrosecondsPerBeat(): number;
  setMicrosecondsPerBeat(value: number): void;

  getBpm(): number;
  setBpm(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TempoEvent.AsObject;
  static toObject(includeInstance: boolean, msg: TempoEvent): TempoEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TempoEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TempoEvent;
  static deserializeBinaryFromReader(message: TempoEvent, reader: jspb.BinaryReader): TempoEvent;
}

export namespace TempoEvent {
  export type AsObject = {
    tick: number,
    microsecondsPerBeat: number,
    bpm: number,
  }
}

export class TempoMapResult extends jspb.Message {
  clearTempoEventsList(): void;
  getTempoEventsList(): Array<TempoEvent>;
  setTempoEventsList(value: Array<TempoEvent>): void;
  addTempoEvents(value?: TempoEvent, index?: number): TempoEvent;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TempoMapResult.AsObject;
  static toObject(includeInstance: boolean, msg: TempoMapResult): TempoMapResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TempoMapResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TempoMapResult;
  static deserializeBinaryFromReader(message: TempoMapResult, reader: jspb.BinaryReader): TempoMapResult;
}

export namespace TempoMapResult {
  export type AsObject = {
    tempoEventsList: Array<TempoEvent.AsObject>,
    ok: boolean,
    error: string,
  }
}

export class TimeSignatureEvent extends jspb.Message {
  getTick(): number;
  setTick(value: number): void;

  getNumerator(): number;
  setNumerator(value: number): void;

  getDenominator(): number;
  setDenominator(value: number): void;

  getMetronomeClicks(): number;
  setMetronomeClicks(value: number): void;

  getThirtysecondsPerQuarter(): number;
  setThirtysecondsPerQuarter(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeSignatureEvent.AsObject;
  static toObject(includeInstance: boolean, msg: TimeSignatureEvent): TimeSignatureEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeSignatureEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeSignatureEvent;
  static deserializeBinaryFromReader(message: TimeSignatureEvent, reader: jspb.BinaryReader): TimeSignatureEvent;
}

export namespace TimeSignatureEvent {
  export type AsObject = {
    tick: number,
    numerator: number,
    denominator: number,
    metronomeClicks: number,
    thirtysecondsPerQuarter: number,
  }
}

export class TimeSignaturesResult extends jspb.Message {
  clearEventsList(): void;
  getEventsList(): Array<TimeSignatureEvent>;
  setEventsList(value: Array<TimeSignatureEvent>): void;
  addEvents(value?: TimeSignatureEvent, index?: number): TimeSignatureEvent;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeSignaturesResult.AsObject;
  static toObject(includeInstance: boolean, msg: TimeSignaturesResult): TimeSignaturesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeSignaturesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeSignaturesResult;
  static deserializeBinaryFromReader(message: TimeSignaturesResult, reader: jspb.BinaryReader): TimeSignaturesResult;
}

export namespace TimeSignaturesResult {
  export type AsObject = {
    eventsList: Array<TimeSignatureEvent.AsObject>,
    ok: boolean,
    error: string,
  }
}

export class KeySignatureEvent extends jspb.Message {
  getTick(): number;
  setTick(value: number): void;

  getSharpsFlats(): number;
  setSharpsFlats(value: number): void;

  getIsMinor(): boolean;
  setIsMinor(value: boolean): void;

  getKeyName(): string;
  setKeyName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeySignatureEvent.AsObject;
  static toObject(includeInstance: boolean, msg: KeySignatureEvent): KeySignatureEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KeySignatureEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeySignatureEvent;
  static deserializeBinaryFromReader(message: KeySignatureEvent, reader: jspb.BinaryReader): KeySignatureEvent;
}

export namespace KeySignatureEvent {
  export type AsObject = {
    tick: number,
    sharpsFlats: number,
    isMinor: boolean,
    keyName: string,
  }
}

export class KeySignaturesResult extends jspb.Message {
  clearEventsList(): void;
  getEventsList(): Array<KeySignatureEvent>;
  setEventsList(value: Array<KeySignatureEvent>): void;
  addEvents(value?: KeySignatureEvent, index?: number): KeySignatureEvent;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeySignaturesResult.AsObject;
  static toObject(includeInstance: boolean, msg: KeySignaturesResult): KeySignaturesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KeySignaturesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeySignaturesResult;
  static deserializeBinaryFromReader(message: KeySignaturesResult, reader: jspb.BinaryReader): KeySignaturesResult;
}

export namespace KeySignaturesResult {
  export type AsObject = {
    eventsList: Array<KeySignatureEvent.AsObject>,
    ok: boolean,
    error: string,
  }
}

export class ProgramChangeEvent extends jspb.Message {
  getTick(): number;
  setTick(value: number): void;

  getChannel(): number;
  setChannel(value: number): void;

  getProgramNumber(): number;
  setProgramNumber(value: number): void;

  getInstrumentName(): string;
  setInstrumentName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProgramChangeEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ProgramChangeEvent): ProgramChangeEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProgramChangeEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProgramChangeEvent;
  static deserializeBinaryFromReader(message: ProgramChangeEvent, reader: jspb.BinaryReader): ProgramChangeEvent;
}

export namespace ProgramChangeEvent {
  export type AsObject = {
    tick: number,
    channel: number,
    programNumber: number,
    instrumentName: string,
  }
}

export class ProgramChangesResult extends jspb.Message {
  clearEventsList(): void;
  getEventsList(): Array<ProgramChangeEvent>;
  setEventsList(value: Array<ProgramChangeEvent>): void;
  addEvents(value?: ProgramChangeEvent, index?: number): ProgramChangeEvent;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProgramChangesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ProgramChangesResult): ProgramChangesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProgramChangesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProgramChangesResult;
  static deserializeBinaryFromReader(message: ProgramChangesResult, reader: jspb.BinaryReader): ProgramChangesResult;
}

export namespace ProgramChangesResult {
  export type AsObject = {
    eventsList: Array<ProgramChangeEvent.AsObject>,
    ok: boolean,
    error: string,
  }
}

export class ControlChangeEvent extends jspb.Message {
  getTick(): number;
  setTick(value: number): void;

  getChannel(): number;
  setChannel(value: number): void;

  getControllerNumber(): number;
  setControllerNumber(value: number): void;

  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ControlChangeEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ControlChangeEvent): ControlChangeEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ControlChangeEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ControlChangeEvent;
  static deserializeBinaryFromReader(message: ControlChangeEvent, reader: jspb.BinaryReader): ControlChangeEvent;
}

export namespace ControlChangeEvent {
  export type AsObject = {
    tick: number,
    channel: number,
    controllerNumber: number,
    value: number,
  }
}

export class ExtractControlChangesInput extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  getFilterByChannel(): boolean;
  setFilterByChannel(value: boolean): void;

  getChannel(): number;
  setChannel(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractControlChangesInput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractControlChangesInput): ExtractControlChangesInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractControlChangesInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractControlChangesInput;
  static deserializeBinaryFromReader(message: ExtractControlChangesInput, reader: jspb.BinaryReader): ExtractControlChangesInput;
}

export namespace ExtractControlChangesInput {
  export type AsObject = {
    data: Uint8Array | string,
    filterByChannel: boolean,
    channel: number,
  }
}

export class ControlChangesResult extends jspb.Message {
  clearEventsList(): void;
  getEventsList(): Array<ControlChangeEvent>;
  setEventsList(value: Array<ControlChangeEvent>): void;
  addEvents(value?: ControlChangeEvent, index?: number): ControlChangeEvent;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ControlChangesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ControlChangesResult): ControlChangesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ControlChangesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ControlChangesResult;
  static deserializeBinaryFromReader(message: ControlChangesResult, reader: jspb.BinaryReader): ControlChangesResult;
}

export namespace ControlChangesResult {
  export type AsObject = {
    eventsList: Array<ControlChangeEvent.AsObject>,
    ok: boolean,
    error: string,
  }
}

export class TextEvent extends jspb.Message {
  getTick(): number;
  setTick(value: number): void;

  getTrackIndex(): number;
  setTrackIndex(value: number): void;

  getType(): string;
  setType(value: string): void;

  getText(): string;
  setText(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TextEvent.AsObject;
  static toObject(includeInstance: boolean, msg: TextEvent): TextEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TextEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TextEvent;
  static deserializeBinaryFromReader(message: TextEvent, reader: jspb.BinaryReader): TextEvent;
}

export namespace TextEvent {
  export type AsObject = {
    tick: number,
    trackIndex: number,
    type: string,
    text: string,
  }
}

export class TextEventsResult extends jspb.Message {
  clearEventsList(): void;
  getEventsList(): Array<TextEvent>;
  setEventsList(value: Array<TextEvent>): void;
  addEvents(value?: TextEvent, index?: number): TextEvent;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TextEventsResult.AsObject;
  static toObject(includeInstance: boolean, msg: TextEventsResult): TextEventsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TextEventsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TextEventsResult;
  static deserializeBinaryFromReader(message: TextEventsResult, reader: jspb.BinaryReader): TextEventsResult;
}

export namespace TextEventsResult {
  export type AsObject = {
    eventsList: Array<TextEvent.AsObject>,
    ok: boolean,
    error: string,
  }
}

export class LyricEvent extends jspb.Message {
  getTick(): number;
  setTick(value: number): void;

  getTrackIndex(): number;
  setTrackIndex(value: number): void;

  getText(): string;
  setText(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LyricEvent.AsObject;
  static toObject(includeInstance: boolean, msg: LyricEvent): LyricEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LyricEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LyricEvent;
  static deserializeBinaryFromReader(message: LyricEvent, reader: jspb.BinaryReader): LyricEvent;
}

export namespace LyricEvent {
  export type AsObject = {
    tick: number,
    trackIndex: number,
    text: string,
  }
}

export class LyricsResult extends jspb.Message {
  clearLyricsList(): void;
  getLyricsList(): Array<LyricEvent>;
  setLyricsList(value: Array<LyricEvent>): void;
  addLyrics(value?: LyricEvent, index?: number): LyricEvent;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LyricsResult.AsObject;
  static toObject(includeInstance: boolean, msg: LyricsResult): LyricsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LyricsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LyricsResult;
  static deserializeBinaryFromReader(message: LyricsResult, reader: jspb.BinaryReader): LyricsResult;
}

export namespace LyricsResult {
  export type AsObject = {
    lyricsList: Array<LyricEvent.AsObject>,
    ok: boolean,
    error: string,
  }
}

export class DurationResult extends jspb.Message {
  getTotalTicks(): number;
  setTotalTicks(value: number): void;

  getTotalSeconds(): number;
  setTotalSeconds(value: number): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DurationResult.AsObject;
  static toObject(includeInstance: boolean, msg: DurationResult): DurationResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DurationResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DurationResult;
  static deserializeBinaryFromReader(message: DurationResult, reader: jspb.BinaryReader): DurationResult;
}

export namespace DurationResult {
  export type AsObject = {
    totalTicks: number,
    totalSeconds: number,
    ok: boolean,
    error: string,
  }
}

export class TrackNoteCount extends jspb.Message {
  getTrackIndex(): number;
  setTrackIndex(value: number): void;

  getNoteCount(): number;
  setNoteCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrackNoteCount.AsObject;
  static toObject(includeInstance: boolean, msg: TrackNoteCount): TrackNoteCount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrackNoteCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrackNoteCount;
  static deserializeBinaryFromReader(message: TrackNoteCount, reader: jspb.BinaryReader): TrackNoteCount;
}

export namespace TrackNoteCount {
  export type AsObject = {
    trackIndex: number,
    noteCount: number,
  }
}

export class ChannelNoteCount extends jspb.Message {
  getChannel(): number;
  setChannel(value: number): void;

  getNoteCount(): number;
  setNoteCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChannelNoteCount.AsObject;
  static toObject(includeInstance: boolean, msg: ChannelNoteCount): ChannelNoteCount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChannelNoteCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChannelNoteCount;
  static deserializeBinaryFromReader(message: ChannelNoteCount, reader: jspb.BinaryReader): ChannelNoteCount;
}

export namespace ChannelNoteCount {
  export type AsObject = {
    channel: number,
    noteCount: number,
  }
}

export class NoteCountSummary extends jspb.Message {
  clearByTrackList(): void;
  getByTrackList(): Array<TrackNoteCount>;
  setByTrackList(value: Array<TrackNoteCount>): void;
  addByTrack(value?: TrackNoteCount, index?: number): TrackNoteCount;

  clearByChannelList(): void;
  getByChannelList(): Array<ChannelNoteCount>;
  setByChannelList(value: Array<ChannelNoteCount>): void;
  addByChannel(value?: ChannelNoteCount, index?: number): ChannelNoteCount;

  getTotalNotes(): number;
  setTotalNotes(value: number): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NoteCountSummary.AsObject;
  static toObject(includeInstance: boolean, msg: NoteCountSummary): NoteCountSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NoteCountSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NoteCountSummary;
  static deserializeBinaryFromReader(message: NoteCountSummary, reader: jspb.BinaryReader): NoteCountSummary;
}

export namespace NoteCountSummary {
  export type AsObject = {
    byTrackList: Array<TrackNoteCount.AsObject>,
    byChannelList: Array<ChannelNoteCount.AsObject>,
    totalNotes: number,
    ok: boolean,
    error: string,
  }
}

export class ExtractChannelNotesInput extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  getChannel(): number;
  setChannel(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractChannelNotesInput.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractChannelNotesInput): ExtractChannelNotesInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractChannelNotesInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractChannelNotesInput;
  static deserializeBinaryFromReader(message: ExtractChannelNotesInput, reader: jspb.BinaryReader): ExtractChannelNotesInput;
}

export namespace ExtractChannelNotesInput {
  export type AsObject = {
    data: Uint8Array | string,
    channel: number,
  }
}

export class ExtractChannelNotesResult extends jspb.Message {
  clearNotesList(): void;
  getNotesList(): Array<Note>;
  setNotesList(value: Array<Note>): void;
  addNotes(value?: Note, index?: number): Note;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractChannelNotesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractChannelNotesResult): ExtractChannelNotesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractChannelNotesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractChannelNotesResult;
  static deserializeBinaryFromReader(message: ExtractChannelNotesResult, reader: jspb.BinaryReader): ExtractChannelNotesResult;
}

export namespace ExtractChannelNotesResult {
  export type AsObject = {
    notesList: Array<Note.AsObject>,
    ok: boolean,
    error: string,
  }
}

export class TicksToSecondsInput extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  clearTicksList(): void;
  getTicksList(): Array<number>;
  setTicksList(value: Array<number>): void;
  addTicks(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TicksToSecondsInput.AsObject;
  static toObject(includeInstance: boolean, msg: TicksToSecondsInput): TicksToSecondsInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TicksToSecondsInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TicksToSecondsInput;
  static deserializeBinaryFromReader(message: TicksToSecondsInput, reader: jspb.BinaryReader): TicksToSecondsInput;
}

export namespace TicksToSecondsInput {
  export type AsObject = {
    data: Uint8Array | string,
    ticksList: Array<number>,
  }
}

export class TicksToSecondsResult extends jspb.Message {
  clearSecondsList(): void;
  getSecondsList(): Array<number>;
  setSecondsList(value: Array<number>): void;
  addSeconds(value: number, index?: number): number;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TicksToSecondsResult.AsObject;
  static toObject(includeInstance: boolean, msg: TicksToSecondsResult): TicksToSecondsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TicksToSecondsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TicksToSecondsResult;
  static deserializeBinaryFromReader(message: TicksToSecondsResult, reader: jspb.BinaryReader): TicksToSecondsResult;
}

export namespace TicksToSecondsResult {
  export type AsObject = {
    secondsList: Array<number>,
    ok: boolean,
    error: string,
  }
}

export class UsedChannelsResult extends jspb.Message {
  clearChannelsList(): void;
  getChannelsList(): Array<number>;
  setChannelsList(value: Array<number>): void;
  addChannels(value: number, index?: number): number;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UsedChannelsResult.AsObject;
  static toObject(includeInstance: boolean, msg: UsedChannelsResult): UsedChannelsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UsedChannelsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UsedChannelsResult;
  static deserializeBinaryFromReader(message: UsedChannelsResult, reader: jspb.BinaryReader): UsedChannelsResult;
}

export namespace UsedChannelsResult {
  export type AsObject = {
    channelsList: Array<number>,
    ok: boolean,
    error: string,
  }
}

export class ValidationResult extends jspb.Message {
  getIsValid(): boolean;
  setIsValid(value: boolean): void;

  clearIssuesList(): void;
  getIssuesList(): Array<string>;
  setIssuesList(value: Array<string>): void;
  addIssues(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidationResult.AsObject;
  static toObject(includeInstance: boolean, msg: ValidationResult): ValidationResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidationResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidationResult;
  static deserializeBinaryFromReader(message: ValidationResult, reader: jspb.BinaryReader): ValidationResult;
}

export namespace ValidationResult {
  export type AsObject = {
    isValid: boolean,
    issuesList: Array<string>,
  }
}

