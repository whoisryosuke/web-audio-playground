import React, { useEffect, useRef, useState } from "react";
import useAudioStore from "../../store/audio";
import { Input, Slider } from "@whoisryosuke/oat-milk-design";
import PitchDetectorWorklet from "../../workers/pitch-detector.ts?url";
import wasm from "rust-wasm-audio/rust_wasm_audio_bg.wasm?url";
import type {
  AudioWorkletEventMessage,
  PitchDetectorOptions,
} from "../../workers/types";

type Props = {};

const AudioWorkletExample = (props: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState(0);
  const [pitch, setPitch] = useState(0);
  const nodeRef = useRef<AudioWorkletNode | null>(null);
  const { audioCtx, addAudioNode, removeAudioNode } = useAudioStore();

  const handleNodeMessage = (e: any) => {
    const event = e.data as AudioWorkletEventMessage<number>;
    // WASM was loaded - so lets initialize our Rust-based pitch detection module
    if (event.type === "wasm-loaded") {
      console.log("wasm loaded");
      if (!nodeRef.current) return;
      // Common number for sampling (like FFT)
      const samplesPerAnalysis = 1024;

      // The config for our pitch detection
      const data: PitchDetectorOptions = {
        sampleRate: audioCtx.sampleRate,
        fftSize: samplesPerAnalysis,
      };

      console.log("init pitch");
      // Send the WASM payload to Audio processor
      nodeRef.current.port.postMessage({
        type: "init-detector",
        data,
      });
    }
    if (event.type === "send-pitch") {
      console.log("Got pitch", event.data);
      setPitch(event.data);
    }
  };

  const createNode = async () => {
    // Fetch the WASM module
    const response = await fetch(wasm);
    const wasmData = await response.arrayBuffer();

    // Create the worklet
    console.log("creating worklet...");
    try {
      await audioCtx.audioWorklet.addModule(PitchDetectorWorklet);
      nodeRef.current = new AudioWorkletNode(audioCtx, "pitch-detector");

      // Send the WASM payload to Audio processor
      nodeRef.current.port.postMessage({ type: "init-wasm", data: wasmData });
      // Get messages from the worklet/processor
      nodeRef.current.port.onmessage = handleNodeMessage;

      console.log("created worklet node", nodeRef.current);
      addAudioNode(nodeRef.current);
      setLoaded(true);

      nodeRef.current.addEventListener("processorerror", (e) =>
        console.error("Audio Worklet processing error", e)
      );
    } catch (e) {
      console.log("failed to create worklet", e);
    }
  };

  useEffect(() => {
    if (!audioCtx || loaded) return;
    createNode();

    return () => {
      if (nodeRef.current) removeAudioNode(nodeRef.current);
    };
  }, [audioCtx]);

  const handleChange = (sliderValue: number) => {
    console.log(sliderValue);
    setValue(sliderValue);

    const newGain = sliderValue;

    if (nodeRef.current) nodeRef.current.gain.value = newGain;
  };

  return (
    <div>
      <p>Pitch: {pitch}</p>
      <p>Setting: {value}</p>
      <Slider
        label="Worklet"
        value={value}
        minValue={-3}
        maxValue={2}
        step={0.01}
        onChange={handleChange}
      />
    </div>
  );
};

export default AudioWorkletExample;
