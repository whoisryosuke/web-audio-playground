import React, { useCallback, useEffect, useRef } from "react";
import useAudioStore from "../../../store/audio";
import styled from "@emotion/styled";
import type { ADSRConfig } from "../../../types/audio";
import mapRange from "../../../utils/mapRange";
import { baseColors } from "@whoisryosuke/oat-milk-design";
import ADSRViz from "./ADSRViz";
import ADSRInput from "./ADSRInput";

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
] as unknown as (keyof ADSRConfig)[];

const ADSR = ({ duration }: Props) => {
  return (
    <div>
      <h3>ADSR</h3>
      <ADSRViz duration={duration} />
      <ADSRInput />
    </div>
  );
};

export default ADSR;
