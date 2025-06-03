import React, { useEffect, useRef, useState } from "react";
import useAudioStore from "../../store/audio";
import { Input, Slider } from "@whoisryosuke/oat-milk-design";
import WhiteNoiseProcessorWorklet from "../../workers/white-noise-processor.ts?url";
console.log("url to module", WhiteNoiseProcessorWorklet);

type Props = {};

const AudioWorkletExample = (props: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState(0);
  const nodeRef = useRef<AudioWorkletNode | null>(null);
  const { audioCtx, addAudioNode, removeAudioNode } = useAudioStore();

  const createNode = async () => {
    // Fetch the WASM module
    const response = await fetch("/wasm/rust_wasm_audio_bg.wasm");
    const wasmData = await response.arrayBuffer();

    // Create the worklet
    console.log("creating worklet...");
    try {
      await audioCtx.audioWorklet.addModule(WhiteNoiseProcessorWorklet);
      nodeRef.current = new AudioWorkletNode(audioCtx, "white-noise-processor");

      // Send the WASM payload to Audio processor
      nodeRef.current.port.postMessage({ type: "init-wasm", data: wasmData });

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
      {value}
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
