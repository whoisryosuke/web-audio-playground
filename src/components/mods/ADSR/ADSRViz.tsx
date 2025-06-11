import React, { useCallback, useEffect, useRef } from "react";
import useAudioStore from "../../../store/audio";
import styled from "@emotion/styled";
import type { ADSRConfig } from "../../../types/audio";
import mapRange from "../../../utils/mapRange";
import { baseColors } from "@whoisryosuke/oat-milk-design";
import { ADSR_POINTS } from "./constants";

const Container = styled.div`
  position: relative;
  width: 400px;
  height: 300px;
`;

type Props = {
  duration: number;
};

const ADSRViz = ({ duration }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { adsr } = useAudioStore();

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
    ctx.strokeStyle = baseColors["blue-5"];

    // Start at 0 - that's how our envelope starts
    ctx.moveTo(0, canvasHeight);
    let baseX = 0;
    ADSR_POINTS.forEach((point, pointIndex) => {
      const data = adsr[point];
      // Maps X-axis to time.
      // ADSR is usually represented in time segments,
      // which requires us to increment and offset with a baseX
      const x = mapRange(data, 0, duration, 0, canvasWidth) + baseX;
      // Or you can draw all points equally on X axis
      // const x = (canvasWidth / POINTS_TO_DRAW.length) * (pointIndex + 1);

      // Maps Y-axis to an "amplitude".
      // The input sliders for each ADSR go from 0-1, so we map to that vs the height of canvas.
      const amplitude = mapRange(data, 0, 1, 0, canvasHeight);
      const y = amplitude;
      ctx.lineTo(x, y);
      ctx.moveTo(x, y);

      baseX += x;
    });
    // Ends at 0 too
    ctx.lineTo(canvasWidth, canvasHeight);

    ctx.stroke();
    // this.animationFrameRef = requestAnimationFrame(this.draw.bind(this));
  }, [adsr]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <Container>
      <canvas ref={canvasRef} width={400} height={300} />
    </Container>
  );
};

export default ADSRViz;
