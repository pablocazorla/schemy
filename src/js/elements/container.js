import Konva from "konva";
import {
  ELEMENT_SELECTABLE_BY_CLICK_NAME,
  ELEMENT_SELECTABLE_BY_GROUP_NAME,
  CORNER_RADIUS,
  SNAP_SIZE,
} from "@/js/constants";
import {
  prop_fillColor,
  prop_strokeColor,
  prop_strokeWidth,
  prop_fontSize,
  prop_fontFamily,
  prop_textColor,
  prop_textAlign,
} from "@/js/store";
import { snapGrid, arrayColorToString } from "../utils";
import { StageDragging } from "@/js/store";

class ContainerElement {
  constructor({ screen, nodeGroup, type, x, y, width, height }) {
    this.screen = screen;
    this.id = crypto.randomUUID();
    this.deleted = false;

    if (nodeGroup) {
      const [container, text] = nodeGroup.getChildren();
      this.type = container.getAttrs().type;
      console.log(this.type);
      this.containerBox = container;
      this.textBox = text;
      this.group = nodeGroup;
    } else {
      this.type = type;
      const xGrid = snapGrid(x);
      const yGrid = snapGrid(y);
      const widthGrid = snapGrid(width);
      const heightGrid = snapGrid(height);

      this.containerBox = this.createContainerByType(
        type,
        widthGrid,
        heightGrid
      );
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
        type: "text",
      });
      this.textBox.setAttrs({
        y: 0.5 * (heightGrid - this.textBox.height()),
      });

      this.group = new Konva.Group({
        x: xGrid,
        y: yGrid,
        draggable: true,
        name: ELEMENT_SELECTABLE_BY_GROUP_NAME,
        type: "group",
      });

      this.group.add(this.containerBox);
      this.group.add(this.textBox);
      console.log("id", this.group.id());
    }

    this.group.id(this.id);

    this.screen.layer.add(this.group);
    //
    this.setupInputs();
    this.setupTransformations();
    this.setupMove();

    this.screen.containerPool[this.id] = this;
  }

  setupInputs() {
    StageDragging.subscribe((value) => {
      if (!this.deleted) {
        console.log("existo", this.group);
        this.group.draggable(!value);
      }
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
          type,
          x: 0,
          y: 0,
          width,
          height,
          fill: arrayColorToString(prop_fillColor.get()),
          stroke: arrayColorToString(prop_strokeColor.get()),
          strokeWidth: prop_strokeWidth.get(),
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
          type,
          x: 0,
          y: 0,
          width,
          height,
          fill: arrayColorToString(prop_fillColor.get()),
          stroke: arrayColorToString(prop_strokeColor.get()),
          strokeWidth: prop_strokeWidth.get(),
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
            context.closePath();
            // don't need to set position of rect, Konva will handle it
            // (!) Konva specific method, it is very important
            // it will apply are required styles
            context.fillStrokeShape(shape);
          },
        });
      default:
        return new Konva.Rect({
          type: "rect",
          x: 0,
          y: 0,
          width,
          height,
          fill: arrayColorToString(prop_fillColor.get()),
          stroke: arrayColorToString(prop_strokeColor.get()),
          strokeWidth: prop_strokeWidth.get(),
          cornerRadius: CORNER_RADIUS,
          name: ELEMENT_SELECTABLE_BY_CLICK_NAME,
        });
    }
  }
  onDelete() {
    this.deleted = true;
    this.group.destroy();
    this.containerBox = null;
    this.textBox = null;
    this.group = null;
  }
}

export default ContainerElement;
