import Konva from "konva";
import {
  STATUS_MODES,
  STAGE_NAME,
  SELECTION_RECTANGLE_ATTRIBUTES,
  TRANSFORMER_ATTRIBUTES,
  OBJECT_SELECTABLE_BY_GROUP_NAME,
  OBJECT_SELECTABLE_BY_CLICK_NAME,
} from "./constants";
import { StatusMode, StageDraggable } from "@/js/store";
import ContainerObject from "@/js/objects/container";

class Screen {
  constructor(containerStageId) {
    this.status = "SELECTABLE";

    this.stage = new Konva.Stage({
      container: containerStageId,
      width: window.innerWidth,
      height: window.innerHeight,
      // x: 0.5 * window.innerWidth,
      // y: 0.5 * window.innerHeight,
      name: STAGE_NAME,
      //  draggable: true,
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    //
    const circle = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 5,
      fill: "yellow",
    });
    this.layer.add(circle);
    this.layer.draw();
    //
    this.onResize();
    //
    // OBJECTS
    this.objects = [];
    //
    this.setupObjectsSelector();
    //
    StageDraggable.subscribe((value) => {
      this.stage.draggable(value);
    });
  }
  onResize() {
    window.addEventListener("resize", () => {
      this.stage.width(window.innerWidth);
      this.stage.height(window.innerHeight);
    });
  }
  setupObjectsSelector() {
    // SELECTORS HELPERS
    const selectionRectangle = new Konva.Rect({
      fill: "rgba(100,200,255,0.3)",
      stroke: "rgba(140,220,255,1)",
      strokeWidth: 1,
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
      selectionRectangle.moveToTop();
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
      transformer.moveToTop();
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

      const nodeToAdd = e.target.getParent();

      // do we pressed shift or ctrl?
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = transformer.nodes().indexOf(nodeToAdd) >= 0;

      let listToAdd = [];

      if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected
        // select just one
        listToAdd = [nodeToAdd];
      } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected
        // we need to remove it from selection:
        const newNodes = transformer.nodes().slice(); // use slice to have new copy of array
        // remove node from array
        newNodes.splice(newNodes.indexOf(nodeToAdd), 1);
        listToAdd = newNodes;
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        listToAdd = transformer.nodes().concat([nodeToAdd]);
      }

      transformer.nodes(listToAdd);
      transformer.setAttrs(TRANSFORMER_ATTRIBUTES);
      transformer.moveToTop();
    });
  }
  addFromDrawing(drawing) {
    // TO DO
    StatusMode.set(STATUS_MODES.ONSTAGE);

    const { type, x, y, width, height } = drawing;

    new ContainerObject({
      screen: this,
      type,
      x: x - this.stage.x(),
      y: y - this.stage.y(),
      width,
      height,
      /* type: "circle",
      x: 100,
      y: 100,
      width: 100,
      height: 100, */
    });
  }
}

export default Screen;
