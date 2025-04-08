import Konva from "konva";
import { snapGrid } from "@/utils/snapGrid";
import {
  ELEMENT_SELECTABLE_BY_CLICK_NAME,
  ELEMENT_SELECTABLE_BY_RECTANGLE_NAME,
} from "@/constants/names";
import { paddingXtext } from "@/constants/element-props";

export const createBox = (config) => {
  const { type, fillColor: fill, strokeColor: stroke, strokeWidth } = config;
  const x = 0,
    y = 0,
    width = snapGrid(config.width),
    height = snapGrid(config.height);

  switch (type) {
    case "circle":
      return new Konva.Shape({
        type,
        x,
        y,
        width,
        height,
        fill,
        stroke,
        strokeWidth,
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
          context.closePath();
          context.fillStrokeShape(shape);
        },
      });
    case "diamond":
      return new Konva.Shape({
        type,
        x,
        y,
        width,
        height,
        fill,
        stroke,
        strokeWidth,
        name: ELEMENT_SELECTABLE_BY_CLICK_NAME,
        sceneFunc: function (context, shape) {
          context.beginPath();
          context.moveTo(0.5 * shape.getAttr("width"), 0);
          context.lineTo(shape.getAttr("width"), 0.5 * shape.getAttr("height"));
          context.lineTo(0.5 * shape.getAttr("width"), shape.getAttr("height"));
          context.lineTo(0, 0.5 * shape.getAttr("height"));
          context.lineTo(0.5 * shape.getAttr("width"), 0);
          context.closePath();
          context.fillStrokeShape(shape);
        },
      });
    default:
      return new Konva.Rect({
        type: "rect",
        x,
        y,
        width,
        height,
        fill,
        stroke,
        strokeWidth,
        name: ELEMENT_SELECTABLE_BY_CLICK_NAME,
        cornerRadius: 10,
      });
  }
};
export const createText = (config, box) => {
  const {
    text,
    fontSize,
    fontFamily,
    align,
    textColor: fill,
    fontStyle,
  } = config;

  const Text = new Konva.Text({
    x: paddingXtext,
    y: 0,
    text,
    fontSize,
    fontFamily,
    align,
    fill,
    width: box.width() - 2 * paddingXtext,
    name: ELEMENT_SELECTABLE_BY_CLICK_NAME,
    type: "text",
    fontStyle,
  });
  Text.y(0.5 * (box.height() - Text.height()));
  return Text;
};
export const createGroup = (config, id) => {
  const Group = new Konva.Group({
    x: snapGrid(config.x),
    y: snapGrid(config.y),
    draggable: true,
    name: ELEMENT_SELECTABLE_BY_RECTANGLE_NAME,
    type: "group",
  });

  Group.id(id);

  return Group;
};
