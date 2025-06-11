import type { ADSRConfig } from "../../../types/audio";

export const ADSR_POINTS = [
  "attack",
  "decay",
  "sustain",
  "release",
] as unknown as (keyof ADSRConfig)[];
