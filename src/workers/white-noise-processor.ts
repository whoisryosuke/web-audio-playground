import init, { greet } from "rust-wasm-audio";

class WhiteNoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.port.onmessage = (event) => this.onmessage(event.data);
  }

  onmessage = (event: { type: string; data: ArrayBuffer }) => {
    if (event.type === "init-wasm") {
      init(WebAssembly.compile(event.data)).then(() => {
        this.port.postMessage({ type: "wasm-loaded" });
      });
    }
  };

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters) {
    const output = outputs[0];
    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        const randomNoise = greet(i);
        // const randomNoise = Math.random() * 2 - 1;
        channel[i] = randomNoise * 10;
        console.log("white noise", randomNoise);
      }
    });
    return true;
  }
}

registerProcessor("white-noise-processor", WhiteNoiseProcessor);
