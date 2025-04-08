import { SNAP_SIZE } from "@/constants/app";
import { ELEMENT_ARROW_CIRCLE } from "@/constants/names";

export const CIRCLE_ATTRS = {
  radius: SNAP_SIZE,
  fill: "aqua",
  draggable: true,
  opacity: 0,
  name: ELEMENT_ARROW_CIRCLE,
};
export const CONTROL_POINTS_NAMES = ["A", "B", "C"];

export const calculateControlPosition = (x, y, xCont, yCont, width, height) => {
  const dX = (x - (xCont + 0.5 * width)) / width;
  const dY = (y - (yCont + 0.5 * height)) / height;
  if (Math.abs(dX) > Math.abs(dY)) {
    // B or D
    return dX < 0 ? "D" : "B";
  }
  return dY < 0 ? "A" : "C";
};

export const getControlPosition = (type, x, y, width, height) => {
  switch (type) {
    case "A":
      return {
        x: x + 0.5 * width,
        y,
      };
    case "B":
      return {
        x: x + width,
        y: y + 0.5 * height,
      };
    case "C":
      return {
        x: x + 0.5 * width,
        y: y + height,
      };
    case "D":
      return {
        x,
        y: y + 0.5 * height,
      };
  }
};
