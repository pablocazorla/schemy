import Konva from "konva";
import { StageDragging } from "@/store/app";
import { StrokeColor, StrokeWidth } from "@/store/element-props";
import { colorArrayToString } from "@/utils/colorArrayString";
import { SNAP_SIZE } from "@/constants/app";
import {
  ARROW_MIN_WIDTH,
  ARROW_POINT_MIN_WIDTH,
} from "@/constants/element-props";
import {
  ELEMENT_SELECTABLE_BY_RECTANGLE_NAME,
  ELEMENT_ARROW,
} from "@/constants/names";
import { snapGrid } from "@/utils/snapGrid";
import {
  CIRCLE_ATTRS,
  CONTROL_POINTS_NAMES,
  calculateControlPosition,
  getControlPosition,
} from "./utils";

class Arrow {
  constructor(screen, options) {
    this.screen = screen;
    this.id = crypto.randomUUID();
    this.isDeleted = false;
    this.isSelected = false;

    const config = {
      type: "arrowRight",
      x: 0,
      y: 0,
      width: 10 * SNAP_SIZE,
      height: 6 * SNAP_SIZE,
      isToUp: false,
      isToLeft: false,
      stroke: colorArrayToString(StrokeColor.get()),
      strokeWidth: StrokeWidth.get(),
      //
      ...options,
    };

    let xs = [config.x, config.x + 0.5 * config.width, config.x + config.width];
    let ys = [
      config.y,
      config.y + 0.5 * config.height,
      config.y + config.height,
    ];
    if (config.isToLeft) {
      xs.reverse();
    }
    if (config.isToUp) {
      ys.reverse();
    }

    let defaultPointsConfig = ys.map((y, i) => [xs[i], y]);

    /* if (config.type === "arrowLeft") {
      defaultPointsConfig.reverse();
    } */

    const points = (
      config?.points ||
      defaultPointsConfig.reduce((acc, point) => {
        return acc.concat(point);
      }, [])
    ).map((v) => snapGrid(v));

    this.arrow = new Konva.Arrow({
      x: 0,
      y: 0,
      points,
      pointerLength: Math.max(config.strokeWidth, ARROW_POINT_MIN_WIDTH),
      pointerWidth: Math.max(config.strokeWidth, ARROW_POINT_MIN_WIDTH),
      fill: config.stroke,
      stroke: config.stroke,
      strokeWidth: Math.max(config.strokeWidth, ARROW_MIN_WIDTH),
      tension: 0.5,
      name: ELEMENT_ARROW,
      id: this.id,
    });
    this.screen.layer.add(this.arrow);

    // CONTROL POINTS
    CONTROL_POINTS_NAMES.forEach((name, i) => {
      this[`circle_${name}`] = new Konva.Circle({
        ...CIRCLE_ATTRS,
        x: points[i * 2],
        y: points[i * 2 + 1],
      });
      this.screen.layer.add(this[`circle_${name}`]);

      this[`circle_tween_${name}`] = new Konva.Tween({
        node: this[`circle_${name}`],
        duration: 0.1,
        opacity: 0.4,
      });
      /////
      if (i !== 1) {
        this[`control_${name}`] = {
          element: null,
          position: "A",
        };
      }
    });

    //////
    this.setupMove();
    this.setupClick();
    this.setupInputs();
    /////
    this.rectangleHighlightArrow = null;
    //
    this.screen.arrowPool[this.id] = this;
  }
  setupMove() {
    CONTROL_POINTS_NAMES.forEach((name) => {
      const circle = this[`circle_${name}`];
      // Highlight
      circle.on("pointerenter", () => {
        if (this.isSelected) {
          return;
        }
        this.arrow.moveToTop();
        CONTROL_POINTS_NAMES.forEach((n) => {
          this[`circle_${n}`].moveToTop();
          this[`circle_tween_${n}`].play();
        });
      });
      circle.on("pointerleave", () => {
        if (this.isSelected) {
          return;
        }
        CONTROL_POINTS_NAMES.forEach((n) => {
          this[`circle_tween_${n}`].reverse();
        });
      });

      // move

      let elementToHit = null;

      circle.on("dragmove", () => {
        if (this.isSelected) {
          return;
        }

        // POSITION
        const newX = snapGrid(circle.x());
        const newY = snapGrid(circle.y());
        circle.setAttrs({
          x: newX,
          y: newY,
        });

        this.updateArrowShapeByControlPoints();

        if (name !== CONTROL_POINTS_NAMES[1]) {
          const allGroups = this.screen.stage.find(
            `.${ELEMENT_SELECTABLE_BY_RECTANGLE_NAME}`
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
            elementToHit = this.screen.boxPool[groupToHitId];
            elementToHit.toggleHighlight(true);
          } else {
            if (elementToHit) {
              elementToHit.toggleHighlight(false);
              elementToHit = null;
            }
          }
        }
      });

      if (name !== CONTROL_POINTS_NAMES[1]) {
        circle.on("dragend", () => {
          if (this.isSelected) {
            return;
          }
          if (
            this[`control_${name}`].element &&
            (!elementToHit ||
              elementToHit.id !== this[`control_${name}`].element.id)
          ) {
            // remove events TO DO
            const { group: groupToRemove } = this[`control_${name}`].element;
            if (groupToRemove) {
              groupToRemove.off(`dragmove.arrow_${this.id}_${name}`);
              groupToRemove.off(`transform.arrow_${this.id}_${name}`);
            }

            //
            this[`control_${name}`].element = null;
          }

          if (elementToHit) {
            elementToHit.toggleHighlight(false);
            this[`control_${name}`].element = elementToHit;

            // add events TO DO
            const { box, group } = this[`control_${name}`].element;

            const position = calculateControlPosition(
              circle.x(),
              circle.y(),
              group.x(),
              group.y(),
              box.width(),
              box.height()
            );

            circle.setAttrs({
              ...getControlPosition(
                position,
                group.x(),
                group.y(),
                box.width(),
                box.height()
              ),
            });
            this.updateArrowShapeByControlPoints();

            group.on(`dragmove.arrow_${this.id}_${name}`, (e) => {
              circle.setAttrs({
                ...getControlPosition(
                  position,
                  group.x(),
                  group.y(),
                  box.width(),
                  box.height()
                ),
              });
              this.updateArrowShapeByControlPoints();
            });
            group.on(`transform.arrow_${this.id}_${name}`, (e) => {
              circle.setAttrs({
                ...getControlPosition(
                  position,
                  group.x(),
                  group.y(),
                  box.width(),
                  box.height()
                ),
              });
              this.updateArrowShapeByControlPoints();
            });
          }
        });
      }
    });
  }
  setupClick() {
    // Click select
    CONTROL_POINTS_NAMES.forEach((name) => {
      const circle = this[`circle_${name}`];
      circle.on("click tap", (e) => {
        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;

        if (!metaPressed) {
          Object.values(this.screen.arrowPool).forEach((arrow) => {
            arrow.toggleSelected(false);
          });
        }

        this.toggleSelected(true);
      });
    });
  }
  setupInputs() {
    StageDragging.subscribe((value) => {
      if (!this.isDeleted) {
        CONTROL_POINTS_NAMES.forEach((name) => {
          this[`circle_${name}`].draggable(!value);
        });
      }
    });
  }
  updateArrowShapeByControlPoints() {
    const points = CONTROL_POINTS_NAMES.map((name) => {
      return {
        x: this[`circle_${name}`].x(),
        y: this[`circle_${name}`].y(),
      };
    }).reduce((acc, point) => {
      return acc.concat([point.x, point.y]);
    }, []);

    this.arrow.setAttrs({
      points,
    });
  }
  toggleSelected(flag) {
    const rectangleHighlightArrowPadding = 5;

    if (flag) {
      if (this.isSelected) {
        return;
      }

      this.arrow.moveToTop();
      CONTROL_POINTS_NAMES.forEach((names) => {
        this[`circle_${names}`].setAttrs({
          draggable: false,
        });
        this[`circle_tween_${names}`].reverse();
      });

      const x =
        Math.min(
          this[`circle_${CONTROL_POINTS_NAMES[0]}`].x(),
          this[`circle_${CONTROL_POINTS_NAMES[1]}`].x(),
          this[`circle_${CONTROL_POINTS_NAMES[2]}`].x()
        ) - rectangleHighlightArrowPadding;

      const y =
        Math.min(
          this[`circle_${CONTROL_POINTS_NAMES[0]}`].y(),
          this[`circle_${CONTROL_POINTS_NAMES[1]}`].y(),
          this[`circle_${CONTROL_POINTS_NAMES[2]}`].y()
        ) - rectangleHighlightArrowPadding;

      const xMax =
        Math.max(
          this[`circle_${CONTROL_POINTS_NAMES[0]}`].x(),
          this[`circle_${CONTROL_POINTS_NAMES[1]}`].x(),
          this[`circle_${CONTROL_POINTS_NAMES[2]}`].x()
        ) + rectangleHighlightArrowPadding;

      const yMax =
        Math.max(
          this[`circle_${CONTROL_POINTS_NAMES[0]}`].y(),
          this[`circle_${CONTROL_POINTS_NAMES[1]}`].y(),
          this[`circle_${CONTROL_POINTS_NAMES[2]}`].y()
        ) + rectangleHighlightArrowPadding;

      const width = xMax - x;
      const height = yMax - y;

      this.rectangleHighlightArrow = new Konva.Rect({
        x,
        y,
        width,
        height,
        stroke: "hsla(194, 100%, 50%, 1)",
        strokeWidth: 1,
        listening: false,
      });
      this.screen.layer.add(this.rectangleHighlightArrow);

      this.rectangleHighlightArrow.moveToTop();
    } else {
      if (!this.isSelected) {
        return;
      }
      this.rectangleHighlightArrow.destroy();
      CONTROL_POINTS_NAMES.forEach((names) => {
        this[`circle_${names}`].setAttrs({
          draggable: true,
        });
      });
    }

    this.isSelected = flag;
  }
}

export default Arrow;
