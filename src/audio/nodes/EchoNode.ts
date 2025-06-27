export default class EchoNode {
  // We need a node that sits at the front of the chain and receives input data
  // and sends it directly to output - and to the "echo" node chain
  //   input: GainNode;
  // The final output node for this effect
  output: GainNode;
  // The "echo" effect
  delay: DelayNode;
  // Amplifies "echo" effect
  feedback: GainNode;
  // Controls how much "echo" we hear on top of original audio
  wet: GainNode;

  constructor(ctx: AudioContext) {
    // this.input = ctx.createGain();
    this.output = ctx.createGain();
    this.delay = ctx.createDelay();
    this.feedback = ctx.createGain();
    this.wet = ctx.createGain();

    // Default config for nodes
    this.delay.delayTime.value = 0.15;
    this.feedback.gain.value = 0.25;
    this.wet.gain.value = 0.25;
  }

  setup = (input: AudioNode) => {
    // We connect input to 2 places:
    // the output (so we hear it unaltered), and the "echo" chain

    // Connect input to "echo" chain
    input.connect(this.delay);
    // Connect input directly to the output (unaltered)
    input.connect(this.output);

    // Setup "echo" chain from the input we received
    this.delay.connect(this.feedback);
    this.delay.connect(this.wet);
    // Loop feedback back into delay
    this.feedback.connect(this.delay);
    this.wet.connect(this.output);
  };

  connect = (node: AudioNode) => {
    this.output.connect(node);
  };
}
