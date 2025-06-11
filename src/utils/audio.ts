import type { ASDRConfig } from "../types/audio";

/**
 * Applies a ASDR envelope to the audio stream at the provided time. This basically makes audio fade in.
 * @param gainParam The gain parameter from the gain node (usually `gainNode.gain`)
 * @param time Time to start envelope
 * @param config
 */
export function scheduleASDR(
  gainParam: AudioParam,
  time: number,
  config: ASDRConfig
) {
  const { attack, sustain, decay, release, peak } = config;

  // Cancel all previous parameters
  gainParam.cancelScheduledValues(time);

  // Start ramp up from 0
  gainParam.setValueAtTime(0, time);

  // Attack - Ramps up to the peak
  gainParam.linearRampToValueAtTime(peak, time + attack);

  // Sustain - Ramps to sustain
  gainParam.linearRampToValueAtTime(sustain * peak, time + attack + decay);
}

/**
 * Releases ASDR envelope at provided time. Basically fades audio out.
 * @param gainParam The gain parameter from the gain node (usually `gainNode.gain`)
 * @param time
 * @param duration
 */
export function releaseASDR(
  gainParam: AudioParam,
  time: number,
  duration: 0.3
) {
  gainParam.cancelScheduledValues(time);
  gainParam.setValueAtTime(gainParam.value, time);
  gainParam.linearRampToValueAtTime(0, time + duration);
}
