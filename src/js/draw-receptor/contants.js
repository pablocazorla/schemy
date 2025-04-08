import { SNAP_SIZE } from "@/constants/app";

export const STROKE_RECEPTOR_RADIUS = 6;
export const STROKE_RECEPTOR_COLOR = "#0F0";
export const MIN_DRAWING_RECEPTOR_SIZE = 2 * SNAP_SIZE;
export const MINICANVAS_SIZE = 20;
export const DEFAULT_BOUNDARIES = {
  xMin: 999999,
  yMin: 999999,
  xMax: -999999,
  yMax: -999999,
};
export const MODEL_INFO = {
  model: "/draw-ai-model/model.json",
  metadata: "/draw-ai-model/model_meta.json",
  weights: "/draw-ai-model/model.weights.bin",
};
