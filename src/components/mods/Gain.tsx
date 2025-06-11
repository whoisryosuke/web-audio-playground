import React, { useEffect, useRef, useState } from "react";
import useAudioStore from "../../store/audio";
import { Input, Slider } from "@whoisryosuke/oat-milk-design";
import type { ASDRConfig } from "../../types/audio";

type Props = {};

const Gain = (props: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState(0);
  const [asdr, setAsdr] = useState<ASDRConfig>({
    attack: 0.1,
    decay: 0.2,
    sustain: 0.7,
    release: 0.3,
    peak: 1.0,
  });
  const gainRef = useRef<GainNode | null>(null);
  const { audioCtx, addAudioNode, removeAudioNode } = useAudioStore();

  useEffect(() => {
    if (!audioCtx || loaded) return;
    console.log("creating gain");
    gainRef.current = audioCtx.createGain();
    addAudioNode("gain", gainRef.current);
    setLoaded(true);

    return () => {
      if (gainRef.current) removeAudioNode("gain");
    };
  }, [audioCtx]);

  const handleChange = (sliderValue: number) => {
    console.log(sliderValue);
    setValue(sliderValue);

    const newGain = sliderValue;

    if (gainRef.current) gainRef.current.gain.value = newGain;
  };

  return (
    <div>
      {value}
      <Slider
        label="Volume"
        value={value}
        minValue={-3}
        maxValue={2}
        step={0.01}
        onChange={handleChange}
      />
    </div>
  );
};

export default Gain;
