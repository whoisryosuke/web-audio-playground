import React from "react";
import useAudioStore from "../../../store/audio";
import { Slider } from "@whoisryosuke/oat-milk-design";
import type { ADSRConfig } from "../../../types/audio";
import { ADSR_POINTS } from "./constants";

type Props = {};

const ADSRInput = (props: Props) => {
  const { adsr, setADSR } = useAudioStore();

  const handleChange = (configKey: keyof ADSRConfig) => (value: number) => {
    console.log(configKey, value);
    setADSR({
      [configKey]: value,
    } as Partial<ADSRConfig>);
  };

  return (
    <div>
      {ADSR_POINTS.map((adsrKey) => (
        <Slider
          key={adsrKey}
          label={adsrKey.charAt(0).toLocaleUpperCase() + adsrKey.slice(1)}
          value={adsr[adsrKey]}
          minValue={0}
          maxValue={1}
          step={0.01}
          onChange={handleChange(adsrKey)}
        />
      ))}
    </div>
  );
};

export default ADSRInput;
