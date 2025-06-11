import styled from "@emotion/styled";
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
