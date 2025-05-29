import { Button, Stack } from "@whoisryosuke/oat-milk-design";
import React, { useEffect, useRef, useState } from "react";
import AudioTime from "./AudioTime";
import Waveform from "../Waveform/Waveform";
import useAudioStore from "../../store/audio";
import Gain from "../mods/Gain";
import Biquad from "../mods/Biquad";

type Props = {
  file: string;
};

const AudioPlayer = ({ file, ...props }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bufferLength, setBufferLength] = useState(0);
  const audioElement = useRef<HTMLAudioElement>(null);
  const audioCtx = useRef<AudioContext>(null);
  const { setAudioCtx, audioNodes } = useAudioStore();

  const handleDone = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!audioElement.current) return;
    if (!audioCtx.current) {
      audioCtx.current = new window.AudioContext();
      setAudioCtx(audioCtx.current);
    }
    const audioSource = audioCtx.current.createMediaElementSource(
      audioElement.current
    );
    // Loop through any dynamic audio nodes and attach them
    let prevNode: AudioNode = audioSource;
    audioNodes.forEach((node, index) => {
      prevNode.connect(node);
      prevNode = node;
    });
    prevNode.connect(audioCtx.current.destination);

    // Add any event listeners to audio (like when it's done)
    audioElement.current.addEventListener("ended", handleDone);

    console.log("audio created", audioElement.current, audioCtx.current);

    // return () => {
    //   audioElement.current?.remove();
    //   audioCtx.current?.close();
    // };
  }, [audioNodes]);

  const handlePlay = () => {
    if (!audioElement.current) return;

    // Check if context is in suspended state (autoplay policy)
    if (audioCtx.current?.state === "suspended") {
      audioCtx.current.resume();
    }

    if (!isPlaying) {
      console.log("playing");
      // Play audio
      audioElement.current.play();
      setIsPlaying(true);
    } else {
      console.log("pausing");
      // Play audio
      audioElement.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <audio ref={audioElement} preload="auto" src={file} />
      <Stack vertical gap="0.25rem">
        <Gain />
        <Biquad />
        <Waveform />
        <AudioTime audio={audioElement} />
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

export default AudioPlayer;
