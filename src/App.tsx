import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  Button,
  ButtonGroup,
  Checkbox,
  InputLabel,
  InputWithLabel,
  LineGraph,
  Slider,
  Stack,
  ThemeProvider,
} from "@whoisryosuke/oat-milk-design";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import Oscillator from "./components/Oscillator/Oscillator";

const MOCK_DATA = new Array(1024 / 4).fill(0).map(() => Math.random());
function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider>
      {/* <AudioPlayer file="music/ff8-magic.mp3" /> */}
      <Oscillator />
    </ThemeProvider>
  );
}

export default App;
