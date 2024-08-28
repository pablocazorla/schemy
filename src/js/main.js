import Screen from "./screen";
import DrawingDetector from "./drawing-detector";

const Main = () => {
  const screen = new Screen("screen-content-konva");

  new DrawingDetector("screen-drawing-canvas", "screen-code-canvas", screen);
};

export default Main;
