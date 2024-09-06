import Konva from "konva";
import {
  CORNER_RADIUS,
  BORDER_WIDTH,
  OBJECT_SELECTABLE_BY_GROUP_NAME,
  OBJECT_SELECTABLE_BY_CLICK_NAME,
  FONT_SIZES,
} from "@/js/constants";

class Rectangle {
  constructor(screen, options) {
    const {
      x,
      y,
      width,
      height,
      fill,
      stroke,
      strokeWidth,
      text,
      cornerRadius,
      //
      fontSize,
      fillText,
    } = {
      x: 0,
      y: 0,
      width: 200,
      height: 80,
      fill: "red",
      stroke: "yellow",
      strokeWidth: BORDER_WIDTH,
      text: "Hola Mundo",
      cornerRadius: CORNER_RADIUS,
      fontSize: FONT_SIZES[1],
      fillText: "black",
      ...(options || {}),
    };

    this.screen = screen;

    this.rectBox = new Konva.Rect({
      x: 0,
      y: 0,
      width,
      height,
      fill,
      stroke,
      strokeWidth,
      cornerRadius,
      name: OBJECT_SELECTABLE_BY_CLICK_NAME,
    });

    this.textBox = new Konva.Text({
      x: 0,
      y: 0,
      text,
      fontSize,
      align: "center",
      fill: fillText,
      width,
      name: "text",
    });
    this.textBox.setAttrs({
      y: 0.5 * (this.rectBox.height() - this.textBox.height()),
    });

    this.group = new Konva.Group({
      x,
      y,
      draggable: true,
      name: OBJECT_SELECTABLE_BY_GROUP_NAME,
    });

    this.group.add(this.rectBox);
    this.group.add(this.textBox);
    this.screen.layer.add(this.group);

    this.group.on("transform", () => {
      const newWidth = Math.max(
        this.rectBox.width() * this.group.scaleX(),
        strokeWidth
      );
      const newHeight = Math.max(
        this.rectBox.height() * this.group.scaleY(),
        strokeWidth
      );
      const newYtext = 0.5 * (newHeight - this.textBox.height());

      //
      this.rectBox.setAttrs({
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
      this.group.setAttrs({
        scaleX: 1,
        scaleY: 1,
      });
    });

    this.rectBox.on("transform", () => {
      const newWidth = Math.max(
        this.rectBox.width() * this.rectBox.scaleX(),
        strokeWidth
      );
      const newHeight = Math.max(
        this.rectBox.height() * this.rectBox.scaleY(),
        strokeWidth
      );
      const newYtext = 0.5 * (newHeight - this.textBox.height());

      //
      this.rectBox.setAttrs({
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

    /*
    // TEXT EDITION
    const inp = document.querySelector("#inp");
    this.textBox.on("pointerdblclick", () => {
      
      const top = this.group.y() + this.textBox.y();
      const left = this.group.x();
      const width = this.textBox.width();
      const height = this.textBox.height();
      inp.style.top = `${top}px`;
      inp.style.left = `${left}px`;
      inp.style.width = `${width}px`;
      inp.style.height = `${height}px`;
    });
    */
  }
}

export default Rectangle;
