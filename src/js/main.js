import Screen from "./screen";
import DrawingDetector from "./drawing-detector";

import GlobalKeyInput from "./globalKeyInput";

const Main = () => {
  const screen = new Screen("screen-content-konva");

  new DrawingDetector("screen-drawing-canvas", "screen-code-canvas", screen);

  new GlobalKeyInput();
};

export default Main;
