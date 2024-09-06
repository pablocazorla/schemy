import Konva from "konva";
import {
  SELECTION_RECTANGLE_ATTRIBUTES,
  TRANSFORMER_ATTRIBUTES,
  STAGE_NAME,
  OBJECT_SELECTABLE_BY_GROUP_NAME,
  OBJECT_SELECTABLE_BY_CLICK_NAME,
} from "@/js/constants";

class Screen {
  constructor(containerStageId) {
    this.status = "SELECTABLE";
    this.setupStage(containerStageId);
  }
  setupStage(containerStageId) {
    this.container = document.getElementById(containerStageId);
    this.stage = new Konva.Stage({
      container: this.container,
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

    this.setupObjectsSelector();
  }
  setupObjectsSelector() {
    // SELECTORS HELPERS
    const selectionRectangle = new Konva.Rect({
      fill: "rgba(0,0,255,0.3)",
      visible: false,
      listening: false,
    });
    this.layer.add(selectionRectangle);

    const transformer = new Konva.Transformer();
    this.layer.add(transformer);

    // VARIABLES
    let x1,
      y1,
      x2,
      y2,
      startSelecting = false,
      isSelecting = false;

    // EVENTS
    this.stage.on("mousedown touchstart", (e) => {
      // do nothing if we mousedown on any shape
      if (e.target !== this.stage || this.status !== "SELECTABLE") {
        return;
      }

      e.evt.preventDefault();

      // set variables to initial position
      const { x, y } = this.stage.getPointerPosition();
      x1 = x;
      y1 = y;
      x2 = x;
      y2 = y;

      // set attributes to selectionRectangle
      selectionRectangle.width(0);
      selectionRectangle.height(0);
      startSelecting = true;
    });
    this.stage.on("mousemove touchmove", (e) => {
      // do nothing if we didn't start selection
      if (!startSelecting) {
        return;
      }
      e.evt.preventDefault();

      // set variables to current position
      const { x, y } = this.stage.getPointerPosition();
      x2 = x;
      y2 = y;

      // set attributes to selectionRectangle
      selectionRectangle.setAttrs({
        ...SELECTION_RECTANGLE_ATTRIBUTES,
        visible: true,
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
      });

      isSelecting = true;
    });

    this.stage.on("mouseup touchend", (e) => {
      startSelecting = false;

      // do nothing if we didn't start selection
      if (!isSelecting) {
        return;
      }
      if (this.status !== "SELECTABLE") {
        isSelecting = false;
        return;
      }

      e.evt.preventDefault();

      // set variables to last position
      isSelecting = false;

      // set attributes to selectionRectangle
      selectionRectangle.visible(false);

      // get selected objects
      const allObjects = this.stage.find(`.${OBJECT_SELECTABLE_BY_GROUP_NAME}`);
      var selectionRectangleBox = selectionRectangle.getClientRect();
      var selectedObjects = allObjects.filter((obj) =>
        Konva.Util.haveIntersection(selectionRectangleBox, obj.getClientRect())
      );

      // add selected objects to transformer
      transformer.nodes(selectedObjects);

      // set attributes to transformer
      transformer.setAttrs(TRANSFORMER_ATTRIBUTES);
    });

    // When click, should select/deselect object
    this.stage.on("click tap", (e) => {
      // if we are startSelecting with rect, do nothing

      if (isSelecting || this.status !== "SELECTABLE") {
        return;
      }

      // if click on empty area - remove all selections

      if (e.target.hasName(STAGE_NAME)) {
        transformer.nodes([]);
        return;
      }

      // do nothing if clicked in a NOT selectable object
      if (!e.target.hasName(OBJECT_SELECTABLE_BY_CLICK_NAME)) {
        return;
      }
      transformer.nodes([e.target]);
      transformer.setAttrs(TRANSFORMER_ATTRIBUTES);
    });
  }
}

export default Screen;
