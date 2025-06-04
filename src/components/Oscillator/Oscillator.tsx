import { Button, Stack } from "@whoisryosuke/oat-milk-design";
import React, { useEffect, useRef, useState } from "react";
import Waveform from "../Waveform/Waveform";
import useAudioStore from "../../store/audio";
import Gain from "../mods/Gain";
import Biquad from "../mods/Biquad";
import AudioWorkletExample from "../mods/AudioWorkletExample";

type Props = {};

const Oscillator = ({ ...props }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bufferLength, setBufferLength] = useState(0);
  const bassOscRef = useRef<OscillatorNode>(null);
  const hiOscRef = useRef<OscillatorNode>(null);
  const audioCtx = useRef<AudioContext>(null);
  const { setAudioCtx, audioNodes } = useAudioStore();

  const handleDone = () => {
    setIsPlaying(false);
  };

  const connect = () => {
    [bassOscRef, hiOscRef].forEach((ref) => {
      if (!ref.current || !audioCtx.current) return;
      let prevNode: OscillatorNode | AudioNode = ref.current;
      audioNodes.forEach((node, index) => {
        prevNode.connect(node);
        prevNode = node;
      });
      prevNode.connect(audioCtx.current.destination);
    });
  };

  const disconnect = () => {
    [bassOscRef, hiOscRef].forEach((ref) => {
      if (!ref.current) return;
      ref.current.disconnect();
    });
  };

  useEffect(() => {
    if (!audioCtx.current) {
      audioCtx.current = new window.AudioContext();
      setAudioCtx(audioCtx.current);
    }
    // Create first sound
    bassOscRef.current = audioCtx.current.createOscillator();
    bassOscRef.current.type = "sine";
    bassOscRef.current.frequency.value = 220;
    bassOscRef.current.frequency.linearRampToValueAtTime(
      880,
      audioCtx.current.currentTime + 100
    );
    bassOscRef.current.start();

    // Create second sound
    hiOscRef.current = audioCtx.current.createOscillator();
    hiOscRef.current.type = "square";
    hiOscRef.current.frequency.value = 660;
    hiOscRef.current.frequency.linearRampToValueAtTime(
      880,
      audioCtx.current.currentTime + 200
    );
    hiOscRef.current.start();
    // Loop through any dynamic audio nodes and attach them

    console.log("oscillators created", audioCtx.current);

    // return () => {
    //   audioElement.current?.remove();
    //   audioCtx.current?.close();
    // };
  }, [audioNodes]);

  const handlePlay = () => {
    if (!hiOscRef.current || !bassOscRef.current) return;
    // Check if context is in suspended state (autoplay policy)
    if (audioCtx.current?.state === "suspended") {
      audioCtx.current.resume();
    }

    if (!isPlaying) {
      console.log("playing");
      // Play audio
      // hiOscRef.current.start();
      // bassOscRef.current.start();
      connect();
      setIsPlaying(true);
    } else {
      console.log("pausing");
      // Stop audio
      // hiOscRef.current.stop();
      // bassOscRef.current.stop();
      disconnect();
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <Stack vertical gap="0.25rem">
        <Gain />
        <Biquad />
        <AudioWorkletExample />

        <Waveform />
        <Button
          px={5}
          py={2}
          borderRadius={1}
          onClick={handlePlay}
          display="flex"
          justifyContent="center"
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </Stack>
    </div>
  );
};

export default Oscillator;
