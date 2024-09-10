import { SNAP_SIZE } from "./constants";

const MINICANVAS_SIZE = 20;
const RADIUS_DRAW = 6;
const DEFAULT_BOUNDARIES = {
  xMin: 999999,
  yMin: 999999,
  xMax: -999999,
  yMax: -999999,
};
const modelInfo = {
  model: "/draw-ai-model/model.json",
  metadata: "/draw-ai-model/model_meta.json",
  weights: "/draw-ai-model/model.weights.bin",
};

class ML5Detector {
  constructor(drawingDetector) {
    this.drawingDetector = drawingDetector;
    this.ready = false;

    window.ml5.setBackend("webgl");

    // Step 3: initialize your neural network
    this.classifier = window.ml5.neuralNetwork({
      task: "classification",
      // debug: true,
    });
    this.classifier.load(modelInfo, () => {
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

      this.drawingDetector.onResultEvaluation(value);
    });
  }
}

class DrawingDetector {
  constructor(canvasDrawingId, canvasCodeId, screen) {
    this.canvasDrawing = document.getElementById(canvasDrawingId);
    this.canvasCode = document.getElementById(canvasCodeId);
    this.screen = screen;
    this.ml5detector = new ML5Detector(this);
    //
    this.onResize();
    //
    this.setupDrawing();
    //
    this.clear();
  }
  onResize() {
    const resize = () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvasDrawing.width = this.width;
      this.canvasDrawing.height = this.height;
    };
    window.addEventListener("resize", resize);
    resize();
  }
  setupDrawing() {
    this.ctxDrawing = this.canvasDrawing.getContext("2d", {
      willReadFrequently: true,
    });
    this.ctxCode = this.canvasCode.getContext("2d", {
      willReadFrequently: true,
    });
    //
    this.ctxDrawing.strokeStyle = "#0F0";
    this.ctxDrawing.lineWidth = RADIUS_DRAW * 2;
    this.ctxDrawing.lineCap = "round";
    this.ctxCode.fillStyle = "#FFF";
    //
    let drawing = false;
    this.boundaries = { ...DEFAULT_BOUNDARIES };
    //
    this.canvasDrawing.addEventListener("mousedown", (e) => {
      drawing = true;
      this.boundaries = { ...DEFAULT_BOUNDARIES };
      this.draw(e, "init");
    });
    window.addEventListener("mousemove", (e) => {
      if (drawing) {
        this.draw(e, "drawing");
      }
    });
    window.addEventListener("mouseup", () => {
      if (drawing) {
        drawing = false;
        this.draw(null, "end");
        this.putToCanvasCode();
      }
    });
  }
  draw(e, status) {
    if (status === "end") {
      this.ctxDrawing.closePath();
      return;
    }

    const { pageX: x, pageY: y } = e;

    this.boundaries.xMin = Math.min(this.boundaries.xMin, x - RADIUS_DRAW);
    this.boundaries.yMin = Math.min(this.boundaries.yMin, y - RADIUS_DRAW);
    this.boundaries.xMax = Math.max(this.boundaries.xMax, x + RADIUS_DRAW);
    this.boundaries.yMax = Math.max(this.boundaries.yMax, y + RADIUS_DRAW);

    if (status === "init") {
      this.ctxDrawing.beginPath();
      this.ctxDrawing.moveTo(x, y);
    }
    if (status === "drawing") {
      this.ctxDrawing.lineTo(x, y);
      this.ctxDrawing.stroke();
    }
  }
  clear() {
    this.ctxDrawing.clearRect(0, 0, this.width, this.height);
  }
  putToCanvasCode() {
    const width = this.boundaries.xMax - this.boundaries.xMin;
    const height = this.boundaries.yMax - this.boundaries.yMin;

    if (width < 2 * SNAP_SIZE || height < 2 * SNAP_SIZE) {
      this.clear();
      return;
    }

    const imgSrc = this.canvasDrawing.toDataURL("image/png");

    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      this.ctxCode.fillRect(0, 0, MINICANVAS_SIZE, MINICANVAS_SIZE);

      this.ctxCode.drawImage(
        img,
        this.boundaries.xMin,
        this.boundaries.yMin,
        width,
        height,
        0,
        0,
        MINICANVAS_SIZE,
        MINICANVAS_SIZE
      );
      this.detectShape();
    };
  }
  detectShape() {
    const imgData = this.ctxCode.getImageData(
      0,
      0,
      MINICANVAS_SIZE,
      MINICANVAS_SIZE
    );
    const arr = Array.from(imgData.data);
    const inputs = [];
    for (let i = 0; i < arr.length; i += 4) {
      const v = arr[i] > 127 ? 0 : 1;
      inputs.push(v);
    }
    this.clear();
    this.ml5detector.evaluateInput(inputs);
  }
  onResultEvaluation(value) {
    const { lab: type } = value;
    const { xMin: x, yMin: y, xMax, yMax } = this.boundaries;

    if (type === "none") {
      return;
    }
    this.screen.addFromDrawing({
      type,
      x,
      y,
      width: xMax - x,
      height: yMax - y,
    });
  }
}
export default DrawingDetector;
