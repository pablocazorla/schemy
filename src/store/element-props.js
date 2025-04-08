import { atom } from "nanostores";
import {
  DEFAULT_COLORS,
  DEFAULT_FILL_OPACITY,
  BORDER_WIDTHS,
  FONT_SIZES,
  FONT_FAMILIES,
  TEXT_ALIGNS,
} from "@/constants/element-props";

// ALL
export const ColorCollection = atom(DEFAULT_COLORS);

// SHAPE
export const FillColor = atom([...DEFAULT_COLORS[4], DEFAULT_FILL_OPACITY]);
export const StrokeColor = atom([...DEFAULT_COLORS[1], 1]);
export const StrokeWidth = atom(BORDER_WIDTHS[2]);

// TEXT

export const TextColor = atom([...DEFAULT_COLORS[2], 1]);
export const FontSize = atom(FONT_SIZES[2].value);
export const FontFamily = atom(FONT_FAMILIES[0].value);
export const Italic = atom(false);
export const Bold = atom(false);

export const TextAlign = atom(TEXT_ALIGNS[1].value);
