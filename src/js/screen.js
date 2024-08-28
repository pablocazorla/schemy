import Konva from "konva";
import { STAGE_NAME } from "./constants";
import { StatusMode, showFloatTools } from "@/js/store";
import { STATUS_MODES } from "@/js/constants";

class Screen {
  constructor(containerStageId) {
    this.stage = new Konva.Stage({
      container: containerStageId,
      width: window.innerWidth,
      height: window.innerHeight,
      name: STAGE_NAME,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // add the layer to the stage
    this.stage.add(this.layer);

    // draw the image
    this.layer.draw();
  }
  addFromDrawing(drawing) {
    // TO DO
    StatusMode.set(STATUS_MODES.ONSTAGE);
    console.log(drawing);
  }
}

export default Screen;
