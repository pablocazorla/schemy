import Screen from "./screen";
import DrawingDetector from "./drawing-detector";
/* import KeyInput from "./keyInput";
import { StatusMode } from "./store"; */

const Main = () => {
  const screen = new Screen("screen-content-konva");

  new DrawingDetector("screen-drawing-canvas", "screen-code-canvas", screen);

  //const inputHandler = new KeyInput();
  /* inputHandler.onKeyDown(" ", () => {
   
  }); */
  /* inputHandler.onKeyUp(" ", () => {

  }); */
};

export default Main;
