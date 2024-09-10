import Konva from "konva";
import {
  ELEMENT_SELECTABLE_BY_CLICK_NAME,
  ELEMENT_SELECTABLE_BY_GROUP_NAME,
  CORNER_RADIUS,
  BORDER_WIDTH,
  SNAP_SIZE,
} from "@/js/constants";
import {
  prop_fillColor,
  prop_strokeColor,
  prop_fontSize,
  prop_fontFamily,
  prop_textColor,
  prop_textAlign,
} from "@/js/store";
import { snapGrid, arrayColorToString } from "../utils";
import { StageDragging } from "@/js/store";

class ContainerObject {
  constructor({ screen, type, x, y, width, height }) {
    this.screen = screen;
    this.type = type;

    const xGrid = snapGrid(x);
    const yGrid = snapGrid(y);
    const widthGrid = snapGrid(width);
    const heightGrid = snapGrid(height);

    this.containerBox = this.createContainerByType(type, widthGrid, heightGrid);

    this.textBox = new Konva.Text({
      x: 0,
      y: 0,
      text: "Texto",
      fontSize: prop_fontSize.get(),
      fontFamily: prop_fontFamily.get(),
      align: prop_textAlign.get(),
      fill: arrayColorToString(prop_textColor.get()),
      width: widthGrid,
      name: "TEXT",
    });
    this.textBox.setAttrs({
      y: 0.5 * (heightGrid - this.textBox.height()),
    });

    this.group = new Konva.Group({
      x: xGrid,
      y: yGrid,
      draggable: true,
      name: ELEMENT_SELECTABLE_BY_GROUP_NAME,
    });

    this.group.add(this.containerBox);
    this.group.add(this.textBox);
    this.screen.layer.add(this.group);
    //this.screen.elements.push(this);
    //
    this.setupInputs();
    this.setupTransformations();
    this.setupMove();
  }
  setupInputs() {
    StageDragging.subscribe((value) => {
      this.group.draggable(!value);
    });
  }
  setupTransformations() {
    this.group.on("transform", () => {
      //
      const newWidth = snapGrid(
        Math.max(this.containerBox.width() * this.group.scaleX(), SNAP_SIZE)
      );
      const newHeight = snapGrid(
        Math.max(this.containerBox.height() * this.group.scaleY(), SNAP_SIZE)
      );
      this.containerBox.setAttrs({
        width: newWidth,
        height: newHeight,
        scaleX: 1,
        scaleY: 1,
      });

      const newYtext = 0.5 * (newHeight - this.textBox.height());

      this.textBox.setAttrs({
        x: 0,
        y: newYtext,
        width: newWidth,
      });
      this.group.setAttrs({
        scaleX: 1,
        scaleY: 1,
      });
    });

    this.containerBox.on("transform", () => {
      const newWidth = snapGrid(
        Math.max(
          this.containerBox.width() * this.containerBox.scaleX(),
          SNAP_SIZE
        )
      );
      const newHeight = snapGrid(
        Math.max(
          this.containerBox.height() * this.containerBox.scaleY(),
          SNAP_SIZE
        )
      );
      const newYtext = 0.5 * (newHeight - this.textBox.height());

      //
      this.containerBox.setAttrs({
        width: newWidth,
        height: newHeight,
        scaleX: 1,
        scaleY: 1,
      });
      this.textBox.setAttrs({
        x: 0,
        y: newYtext,
        width: newWidth,
      });
    });
  }
  setupMove() {
    this.group.on("dragmove", () => {
      const newX = snapGrid(this.group.x());
      const newY = snapGrid(this.group.y());
      this.group.setAttrs({
        x: newX,
        y: newY,
      });
    });
  }
  createContainerByType(type, width, height) {
    switch (type) {
      case "circle":
        return new Konva.Shape({
          x: 0,
          y: 0,
          width,
          height,
          fill: arrayColorToString(prop_fillColor.get()),
          stroke: arrayColorToString(prop_strokeColor.get()),
          strokeWidth: BORDER_WIDTH,
          name: ELEMENT_SELECTABLE_BY_CLICK_NAME,
          sceneFunc: function (context, shape) {
            context.beginPath();

            context.ellipse(
              0.5 * shape.getAttr("width"),
              0.5 * shape.getAttr("height"),
              0.5 * shape.getAttr("width"),
              0.5 * shape.getAttr("height"),
              0,
              0,
              2 * Math.PI
            );

            context.fillStrokeShape(shape);
          },
        });

      case "diamond":
        return new Konva.Shape({
          x: 0,
          y: 0,
          width,
          height,
          fill: arrayColorToString(prop_fillColor.get()),
          stroke: arrayColorToString(prop_strokeColor.get()),
          strokeWidth: BORDER_WIDTH,
          name: ELEMENT_SELECTABLE_BY_CLICK_NAME,
          sceneFunc: function (context, shape) {
            context.beginPath();
            context.moveTo(0.5 * shape.getAttr("width"), 0);
            context.lineTo(
              shape.getAttr("width"),
              0.5 * shape.getAttr("height")
            );
            context.lineTo(
              0.5 * shape.getAttr("width"),
              shape.getAttr("height")
            );
            context.lineTo(0, 0.5 * shape.getAttr("height"));
            context.lineTo(0.5 * shape.getAttr("width"), 0);
            // don't need to set position of rect, Konva will handle it
            // (!) Konva specific method, it is very important
            // it will apply are required styles
            context.fillStrokeShape(shape);
          },
        });
      default:
        return new Konva.Rect({
          x: 0,
          y: 0,
          width,
          height,
          fill: arrayColorToString(prop_fillColor.get()),
          stroke: arrayColorToString(prop_strokeColor.get()),
          strokeWidth: BORDER_WIDTH,
          cornerRadius: CORNER_RADIUS,
          name: ELEMENT_SELECTABLE_BY_CLICK_NAME,
        });
    }
  }
}

export default ContainerObject;
