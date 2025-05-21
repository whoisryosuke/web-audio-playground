import { LineGraph } from "@whoisryosuke/oat-milk-design";
import React, { useEffect, useRef, useState, type RefObject } from "react";
import mapRange from "../../utils/mapRange";

const DEFAULT_AUDIO_HEIGHT = 128;

type Props = {
  analyser: RefObject<AnalyserNode | null>;
  bufferLength: number;
};

const Waveform = ({ analyser, bufferLength, ...props }: Props) => {
  const [time, setTime] = useState(0);
  const dataArray = useRef<Uint8Array>(new Uint8Array(bufferLength));
  const animationRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(
    null
  );

  useEffect(() => {
    dataArray.current = new Uint8Array(bufferLength);
  }, [bufferLength]);

  // Animate waveform
  const animate = (delta: number) => {
    if (!analyser.current || !dataArray.current) return;

    // Update waveform data as a ref
    analyser.current.getByteTimeDomainData(dataArray.current);
    // Force React update
    setTime(delta);

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const graph: number[] = [];
  dataArray.current.forEach((data) =>
    graph.push(
      mapRange(data, DEFAULT_AUDIO_HEIGHT - 20, DEFAULT_AUDIO_HEIGHT + 20, 0, 1)
    )
  );

  return <LineGraph data={graph} color={"blue"} />;
};

export default Waveform;
