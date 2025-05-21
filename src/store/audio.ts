import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface AudioState {
  audioCtx: AudioContext;
  setAudioCtx: (audioCtx: AudioContext) => void;

  audioNodes: AudioNode[];
  addAudioNode: (audioNode: AudioNode) => void;
  removeAudioNode: (audioNode: AudioNode) => void;
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
