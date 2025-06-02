import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AudioNodes = AudioNode | AudioWorkletNode;

export interface AudioState {
  audioCtx: AudioContext;
  setAudioCtx: (audioCtx: AudioContext) => void;

  audioNodes: AudioNodes[];
  addAudioNode: (audioNode: AudioNodes) => void;
  removeAudioNode: (audioNode: AudioNodes) => void;
}

export const useAudioStore = create<AudioState>()(
  devtools((set) => ({
    audioCtx: null,
    setAudioCtx: (audioCtx) =>
      set((state) => ({
        ...state,
        audioCtx,
      })),

    audioNodes: [],
    addAudioNode: (audioNode) =>
      set((state) => ({
        ...state,
        audioNodes: [...state.audioNodes, audioNode],
      })),
    removeAudioNode: (audioNode) =>
      set((state) => ({
        ...state,
        audioNodes: state.audioNodes.filter((node) => node == audioNode),
      })),
  }))
);

export default useAudioStore;
