import Konva from "konva";
import {
  STATUS_MODES,
  STAGE_NAME,
  SELECTION_RECTANGLE_ATTRIBUTES,
  TRANSFORMER_ATTRIBUTES,
  ELEMENT_SELECTABLE_BY_GROUP_NAME,
  ELEMENT_SELECTABLE_BY_CLICK_NAME,
  SNAP_SIZE,
} from "./constants";
import {
  StatusMode,
  StageDragging,
  showEditTools,
  //
  prop_fillColor,
  prop_strokeColor,
  prop_textColor,
  prop_fontSize,
  prop_fontFamily,
  prop_textAlign,
  //
} from "@/js/store";
import ContainerElement from "@/js/elements/container";
import KeyInput from "./keyInput";
import { snapGrid, arrayColorToString, stringToArrayColor } from "./utils";

class Screen {
  constructor(containerStageId) {
    this.status = "ENABLED";
    this.clipboardForElements = [];
    this.elementsSelection = [];

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
    /* const circle = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 5,
      fill: "yellow",
    });
    this.layer.add(circle); */
    //
    this.layer.draw();
    //
    this.onResize();
    //
    this.setupElementsSelector();
    //
    this.setupInputs();
    //
    this.setupMove();
    //
    this.setupEditElementsSelection();
  }
  onResize() {
    window.addEventListener("resize", () => {
      this.stage.width(window.innerWidth);
      this.stage.height(window.innerHeight);
    });
  }
  setupInputs() {
    const inputHandler = new KeyInput();

    //Dragging STAGE
    inputHandler.onKeyDown(" ", () => {
      if (StatusMode.get() === STATUS_MODES.ONSTAGE) {
        StageDragging.set(true);
      }
    });
    inputHandler.onKeyUp(" ", () => {
      StageDragging.set(false);
    });
    StageDragging.subscribe((value) => {
      this.stage.draggable(value);
      if (value) {
        this.stage.container().style.cursor = "grab";
      } else {
        this.stage.container().style.cursor = "default";
      }
    });
    // Elements selection clearing
    StatusMode.subscribe((mode) => {
      if (mode !== STATUS_MODES.ONSTAGE) {
        this.addToTransformer([]);
      }
    });

    // Move elements
    inputHandler.onKeyDown("ArrowUp", () => {
      if (StatusMode.get() !== STATUS_MODES.ONSTAGE) {
        return;
      }
      if (this.elementsSelection.length === 0) {
        return;
      }
      this.elementsSelection.forEach((elem) => {
        elem.y(elem.y() - SNAP_SIZE);
      });
    });
    inputHandler.onKeyDown("ArrowDown", () => {
      if (StatusMode.get() !== STATUS_MODES.ONSTAGE) {
        return;
      }

      if (this.elementsSelection.length === 0) {
        return;
      }
      this.elementsSelection.forEach((elem) => {
        elem.y(elem.y() + SNAP_SIZE);
      });
    });
    inputHandler.onKeyDown("ArrowLeft", () => {
      if (StatusMode.get() !== STATUS_MODES.ONSTAGE) {
        return;
      }

      if (this.elementsSelection.length === 0) {
        return;
      }
      this.elementsSelection.forEach((elem) => {
        elem.x(elem.x() - SNAP_SIZE);
      });
    });
    inputHandler.onKeyDown("ArrowRight", () => {
      if (StatusMode.get() !== STATUS_MODES.ONSTAGE) {
        return;
      }

      if (this.elementsSelection.length === 0) {
        return;
      }
      this.elementsSelection.forEach((elem) => {
        elem.x(elem.x() + SNAP_SIZE);
      });
    });
    // DELETE elements
    inputHandler.onKeyDown("Delete", () => {
      if (StatusMode.get() !== STATUS_MODES.ONSTAGE) {
        return;
      }
      if (this.elementsSelection.length === 0) {
        return;
      }
      this.elementsSelection.forEach((elem) => {
        elem.destroy();
      });
      this.addToTransformer([]);
    });
    // COPY elements
    // TODO: USAR CONTAINER ELEMENT
    /*
    inputHandler.onKeyCtrlPress("c", () => {
      if (StatusMode.get() !== STATUS_MODES.ONSTAGE) {
        return;
      }
      if (this.elementsSelection.length === 0) {
        return;
      }
      this.clipboardForElements = [];
      this.elementsSelection.forEach((elem) => {
        this.clipboardForElements.push(elem.clone());
      });
    });
    // PASTE elements
    inputHandler.onKeyCtrlPress("v", () => {
      if (StatusMode.get() !== STATUS_MODES.ONSTAGE) {
        return;
      }
      if (this.clipboardForElements.length === 0) {
        return;
      }
      const newElements = [];
      this.clipboardForElements.forEach((elem) => {
        const newElem = elem.clone();
        newElem.x(newElem.x() + SNAP_SIZE);
        newElem.y(newElem.y() + SNAP_SIZE);
        this.layer.add(newElem);
        newElements.push(newElem);
      });
      this.addToTransformer(newElements);
    });
    */
  }

  addToTransformer(selectedElements) {
    this.transformer.nodes(selectedElements);
    this.elementsSelection = selectedElements;
    this.transformer.moveToTop();
    if (selectedElements.length > 0) {
      if (selectedElements.length === 1) {
        this.refillPropsByElementSelection();
      }
      showEditTools.set(true);
    }
  }
  setupEditElementsSelection() {
    prop_fillColor.subscribe((value) => {
      this.elementsSelection.forEach((elem) => {
        const [container] = elem.getChildren();
        container.fill(arrayColorToString(value));
      });
    });
    prop_strokeColor.subscribe((value) => {
      this.elementsSelection.forEach((elem) => {
        const [container] = elem.getChildren();
        container.stroke(arrayColorToString(value));
      });
    });
    prop_textColor.subscribe((value) => {
      this.elementsSelection.forEach((elem) => {
        const [, text] = elem.getChildren();
        text.fill(arrayColorToString(value));
      });
    });
    prop_fontSize.subscribe((value) => {
      this.elementsSelection.forEach((elem) => {
        const [, text] = elem.getChildren();
        text.fontSize(value);
      });
    });
    prop_fontFamily.subscribe((value) => {
      this.elementsSelection.forEach((elem) => {
        const [, text] = elem.getChildren();
        text.fontFamily(value);
      });
    });
    prop_textAlign.subscribe((value) => {
      this.elementsSelection.forEach((elem) => {
        const [, text] = elem.getChildren();
        text.align(value);
      });
    });
  }
  refillPropsByElementSelection() {
    const [elem] = this.elementsSelection;
    const [container, text] = elem.getChildren();
    //
    prop_fillColor.set(stringToArrayColor(container.fill()));
    prop_strokeColor.set(stringToArrayColor(container.stroke()));
    prop_textColor.set(stringToArrayColor(text.fill()));
    prop_fontSize.set(text.fontSize());
    prop_fontFamily.set(text.fontFamily());
    prop_textAlign.set(text.align());
  }
  setupElementsSelector() {
    // SELECTORS HELPERS
    const selectionRectangle = new Konva.Rect({
      fill: "rgba(100,200,255,0.3)",
      stroke: "rgba(140,220,255,1)",
      strokeWidth: 1,
      visible: false,
      listening: false,
    });
    this.layer.add(selectionRectangle);

    this.transformer = new Konva.Transformer(TRANSFORMER_ATTRIBUTES);
    this.layer.add(this.transformer);

    // VARIABLES
    let x1,
      y1,
      x2,
      y2,
      dx,
      dy,
      startSelecting = false,
      isSelecting = false;

    // EVENTS
    this.stage.on("mousedown touchstart", (e) => {
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      // do nothing if we mousedown on any shape
      if (
        e.target !== this.stage ||
        this.status !== "ENABLED" ||
        !metaPressed
      ) {
        return;
      }

      e.evt.preventDefault();

      // set variables to initial position
      const { x, y } = this.stage.getPointerPosition();
      dx = this.stage.x();
      dy = this.stage.y();
      x1 = x - dx;
      y1 = y - dy;
      x2 = x - dx;
      y2 = y - dy;

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
      x2 = x - dx;
      y2 = y - dy;

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
      if (this.status !== "ENABLED") {
        isSelecting = false;
        return;
      }

      e.evt.preventDefault();

      // set variables to last position
      isSelecting = false;

      // set attributes to selectionRectangle
      selectionRectangle.visible(false);

      // get selected elements
      const allElements = this.stage.find(
        `.${ELEMENT_SELECTABLE_BY_GROUP_NAME}`
      );
      var selectionRectangleBox = selectionRectangle.getClientRect();
      var selectedElements = allElements.filter((obj) =>
        Konva.Util.haveIntersection(selectionRectangleBox, obj.getClientRect())
      );

      // add selected elements
      this.addToTransformer(selectedElements);
    });

    // When click, should select/deselect element
    this.stage.on("click tap", (e) => {
      // if we are startSelecting with rect, do nothing

      if (isSelecting || this.status !== "ENABLED") {
        return;
      }

      // if click on empty area - remove all selections

      if (e.target.hasName(STAGE_NAME)) {
        this.addToTransformer([]);
        return;
      }

      // do nothing if clicked in a NOT selectable element
      if (!e.target.hasName(ELEMENT_SELECTABLE_BY_CLICK_NAME)) {
        return;
      }

      const nodeToAdd = e.target.getParent();

      // do we pressed shift or ctrl?
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = this.transformer.nodes().indexOf(nodeToAdd) >= 0;

      let listToAdd = [];

      if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected
        // select just one
        listToAdd = [nodeToAdd];
      } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected
        // we need to remove it from selection:
        const newNodes = this.transformer.nodes().slice(); // use slice to have new copy of array
        // remove node from array
        newNodes.splice(newNodes.indexOf(nodeToAdd), 1);
        listToAdd = newNodes;
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        listToAdd = this.transformer.nodes().concat([nodeToAdd]);
      }

      this.addToTransformer(listToAdd);
    });
  }
  setupMove() {
    this.stage.on("dragmove", () => {
      const newX = snapGrid(this.stage.x());
      const newY = snapGrid(this.stage.y());
      this.stage.setAttrs({
        x: newX,
        y: newY,
      });
    });
  }
  addFromDrawing(drawing) {
    // TO DO
    StatusMode.set(STATUS_MODES.ONSTAGE);

    const { type, x, y, width, height } = drawing;

    new ContainerElement({
      screen: this,
      type,
      x: x - this.stage.x(),
      y: y - this.stage.y(),
      width,
      height,
    });
  }
}

export default Screen;
