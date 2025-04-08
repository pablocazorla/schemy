import { StageDragging } from "@/store/app";
import {
  FillColor,
  StrokeColor,
  StrokeWidth,
  TextColor,
  FontSize,
  FontFamily,
  Italic,
  Bold,
  TextAlign,
} from "@/store/element-props";
import { colorArrayToString } from "@/utils/colorArrayString";
import { SNAP_SIZE } from "@/constants/app";
import { paddingXtext } from "@/constants/element-props";
import { snapGrid } from "@/utils/snapGrid";
import { getFontFamilyKey } from "@/utils/getFontFamilyKey";
import { createBox, createText, createGroup } from "./utils";

class Box {
  constructor(screen, options) {
    this.screen = screen;
    this.id = crypto.randomUUID();
    this.isDeleted = false;

    let fontFamilyValue = FontFamily.get();
    const isItalic = Italic.get();
    if (isItalic) {
      if (!fontFamilyValue.includes("_italic")) {
        fontFamilyValue += "_italic";
      }
    } else {
      if (fontFamilyValue.includes("_italic")) {
        fontFamilyValue = fontFamilyValue.replace("_italic", "");
      }
    }

    const fontFamily = getFontFamilyKey(fontFamilyValue);

    const config = {
      // GROUP
      x: 0,
      y: 0,

      // SHAPE
      type: "rect",
      width: 100,
      height: 100,
      fillColor: colorArrayToString(FillColor.get()),
      strokeColor: colorArrayToString(StrokeColor.get()),
      strokeWidth: StrokeWidth.get(),

      // TEXT
      text: "Text",
      fontSize: FontSize.get(),
      fontFamily,
      align: TextAlign.get(),
      textColor: colorArrayToString(TextColor.get()),
      fontStyle: Bold.get() ? "bold" : "normal",
      //
      ...options,
    };

    this.box = createBox(config);
    this.text = createText(config, this.box);
    this.group = createGroup(config, this.id);

    this.group.add(this.box);
    this.group.add(this.text);

    this.screen.layer.add(this.group);
    this.screen.boxPool[this.id] = this;

    // SETUP
    this.setupDragMove();
    this.setupTransformation();
    this.setupInputs();
  }
  setupDragMove() {
    this.group.on("dragmove", () => {
      this.group.setAttrs({
        x: snapGrid(this.group.x()),
        y: snapGrid(this.group.y()),
      });
    });
  }
  setupTransformation() {
    this.group.on("transform", () => {
      const width = snapGrid(
        Math.max(this.box.width() * this.group.scaleX(), 2 * SNAP_SIZE)
      );
      const height = snapGrid(
        Math.max(this.box.height() * this.group.scaleY(), 2 * SNAP_SIZE)
      );
      const y = 0.5 * (height - this.text.height());

      //
      this.box.setAttrs({
        width,
        height,
        scaleX: 1,
        scaleY: 1,
      });
      this.text.setAttrs({
        y,
        width: width - 2 * paddingXtext,
      });
      this.group.setAttrs({
        scaleX: 1,
        scaleY: 1,
      });
    });
  }
  setupInputs() {
    StageDragging.subscribe((value) => {
      if (!this.isDeleted) {
        this.group.draggable(!value);
      }
    });
  }
  delete() {
    this.box.destroy();
    this.text.destroy();
    this.group.destroy();
    this.box = null;
    this.text = null;
    this.group = null;
    this.isDeleted = true;
  }
  copyPropsToClipboard() {
    const { x, y } = this.group.getAttrs();
    const {
      type,
      width,
      height,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth,
    } = this.box.getAttrs();
    const {
      text,
      fontSize,
      fontFamily,
      align,
      fill: textColor,
      fontStyle,
    } = this.text.getAttrs();

    const propsToCopy = {
      // GROUP
      x: x + SNAP_SIZE,
      y: y + SNAP_SIZE,

      // SHAPE
      type,
      width,
      height,
      fillColor,
      strokeColor,
      strokeWidth,

      // TEXT
      text,
      fontSize,
      fontFamily,
      align,
      textColor,
      fontStyle,
    };

    return propsToCopy;
  }
  toggleHighlight() {}
}
export default Box;
