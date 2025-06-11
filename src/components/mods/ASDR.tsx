import React, { useCallback, useEffect, useRef } from "react";
import useAudioStore from "../../store/audio";
import { Slider } from "@whoisryosuke/oat-milk-design";
import styled from "@emotion/styled";
import type { ASDRConfig } from "../../types/audio";
import mapRange from "../../utils/mapRange";

const Container = styled.div`
  position: relative;
  width: 400px;
  height: 300px;
`;

type Props = {
  duration: number;
};

const POINTS_TO_DRAW = [
  "attack",
  "sustain",
  "release",
  "decay",
] as unknown as (keyof ASDRConfig)[];

const ASDR = ({ duration }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { asdr, setAsdr } = useAudioStore();

  const draw = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Clear drawing
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "blue";

    // Start at 0 - that's how our envelope starts
    ctx.moveTo(0, canvasHeight);
    POINTS_TO_DRAW.forEach((point, pointIndex) => {
      const data = asdr[point];
      const amplitude = mapRange(data, 0, duration, 0, 100);
      const x = (canvasWidth / POINTS_TO_DRAW.length) * (pointIndex + 1);
      const y = amplitude;
      ctx.lineTo(x, y);
      ctx.moveTo(x, y);
    });
    // Ends at 0 too
    ctx.lineTo(canvasWidth, canvasHeight);

    ctx.stroke();
    // this.animationFrameRef = requestAnimationFrame(this.draw.bind(this));
  }, [asdr]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div>
      <h3>ASDR</h3>
      <Container>
        <canvas ref={canvasRef} width={400} height={300} />
      </Container>
    </div>
  );
};

export default ASDR;
