export type ASDRConfig = {
  attack: number;
  sustain: number;
  decay: number;
  release: number;
  // Scales the highest point of the wave amplitude. Default is 1.0, less means lower wave.
  peak: number;
};

export type AudioNodeTypes = "gain" | "waveshaper" | "biquad" | "worklet";
