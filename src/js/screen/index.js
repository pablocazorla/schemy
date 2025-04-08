import Konva from "konva";
import {
  FillColor,
  StrokeColor,
  StrokeWidth,
  TextColor,
  FontSize,
  FontFamily,
  TextAlign,
  Italic,
  Bold,
} from "@/store/element-props";
import { ShowEditor, StageDragging, StatusMode } from "@/store/app";
import {
  colorStringToArray,
  colorArrayToString,
} from "@/utils/colorArrayString";
import {
  getFontFamilyKey,
  getFontFamilyValueFromKey,
} from "@/utils/getFontFamilyKey";
import {
  STAGE_NAME,
  ELEMENT_SELECTABLE_BY_CLICK_NAME,
  ELEMENT_SELECTABLE_BY_RECTANGLE_NAME,
  ELEMENT_ARROW,
} from "@/constants/names";
import {
  SNAP_SIZE,
  STATUS_MODES,
  SELECTION_RECTANGLE_ATTRIBUTES,
  SELECTION_TRANSFORMER_ATTRIBUTES,
} from "@/constants/app";
import {
  ARROW_MIN_WIDTH,
  ARROW_POINT_MIN_WIDTH,
} from "@/constants/element-props";
import Box from "@/js/elements/box";
import Arrow from "@/js/elements/arrow";
import InputHandler from "@/js/inputHandler";
import { snapGrid } from "@/utils/snapGrid";

class Screen {
  constructor(container) {
    this.stage = new Konva.Stage({
      container,
      width: window.innerWidth,
      height: window.innerHeight,
      name: STAGE_NAME,
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.layer.draw();

    // SETUP
    this.boxPool = {};
    this.arrowPool = {};
    this.clipboardElements = [];
    this.setupResize();
    this.setupMove();
    this.setupNodeSelector();
    this.setupSelectedNodePropsUpdate();
    this.setupInputs();
    //

    // new Arrow(this, {
    //   x: 400,
    //   y: 100,
    // });

    // new Arrow(this, {
    //   x: 400,
    //   y: 300,
    // });
  }
  setupResize() {
    window.addEventListener("resize", () => {
      this.stage.width(window.innerWidth);
      this.stage.height(window.innerHeight);
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
  setupNodeSelector() {
    // Create nodes selected list
    this.nodesSelected = [];

    // Create selectors helpers
    const selectionRectangle = new Konva.Rect({
      ...SELECTION_RECTANGLE_ATTRIBUTES,
      strokeWidth: 1,
      visible: false,
      listening: false,
    });
    this.transformer = new Konva.Transformer(SELECTION_TRANSFORMER_ATTRIBUTES);
    this.layer.add(selectionRectangle);
    this.layer.add(this.transformer);

    // Variables
    let x1,
      y1,
      x2,
      y2,
      dx,
      dy,
      startSelecting = false,
      isSelectingByRectangle = false;

    // Events
    // Select by rectangle
    this.stage.on("mousedown touchstart", (e) => {
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      // do nothing if we mousedown on any shape
      if (e.target !== this.stage || !metaPressed) {
        return;
      }

      e.evt.preventDefault();

      // Initial position
      const { x, y } = this.stage.getPointerPosition();
      dx = this.stage.x();
      dy = this.stage.y();
      x1 = x - dx;
      y1 = y - dy;
      x2 = x - dx;
      y2 = y - dy;

      selectionRectangle.width(0);
      selectionRectangle.height(0);
      startSelecting = true;
      selectionRectangle.moveToTop();
    });
    this.stage.on("mousemove touchmove", (e) => {
      if (!startSelecting) {
        return;
      }
      e.evt.preventDefault();

      // Current position
      const { x, y } = this.stage.getPointerPosition();
      x2 = x - dx;
      y2 = y - dy;

      selectionRectangle.setAttrs({
        visible: true,
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
      });

      isSelectingByRectangle = true;
    });
    this.stage.on("mouseup touchend", (e) => {
      startSelecting = false;

      if (!isSelectingByRectangle) {
        return;
      }

      e.evt.preventDefault();

      // end variables
      isSelectingByRectangle = false;
      selectionRectangle.visible(false);

      // get selected elements
      const allElements = this.stage.find(
        `.${ELEMENT_SELECTABLE_BY_RECTANGLE_NAME}`
      );
      const selectionRectangleRect = selectionRectangle.getClientRect();
      const selectedNodes = allElements.filter((obj) =>
        Konva.Util.haveIntersection(selectionRectangleRect, obj.getClientRect())
      );

      this.addToSelectedNodes(selectedNodes);

      // ARROWS
      // get selected arrows
      const allArrows = this.stage.find(`.${ELEMENT_ARROW}`);
      const selectedArrowNodes = allArrows.filter((obj) =>
        Konva.Util.haveIntersection(selectionRectangleRect, obj.getClientRect())
      );

      selectedArrowNodes.forEach((arrowNode) => {
        const id = arrowNode.id();
        this.arrowPool[id]?.toggleSelected(true);
      });
    });
    //
    // Select by click
    this.stage.on("click tap", (e) => {
      // if we are startSelecting with rect, do nothing

      if (isSelectingByRectangle) {
        return;
      }

      // if click on empty area - remove all selections
      if (e.target.hasName(STAGE_NAME)) {
        this.addToSelectedNodes([]);
        Object.values(this.arrowPool).forEach((arrow) => {
          arrow.toggleSelected(false);
        });
        return;
      }

      // if clicked in a NOT selectable element - do nothing
      if (!e.target.hasName(ELEMENT_SELECTABLE_BY_CLICK_NAME)) {
        return;
      }

      /* Object.values(this.arrowPool).forEach((arrow) => {
        arrow.toggleSelected(false);
      }); */

      const nodeToSelect = e.target.getParent();

      // do we pressed shift or ctrl?
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = this.transformer.nodes().indexOf(nodeToSelect) >= 0;

      let listOfNodesSelected = [];

      if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected - select just one
        listOfNodesSelected = [nodeToSelect];
      } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected - remove it from selection:
        // use slice to have new copy of array
        const newListOfNodesSelected = this.transformer.nodes().slice();
        // remove node from array
        newListOfNodesSelected.splice(
          newListOfNodesSelected.indexOf(nodeToSelect),
          1
        );
        listOfNodesSelected = newListOfNodesSelected;
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        listOfNodesSelected = this.transformer.nodes().concat([nodeToSelect]);
      }

      this.addToSelectedNodes(listOfNodesSelected);
    });
  }
  setupSelectedNodePropsUpdate() {
    //BOX
    FillColor.subscribe((value) => {
      this.nodesSelected.forEach((group) => {
        const [box] = group.getChildren();
        box.fill(colorArrayToString(value));
      });
    });
    StrokeColor.subscribe((value) => {
      const color = colorArrayToString(value);
      this.nodesSelected.forEach((group) => {
        const [box] = group.getChildren();
        box.stroke(color);
      });
      Object.values(this.arrowPool).forEach((arrowElement) => {
        if (arrowElement.isSelected) {
          arrowElement.arrow.setAttrs({
            stroke: color,
            fill: color,
          });
        }
      });
    });
    StrokeWidth.subscribe((value) => {
      this.nodesSelected.forEach((group) => {
        const [box] = group.getChildren();
        box.strokeWidth(value);
      });
      Object.values(this.arrowPool).forEach((arrowElement) => {
        if (arrowElement.isSelected) {
          arrowElement.arrow.setAttrs({
            strokeWidth: Math.max(value, ARROW_MIN_WIDTH),
            pointerLength: Math.max(value, ARROW_POINT_MIN_WIDTH),
            pointerWidth: Math.max(value, ARROW_POINT_MIN_WIDTH),
          });
        }
      });
    });

    // TEXT
    TextColor.subscribe((value) => {
      this.nodesSelected.forEach((group) => {
        const [, text] = group.getChildren();
        text.fill(colorArrayToString(value));
      });
    });
    FontSize.subscribe((value) => {
      this.nodesSelected.forEach((group) => {
        const [box, text] = group.getChildren();

        text.fontSize(value);
        const y = 0.5 * (box.height() - text.height());
        text.y(y);
      });
    });
    FontFamily.subscribe((value) => {
      this.nodesSelected.forEach((group) => {
        const [box, text] = group.getChildren();

        text.fontFamily(getFontFamilyKey(value));
        const y = 0.5 * (box.height() - text.height());
        text.y(y);
      });
    });
    TextAlign.subscribe((value) => {
      this.nodesSelected.forEach((group) => {
        const [, text] = group.getChildren();
        text.align(value);
      });
    });

    Italic.subscribe((value) => {
      this.nodesSelected.forEach((group) => {
        const [, text] = group.getChildren();
        let fontFamilyValue = getFontFamilyValueFromKey(text.fontFamily());
        const isItalic = fontFamilyValue.includes("_italic");
        if (value) {
          if (!isItalic) {
            fontFamilyValue += "_italic";
          }
        } else {
          if (isItalic) {
            fontFamilyValue = fontFamilyValue.replace("_italic", "");
          }
        }

        text.fontFamily(getFontFamilyKey(fontFamilyValue));
      });
    });

    Bold.subscribe((value) => {
      this.nodesSelected.forEach((group) => {
        const [, text] = group.getChildren();
        text.fontStyle(value ? "bold" : "normal");
      });
    });
  }
  setupInputs() {
    const inputHandler = new InputHandler();

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

    // Move elements
    inputHandler
      .onKeyDown("ArrowUp", () => {
        if (
          StatusMode.get() !== STATUS_MODES.ONSTAGE ||
          this.nodesSelected.length === 0
        ) {
          return;
        }
        this.nodesSelected.forEach((group) => {
          group.y(group.y() - SNAP_SIZE);
        });
      })
      .onKeyDown("ArrowDown", () => {
        if (
          StatusMode.get() !== STATUS_MODES.ONSTAGE ||
          this.nodesSelected.length === 0
        ) {
          return;
        }
        this.nodesSelected.forEach((group) => {
          group.y(group.y() + SNAP_SIZE);
        });
      })
      .onKeyDown("ArrowLeft", () => {
        if (
          StatusMode.get() !== STATUS_MODES.ONSTAGE ||
          this.nodesSelected.length === 0
        ) {
          return;
        }
        this.nodesSelected.forEach((group) => {
          group.x(group.x() - SNAP_SIZE);
        });
      })
      .onKeyDown("ArrowRight", () => {
        if (
          StatusMode.get() !== STATUS_MODES.ONSTAGE ||
          this.nodesSelected.length === 0
        ) {
          return;
        }
        this.nodesSelected.forEach((group) => {
          group.x(group.x() + SNAP_SIZE);
        });
      });

    // DELETE elements
    inputHandler.onKeyDown("Delete", () => {
      if (
        StatusMode.get() !== STATUS_MODES.ONSTAGE ||
        this.nodesSelected.length === 0
      ) {
        return;
      }
      this.nodesSelected.forEach((group) => {
        const groupId = group.id();
        this.boxPool[groupId].delete();
        delete this.boxPool[groupId];
      });
      this.addToSelectedNodes([]);
    });

    // COPY/PASTE elements
    inputHandler
      .onKeyCtrlPress("c", () => {
        if (
          StatusMode.get() !== STATUS_MODES.ONSTAGE ||
          this.nodesSelected.length === 0
        ) {
          return;
        }
        this.clipboardElements = [];
        this.nodesSelected.forEach((group) => {
          const groupId = group.id();
          const copy = this.boxPool[groupId].copyPropsToClipboard();
          this.clipboardElements.push(copy);
        });
      })
      .onKeyCtrlPress("v", () => {
        if (
          StatusMode.get() !== STATUS_MODES.ONSTAGE ||
          this.clipboardElements.length === 0
        ) {
          return;
        }
        const newNodesSelected = [];
        this.clipboardElements.forEach((elemProps) => {
          const newElement = new Box(this, elemProps);

          newNodesSelected.push(newElement.group);
        });
        this.addToSelectedNodes(newNodesSelected);
      });
  }
  addToSelectedNodes(selectedNodes) {
    this.transformer.nodes(selectedNodes);
    this.nodesSelected = selectedNodes;
    if (selectedNodes.length > 0) {
      this.transformer.moveToTop();

      this.refillPropsByNodesSelected();
      ShowEditor.set(true);
    }
  }
  refillPropsByNodesSelected() {
    if (this.nodesSelected.length !== 1) {
      return;
    }
    const [group] = this.nodesSelected;
    const [box, text] = group.getChildren();

    //BOX
    FillColor.set(colorStringToArray(box.fill()));
    StrokeColor.set(colorStringToArray(box.stroke()));
    StrokeWidth.set(box.strokeWidth());

    // TEXT
    TextColor.set(colorStringToArray(text.fill()));
    FontSize.set(text.fontSize());
    const fontFamilyValue = getFontFamilyValueFromKey(text.fontFamily());
    FontFamily.set(fontFamilyValue);
    Italic.set(fontFamilyValue.includes("_italic"));
    Bold.set(text.fontStyle().includes("bold"));
    TextAlign.set(text.align());
  }
  addFromDrawReceptor(options) {
    /*
    {
      type,
      x,
      y,
      width,
      height
    }    
    */
    console.log(options.type);
    if (options.type.indexOf("arrow") >= 0) {
      const newArrow = new Arrow(this, options);
    } else {
      const newElement = new Box(this, options);
      this.addToSelectedNodes([newElement.group]);
    }
  }
}
export default Screen;
