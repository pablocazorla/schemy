import Konva from "konva";
import {
  ELEMENT_SELECTABLE_BY_CLICK_NAME,
  ELEMENT_SELECTABLE_BY_GROUP_NAME,
  CORNER_RADIUS,
  SNAP_SIZE,
  HIGHLIGHT,
  NO_HIGHLIGHT,
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
import { snapGrid, arrayColorToString, stringToArrayColor } from "./utils";
import { StageDragging } from "@/js/store";

const CIRCLE_ATTRS = {
  radius: SNAP_SIZE * 0.7,
  fill: "aqua",
  draggable: true,
  opacity: 0,
  name: "ARROW_CIRCLE",
};

const CONTROL_POINTS_LETTERS = ["A", "B", "C"];

const calculateControlPosition = (x, y, xCont, yCont, width, height) => {
  const dX = (x - (xCont + 0.5 * width)) / width;
  const dY = (y - (yCont + 0.5 * height)) / height;
  if (Math.abs(dX) > Math.abs(dY)) {
    // B or D
    return dX < 0 ? "D" : "B";
  }
  return dY < 0 ? "A" : "C";
};

const getControlPosition = (type, x, y, width, height) => {
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

class Arrow {
  constructor({ screen, nodeGroup, x, y, width, height }) {
    this.screen = screen;
    this.id = crypto.randomUUID();
    this.deleted = false;
    this.isSelected = false;

    const xGrid = snapGrid(x);
    const yGrid = snapGrid(y);
    const widthGrid = snapGrid(width);
    const heightGrid = snapGrid(height);

    // INITIAL POINTS
    const points = [
      [xGrid, yGrid],
      [xGrid + 0.5 * widthGrid, yGrid + 0.5 * heightGrid],
      [xGrid + widthGrid, yGrid + heightGrid],
    ];

    // ARROW
    const strokeColor = arrayColorToString(prop_strokeColor.get());
    const strokeWidth = prop_strokeWidth.get();
    this.arrow = new Konva.Arrow({
      x: 0,
      y: 0,
      points: points.reduce((acc, point) => {
        return acc.concat(point);
      }, []),
      pointerLength: strokeWidth * 6,
      pointerWidth: strokeWidth * 6,
      fill: strokeColor,
      stroke: strokeColor,
      strokeWidth,
      tension: 0.5,
      name: "ARROW",
    });
    this.screen.layer.add(this.arrow);

    // CONTROL POINTS
    CONTROL_POINTS_LETTERS.forEach((letter, i) => {
      this[`circle_${letter}`] = new Konva.Circle({
        ...CIRCLE_ATTRS,
        x: points[i][0],
        y: points[i][1],
      });

      this.screen.layer.add(this[`circle_${letter}`]);

      this[`circle_tween_${letter}`] = new Konva.Tween({
        node: this[`circle_${letter}`],
        duration: 0.1,
        opacity: 0.4,
      });
    });

    this.control_A = {
      element: null,
      position: "A",
    };
    this.control_C = {
      element: null,
      position: "A",
    };

    this.setupMove();
    this.setupEditArrowSelection();
    //
    this.screen.arrowPool[this.id] = this;
  }
  setupMove() {
    CONTROL_POINTS_LETTERS.forEach((letter) => {
      this[`circle_${letter}`].on("pointerenter", () => {
        if (!this.isSelected) {
          this.arrow.moveToTop();
          CONTROL_POINTS_LETTERS.forEach((lett) => {
            this[`circle_${lett}`].moveToTop();
            this[`circle_tween_${lett}`].play();
          });
        }
      });
      this[`circle_${letter}`].on("pointerleave", () => {
        if (!this.isSelected) {
          CONTROL_POINTS_LETTERS.forEach((lett) => {
            this[`circle_tween_${lett}`].reverse();
          });
        }
      });
    });

    const controlPointCircles = CONTROL_POINTS_LETTERS.map((letter) => {
      return {
        circle: this[`circle_${letter}`],
        letter,
      };
    });

    controlPointCircles.forEach(({ circle, letter }) => {
      let elementToHit = null;

      circle.on("click tap", () => {
        this.toggleSelected(true);
      });

      circle.on("dragmove", () => {
        // POSITION
        const newX = snapGrid(circle.x());
        const newY = snapGrid(circle.y());
        circle.setAttrs({
          x: newX,
          y: newY,
        });

        this.arrow.setAttrs({
          points: controlPointCircles.reduce((acc, point) => {
            return acc.concat([point.circle.x(), point.circle.y()]);
          }, []),
        });

        if (letter !== "B") {
          const allGroups = this.screen.stage.find(
            `.${ELEMENT_SELECTABLE_BY_GROUP_NAME}`
          );

          const circleBox = circle.getClientRect();
          const groupIdsToHit = allGroups
            .filter((obj) =>
              Konva.Util.haveIntersection(circleBox, obj.getClientRect())
            )
            .map((obj) => obj.id());

          if (groupIdsToHit.length > 0) {
            const groupToHitId = groupIdsToHit[groupIdsToHit.length - 1];
            if (elementToHit) {
              if (elementToHit.id === groupToHitId) {
                return;
              } else {
                elementToHit.toggleHighlight(false);
              }
            }
            elementToHit = this.screen.containerPool[groupToHitId];
            elementToHit.toggleHighlight(true);
          } else {
            if (elementToHit) {
              elementToHit.toggleHighlight(false);
              elementToHit = null;
            }
          }
        }
      });
      if (letter !== "B") {
        circle.on("dragend", () => {
          if (
            this[`control_${letter}`].element &&
            (!elementToHit ||
              elementToHit.id !== this[`control_${letter}`].element.id)
          ) {
            // remove events TO DO
            const { group: groupToRemove } = this[`control_${letter}`].element;
            if (groupToRemove) {
              groupToRemove.off(`dragmove.arrow_${this.id}_${letter}`);
              groupToRemove.off(`transform.arrow_${this.id}_${letter}`);
            }

            //
            this[`control_${letter}`].element = null;
          }

          if (elementToHit) {
            elementToHit.toggleHighlight(false);
            this[`control_${letter}`].element = elementToHit;

            // add events TO DO
            const { containerBox, group } = this[`control_${letter}`].element;

            const position = calculateControlPosition(
              circle.x(),
              circle.y(),
              group.x(),
              group.y(),
              containerBox.width(),
              containerBox.height()
            );

            circle.setAttrs({
              ...getControlPosition(
                position,
                group.x(),
                group.y(),
                containerBox.width(),
                containerBox.height()
              ),
            });
            this.updateArrow();

            group.on(`dragmove.arrow_${this.id}_${letter}`, (e) => {
              circle.setAttrs({
                ...getControlPosition(
                  position,
                  group.x(),
                  group.y(),
                  containerBox.width(),
                  containerBox.height()
                ),
              });
              this.updateArrow();
            });
            group.on(`transform.arrow_${this.id}_${letter}`, (e) => {
              circle.setAttrs({
                ...getControlPosition(
                  position,
                  group.x(),
                  group.y(),
                  containerBox.width(),
                  containerBox.height()
                ),
              });
              this.updateArrow();
            });
          }
        });
      }
    });
  }
  toggleSelected(flag) {
    this.isSelected = flag;
    if (flag) {
      this.arrow.setAttrs({
        ...HIGHLIGHT,
      });
      this.arrow.moveToTop();
      CONTROL_POINTS_LETTERS.forEach((lett) => {
        this[`circle_${lett}`].moveToTop();
        this[`circle_${lett}`].setAttrs({
          ...HIGHLIGHT,
        });
        this[`circle_tween_${lett}`].play();
      });

      this.refillPropsByArrowSelection();
    } else {
      this.arrow.setAttrs({
        ...NO_HIGHLIGHT,
      });
      CONTROL_POINTS_LETTERS.forEach((lett) => {
        this[`circle_${lett}`].setAttrs({
          ...NO_HIGHLIGHT,
        });
        this[`circle_tween_${lett}`].reverse();
      });
    }
  }
  updateArrow() {
    const controlPointCircles = CONTROL_POINTS_LETTERS.map((letter) => {
      return {
        circle: this[`circle_${letter}`],
        letter,
      };
    });

    this.arrow.setAttrs({
      points: controlPointCircles.reduce((acc, point) => {
        return acc.concat([point.circle.x(), point.circle.y()]);
      }, []),
    });
  }
  refillPropsByArrowSelection() {
    prop_strokeColor.set(stringToArrayColor(this.arrow.stroke()));
    prop_strokeWidth.set(this.arrow.strokeWidth());
  }
  setupEditArrowSelection() {
    prop_strokeColor.subscribe((value) => {
      if (this.isSelected) {
        const strokeColor = arrayColorToString(value);
        this.arrow.fill(strokeColor);
        this.arrow.stroke(strokeColor);
        this.arrow.setAttrs({
          fill: strokeColor,
          stroke: strokeColor,
        });
      }
    });
    prop_strokeWidth.subscribe((value) => {
      if (this.isSelected) {
        const minWidth = 2;
        const strokeWidth = Math.max(value, minWidth);
        this.arrow.setAttrs({
          strokeWidth: strokeWidth,
          pointerLength: Math.max(strokeWidth * 3, minWidth * 6),
          pointerWidth: Math.max(strokeWidth * 3, minWidth * 6),
        });
      }
    });
  }
}

export default Arrow;
