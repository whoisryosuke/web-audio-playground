import React, { useEffect, useRef, useState } from "react";
import useAudioStore from "../../store/audio";
import { Input, Slider } from "@whoisryosuke/oat-milk-design";
import type { ADSRConfig } from "../../types/audio";
import EchoNode from "../../audio/nodes/EchoNode";

type Props = {};

const Echo = (props: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState(0);
  const [delay, setDelay] = useState(0.15);
  const [outputGain, setOutputGain] = useState(1);
  const gainRef = useRef<EchoNode | null>(null);
  const { audioCtx, addAudioNode, removeAudioNode } = useAudioStore();

  useEffect(() => {
    if (!audioCtx || loaded) return;
    console.log("creating echo");
    gainRef.current = new EchoNode(audioCtx);
    addAudioNode("echo", gainRef.current);
    setLoaded(true);

    return () => {
      if (gainRef.current) removeAudioNode("echo");
    };
  }, [audioCtx]);

  const handleChange = (sliderValue: number) => {
    console.log(sliderValue);
    setValue(sliderValue);

    const newGain = sliderValue;

    if (gainRef.current) gainRef.current.wet.gain.value = newGain;
  };

  const handleDelay = (sliderValue: number) => {
    console.log(sliderValue);
    setDelay(sliderValue);

    const newGain = sliderValue;

    if (gainRef.current) gainRef.current.delay.delayTime.value = newGain;
  };

  const handleOutputGain = (sliderValue: number) => {
    console.log(sliderValue);
    setOutputGain(sliderValue);

    if (gainRef.current) gainRef.current.output.gain.value = sliderValue;
  };

  return (
    <div>
      <h2>Echo</h2>
      <Slider
        label="Wet"
        value={value}
        minValue={-3}
        maxValue={2}
        step={0.01}
        onChange={handleChange}
      />
      <Slider
        label="Delay"
        value={delay}
        minValue={0}
        maxValue={1}
        step={0.01}
        onChange={handleDelay}
      />
      <Slider
        label="Output Gain"
        value={outputGain}
        minValue={-3}
        maxValue={2}
        step={0.01}
        onChange={handleOutputGain}
      />
    </div>
  );
};

export default Echo;
