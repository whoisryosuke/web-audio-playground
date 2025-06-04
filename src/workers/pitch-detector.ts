import init, { PitchDetectorModule } from "rust-wasm-audio";
import type {
  AudioWorkletEventMessage,
  PitchDetectEventInit,
  PitchDetectEventInitDetector,
  PitchDetectorOptions,
} from "./types";

class PitchDetector extends AudioWorkletProcessor {
  detector: PitchDetectorModule | null = null;
  samples: Float32Array = new Float32Array([]);
  numSamplesPerAnalysis: number = 1024; // our fftSize input from earlier

  constructor() {
    super();

    this.port.onmessage = (event) => this.onmessage(event.data);
  }

  onmessage = (event: PitchDetectEventInit | PitchDetectEventInitDetector) => {
    console.log("event in module", event, event.type, event.data);
    // Handle loading WASM module
    if (event.type === "init-wasm") {
      init(WebAssembly.compile(event.data)).then(() => {
        this.port.postMessage({ type: "wasm-loaded" });
      });
    }
    if (event.type === "init-detector") {
      const { sampleRate, fftSize } = event.data;
      this.numSamplesPerAnalysis = fftSize;
      this.samples = new Float32Array(fftSize);
      this.detector = PitchDetectorModule.new(sampleRate, fftSize);
    }
  };

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters) {
    // We only grab from the first channel for testing
    // This is equivalent to "mono" sound (1 channel)
    const currentChannel = inputs[0];
    if (!currentChannel) return true;
    const inputSamples = currentChannel[0];
    if (!inputSamples) return true;

    // Fill buffer as needed
    if (this.samples.length < this.numSamplesPerAnalysis) {
      // console.log("collecting samples");
      // Add the input samples to our internal sample state
      this.samples = new Float32Array([...this.samples, ...inputSamples]);
    } else {
      // console.log("buffer full, shifting");
      // Buffer is full, so we shift it to accommodate new samples
      // @TODO: This doesn't actually check length of input samples, it's usually 128 - but might be different?
      const numNewSamples = inputSamples.length;
      const numRemainingSamples = this.samples.length - numNewSamples;
      const remainingSamples = this.samples.slice(0, numRemainingSamples);
      this.samples = new Float32Array([...remainingSamples, ...inputSamples]);
    }

    // console.log("sample size", this.samples.length, this.numSamplesPerAnalysis);
    console.log(
      "any sound",
      this.samples.filter((sample) => sample > 0)
    );

    if (this.samples.length >= this.numSamplesPerAnalysis && this.detector) {
      const pitch = this.detector.get_pitch(this.samples);
      console.log("got pitch", pitch, this.samples);
      if (pitch > 0) {
        this.port.postMessage({
          type: "send-pitch",
          data: pitch,
        });
      }
    }

    return true;
  }
}

registerProcessor("pitch-detector", PitchDetector);
