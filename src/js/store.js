import { atom } from "nanostores";
import {
  STATUS_MODES,
  DEFAULT_COLORS,
  DEFAULT_OPACITY_FILL,
  FONT_FAMILY_LIST,
  FONT_SIZES,
  TEXT_ALIGNS,
  BORDER_WIDTH_LIST,
} from "@/js/constants";

export const StatusMode = atom(STATUS_MODES.DRAWING);
export const StageDragging = atom(false);
//
export const showEditTools = atom(false);

//
export const prop_colorCollection = atom(DEFAULT_COLORS);

export const prop_fillColor = atom([
  ...DEFAULT_COLORS[0],
  DEFAULT_OPACITY_FILL,
]);

export const prop_strokeColor = atom([...DEFAULT_COLORS[0], 1]);
export const prop_strokeWidth = atom(BORDER_WIDTH_LIST[1]);
export const prop_textColor = atom([...DEFAULT_COLORS[0], 1]);

export const prop_fontSize = atom(FONT_SIZES[2].value);
export const prop_fontFamily = atom(FONT_FAMILY_LIST[0].value);

export const prop_textAlign = atom(TEXT_ALIGNS[1].value);
//
