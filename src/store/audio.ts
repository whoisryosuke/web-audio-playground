import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ASDRConfig } from "../types/audio";

type AudioNodes = AudioNode | AudioWorkletNode;

export interface AudioState {
  audioCtx: AudioContext;
  setAudioCtx: (audioCtx: AudioContext) => void;

  audioNodes: Map<string, AudioNodes>;
  addAudioNode: (key: string, audioNode: AudioNodes) => void;
  removeAudioNode: (key: string) => void;

  // Audio configuration

  // ASDR
  asdr: ASDRConfig;
  setASDR: (asdr: Partial<ASDRConfig>) => void;
}

export const useAudioStore = create<AudioState>()(
  devtools((set) => ({
    audioCtx: null,
    setAudioCtx: (audioCtx) =>
      set((state) => ({
        ...state,
        audioCtx,
      })),

    audioNodes: new Map([]),
    addAudioNode: (key, audioNode) =>
      set((state) => ({
        ...state,
        audioNodes: state.audioNodes.set(key, audioNode),
      })),
    removeAudioNode: (key) =>
      set((state) => {
        state.audioNodes.delete(key);
        return {
          ...state,
          audioNodes: state.audioNodes,
        };
      }),

    // Config

    // ASDR
    asdr: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.7,
      release: 0.3,
      peak: 1.0,
    },
    setASDR: (asdr) =>
      set((state) => ({
        ...state,
        asdr: {
          ...state.asdr,
          ...asdr,
        },
      })),
  }))
);

export default useAudioStore;
