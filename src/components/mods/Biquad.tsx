import React, { useEffect, useRef, useState } from "react";
import useAudioStore from "../../store/audio";
import { Input, Slider } from "@whoisryosuke/oat-milk-design";

type Props = {};

const Biquad = (props: Props) => {
  const [value, setValue] = useState(0);
  const biquadRef = useRef<BiquadFilterNode | null>(null);
  const { audioCtx, addAudioNode, removeAudioNode } = useAudioStore();

  useEffect(() => {
    if (!audioCtx) return;
    console.log("creating gain");
    biquadRef.current = audioCtx.createBiquadFilter();
    addAudioNode(biquadRef.current);

    biquadRef.current.type = "lowshelf";
    biquadRef.current.frequency.setTargetAtTime(1000, audioCtx.currentTime, 0);
    biquadRef.current.gain.setTargetAtTime(25, audioCtx.currentTime, 0);

    return () => {
      if (biquadRef.current) removeAudioNode(biquadRef.current);
    };
  }, [audioCtx]);

  const handleChange = (sliderValue: number) => {
    console.log(sliderValue);
    setValue(sliderValue);

    const newGain = sliderValue;

    if (biquadRef.current) biquadRef.current.gain.value = newGain;
  };

  return (
    <div>
      <Slider
        label="Biquad"
        value={value}
        minValue={-3}
        maxValue={2}
        step={0.01}
        onChange={handleChange}
      />
    </div>
  );
};

export default Biquad;
