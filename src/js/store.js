import { atom } from "nanostores";
import { STATUS_MODES } from "@/js/constants";

export const StatusMode = atom(STATUS_MODES.DRAWING);

export const showFloatTools = atom(false);
