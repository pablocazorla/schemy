import { atom } from "nanostores";
import { STATUS_MODES } from "@/js/constants";

export const StatusMode = atom(STATUS_MODES.DRAWING);
export const StageDraggable = atom(false);
//
export const showFloatTools = atom(false);
//
export const prop_fill = atom("hsla(150, 100%, 50%, 0.3)");
export const prop_stroke = atom("hsla(150, 100%, 50%, 1)");
export const prop_fontSize = atom(24);
export const prop_fontFamily = atom("Arial");
export const prop_textColor = atom("hsla(150, 100%, 50%, 1)");
export const prop_textAlign = atom("center");
