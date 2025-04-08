import { MODEL_INFO } from "./contants";

class ML5Detector {
  constructor(drawReceptor) {
    this.drawReceptor = drawReceptor;
    this.ready = false;

    let timer = setInterval(() => {
      if (window.ml5) {
        this.init();
        clearInterval(timer);
      }
    }, 100);
  }
  init() {
    window.ml5.setBackend("webgl");

    this.classifier = window.ml5.neuralNetwork({
      task: "classification",
    });
    this.classifier.load(MODEL_INFO, () => {
      this.ready = true;
    });
  }
  evaluateInput(inputs) {
    if (!this.ready) {
      return;
    }
    this.classifier.classify(inputs, (results) => {
      if (!results) {
        return;
      }
      const value = results.reduce(
        (obj, v) => {
          const { confidence, label } = v;
          const conf = 0.01 * Math.round(confidence * 10000);
          if (conf > obj.val) {
            obj.val = conf;
            obj.lab = conf < 50 ? "none" : label;
          }
          return obj;
        },
        { val: 0, lab: "" }
      );

      this.drawReceptor.evaluateResult(value);
    });
  }
}

export default ML5Detector;
