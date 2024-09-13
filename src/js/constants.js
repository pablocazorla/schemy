export const STATUS_MODES = {
  DRAWING: "DRAWING",
  ONSTAGE: "ONSTAGE",
  TEXT_WRITING: "TEXT_WRITING",
};
export const STAGE_NAME = "STAGE_MAIN";
export const ELEMENT_SELECTABLE_BY_GROUP_NAME = "SELECTABLE_BY_GROUP";
export const ELEMENT_SELECTABLE_BY_CLICK_NAME = "SELECTABLE_BY_CLICK";

export const CORNER_RADIUS = 10;

export const SELECTION_RECTANGLE_ATTRIBUTES = {};
export const TRANSFORMER_ATTRIBUTES = {
  ignoreStroke: true,
  padding: 4,
  rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315],
  flipEnabled: false,
  keepRatio: false,
  enabledAnchors: ["bottom-center", "bottom-right", "middle-right"],
};

export const SNAP_SIZE = 20;

export const TOOLS_PAD_WIDTH = 255;
export const TOOLS_PAD_PADDING_X = 8;
export const TOOLS_PAD_PADDING_Y = 70;

export const DEFAULT_COLORS = [
  [1, 100, 50],
  [30, 100, 50],
  [80, 100, 50],
  [150, 100, 50],
  [200, 100, 50],
];

export const DEFAULT_OPACITIES = [0.1, 0.25, 0.5, 0.75, 1];
export const DEFAULT_OPACITY_FILL = 0.5;

export const FONT_FAMILY_LIST = [
  { label: "Arial", value: "Arial" },
  { label: "Helvetica", value: "Helvetica" },
  { label: "Verdana", value: "Verdana" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
];

export const FONT_FAMILY_NAMES = FONT_FAMILY_LIST.reduce((acc, curr) => {
  acc[curr.value] = curr.label;
  return acc;
}, {});

export const FONT_SIZES = [
  {
    label: "Extra Small",
    value: 10,
  },
  {
    label: "Small",
    value: 14,
  },
  {
    label: "Medium",
    value: 20,
  },
  {
    label: "Large",
    value: 28,
  },
  {
    label: "Extra Large",
    value: 34,
  },
  {
    label: "Biggest",
    value: 42,
  },
];
export const TEXT_ALIGNS = [
  {
    label: "Left",
    value: "left",
  },
  {
    label: "Center",
    value: "center",
  },
  {
    label: "Right",
    value: "right",
  },
];

export const BORDER_WIDTH_LIST = [0, 2, 4, 8, 12, 16];

/////////////////////////
