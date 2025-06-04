export type AudioWorkletEventMessage<T> = {
  type: string;
  data: T;
};

export interface PitchDetectEventInit
  extends AudioWorkletEventMessage<ArrayBuffer> {
  type: "init-wasm";
  data: ArrayBuffer;
}

export interface PitchDetectEventInitDetector
  extends AudioWorkletEventMessage<PitchDetectorOptions> {
  type: "init-detector";
  data: PitchDetectorOptions;
}

export type PitchDetectorOptions = {
  sampleRate: number;
  fftSize: number;
};

export type AudioWorkletClientEvent<T> = {
  data: T;
};
