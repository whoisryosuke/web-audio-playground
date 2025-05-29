import React, { useEffect, useRef, useState } from "react";
import useAudioStore from "../../store/audio";
import { Input, Slider } from "@whoisryosuke/oat-milk-design";

type Props = {};

function makeDistortionCurve(amount: number, angle: number) {
  const k = typeof amount === "number" ? amount : 50;
  // Sample rate (aka bit rate) of audio
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / angle;

  for (let i = 0; i < n_samples; i++) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

const WaveShaper = (props: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [amount, setAmount] = useState(100); // 0-max slider
  const [angle, setAngle] = useState(180); // 0-360
  const waveShaperRef = useRef<WaveShaperNode | null>(null);
  const { audioCtx, addAudioNode, removeAudioNode } = useAudioStore();

  useEffect(() => {
    if (!audioCtx || loaded) return;
    console.log("creating gain");
    waveShaperRef.current = audioCtx.createWaveShaper();
    waveShaperRef.current.curve = makeDistortionCurve(100, 180);
    waveShaperRef.current.oversample = "4x";

    addAudioNode(waveShaperRef.current);
    setLoaded(true);

    return () => {
      if (waveShaperRef.current) removeAudioNode(waveShaperRef.current);
    };
  }, [audioCtx]);

  const updateCurve = () => {
    if (waveShaperRef.current) {
      waveShaperRef.current.curve = makeDistortionCurve(amount, angle);
    }
  };

  const handleAmountChange = (sliderValue: number) => {
    console.log(sliderValue);
    setAmount(sliderValue);

    updateCurve();
  };

  const handleAngleChange = (sliderValue: number) => {
    console.log(sliderValue);
    setAngle(sliderValue);

    updateCurve();
  };

  return (
    <div>
      <h3>Wave Shaper (Distortion)</h3>
      {amount}
      <Slider
        label="Amount"
        value={amount}
        minValue={0}
        maxValue={200}
        step={10}
        onChange={handleAmountChange}
      />
      {angle}
      <Slider
        label="Angle"
        value={angle}
        minValue={0}
        maxValue={360}
        step={10}
        onChange={handleAngleChange}
      />
    </div>
  );
};

export default WaveShaper;
