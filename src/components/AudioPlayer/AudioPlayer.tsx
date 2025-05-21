import { Button } from "@whoisryosuke/oat-milk-design";
import React, { useEffect, useRef, useState } from "react";
import AudioTime from "./AudioTime";
import Waveform from "./Waveform";

type Props = {
  file: string;
};

const AudioPlayer = ({ file, ...props }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bufferLength, setBufferLength] = useState(0);
  const audioElement = useRef<HTMLAudioElement>(null);
  const audioCtx = useRef<AudioContext>(null);
  const analyser = useRef<AnalyserNode>(null);

  const handleDone = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!audioElement.current) return;
    audioCtx.current = new window.AudioContext();
    const audioSource = audioCtx.current.createMediaElementSource(
      audioElement.current
    );
    analyser.current = audioCtx.current.createAnalyser();

    // Configure analyser
    analyser.current.fftSize = 1024;
    const newBufferLength = analyser.current.frequencyBinCount;
    setBufferLength(newBufferLength);

    audioSource.connect(analyser.current);
    analyser.current.connect(audioCtx.current.destination);

    // Add any event listeners to audio (like when it's done)
    audioElement.current.addEventListener("ended", handleDone);

    console.log("audio created", audioElement.current, audioCtx.current);

    return () => {
      audioElement.current?.remove();
      audioCtx.current?.close();
    };
  }, [file]);

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
      <div>
        <Waveform analyser={analyser} bufferLength={bufferLength} />
        <AudioTime audio={audioElement} />
        <Button onClick={handlePlay}>{isPlaying ? "Pause" : "Play"}</Button>
      </div>
    </div>
  );
};

export default AudioPlayer;
