import ML5Detector from "./ml5-detector";
import { StrokeColor, StrokeWidth } from "@/store/element-props";
import { colorArrayToString } from "@/utils/colorArrayString";
import {
  STROKE_RECEPTOR_RADIUS,
  STROKE_RECEPTOR_COLOR,
  DEFAULT_BOUNDARIES,
  MINICANVAS_SIZE,
  MIN_DRAWING_RECEPTOR_SIZE,
} from "./contants";

class DrawingReceptor {
  constructor(screen, canvasDrawReceipt, canvasDrawing, canvasIA) {
    this.screen = screen;
    //
    this.canvasDrawReceipt = canvasDrawReceipt;
    this.canvasDrawing = canvasDrawing;
    this.canvasIA = canvasIA;
    //
    this.onResize();
    //
    this.ml5detector = new ML5Detector(this);
    //
    this.isToUp = false;
    this.isToRight = false;
    this.setupDrawingReception();
  }
  onResize() {
    const resize = () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      //
      this.canvasDrawReceipt.width = this.width;
      this.canvasDrawReceipt.height = this.height;
      this.canvasDrawing.width = this.width;
      this.canvasDrawing.height = this.height;
    };
    window.addEventListener("resize", resize);
    resize();
  }
  setupDrawingReception() {
    this.ctxDrawReceipt = this.canvasDrawReceipt.getContext("2d", {
      willReadFrequently: true,
    });
    this.ctxDrawReceipt.strokeStyle = STROKE_RECEPTOR_COLOR;
    this.ctxDrawReceipt.lineWidth = 2 * STROKE_RECEPTOR_RADIUS;
    this.ctxDrawReceipt.lineCap = "round";
    //
    this.ctxDrawing = this.canvasDrawing.getContext("2d", {
      willReadFrequently: true,
    });
    StrokeColor.subscribe((value) => {
      this.ctxDrawing.strokeStyle = colorArrayToString(value);
    });
    StrokeWidth.subscribe((value) => {
      this.ctxDrawing.lineWidth = Math.max(value, 2);
    });
    this.ctxDrawing.lineCap = "round";
    //
    this.ctxIA = this.canvasIA.getContext("2d", {
      willReadFrequently: true,
    });
    this.ctxIA.fillStyle = "#FFF";
    //
    let drawing = false;
    this.boundaries = { ...DEFAULT_BOUNDARIES };
    //

    let xInit = 0;
    let yInit = 0;

    this.canvasDrawReceipt.addEventListener("mousedown", (e) => {
      drawing = true;
      this.boundaries = { ...DEFAULT_BOUNDARIES };
      xInit = e.pageX;
      yInit = e.pageY;
      this.draw(e, "init");
    });
    window.addEventListener("mousemove", (e) => {
      if (drawing) {
        this.draw(e, "drawing");
      }
    });
    window.addEventListener("mouseup", (e) => {
      if (drawing) {
        drawing = false;
        this.isToUp = e.pageY - yInit < 0;
        this.isToLeft = e.pageX - xInit < 0;
        console.log(this.isToRight);
        this.draw(null, "end");
        this.putToCanvasIA();
      }
    });
  }
  clear() {
    this.ctxDrawReceipt.clearRect(0, 0, this.width, this.height);
    this.ctxDrawing.clearRect(0, 0, this.width, this.height);
  }
  draw(e, status) {
    if (status === "end") {
      this.ctxDrawReceipt.closePath(); //
      this.ctxDrawing.closePath();
      return;
    }

    const { pageX: x, pageY: y } = e;

    this.boundaries.xMin = Math.min(
      this.boundaries.xMin,
      x - STROKE_RECEPTOR_RADIUS
    );
    this.boundaries.yMin = Math.min(
      this.boundaries.yMin,
      y - STROKE_RECEPTOR_RADIUS
    );
    this.boundaries.xMax = Math.max(
      this.boundaries.xMax,
      x + STROKE_RECEPTOR_RADIUS
    );
    this.boundaries.yMax = Math.max(
      this.boundaries.yMax,
      y + STROKE_RECEPTOR_RADIUS
    );

    if (status === "init") {
      this.ctxDrawReceipt.beginPath();
      this.ctxDrawReceipt.moveTo(x, y);
      //
      this.ctxDrawing.beginPath();
      this.ctxDrawing.moveTo(x, y);
    }
    if (status === "drawing") {
      this.ctxDrawReceipt.lineTo(x, y);
      this.ctxDrawReceipt.stroke();
      //
      this.ctxDrawing.lineTo(x, y);
      this.ctxDrawing.stroke();
    }
  }
  putToCanvasIA() {
    const width = this.boundaries.xMax - this.boundaries.xMin;
    const height = this.boundaries.yMax - this.boundaries.yMin;

    if (
      width < MIN_DRAWING_RECEPTOR_SIZE ||
      height < MIN_DRAWING_RECEPTOR_SIZE
    ) {
      this.clear();
      return;
    }

    const img = new Image();
    img.src = this.canvasDrawReceipt.toDataURL("image/png");

    img.onload = () => {
      this.ctxIA.fillRect(0, 0, MINICANVAS_SIZE, MINICANVAS_SIZE);

      this.ctxIA.drawImage(
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
    const imgData = this.ctxIA.getImageData(
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
  evaluateResult(value) {
    const { lab: type } = value;
    const { xMin: x, yMin: y, xMax, yMax } = this.boundaries;

    if (type === "none") {
      return;
    }
    this.screen.addFromDrawReceptor({
      type,
      x,
      y,
      width: xMax - x,
      height: yMax - y,
      isToUp: this.isToUp,
      isToLeft: this.isToLeft,
    });
  }
}

export default DrawingReceptor;
