import { atom } from "nanostores";
import { STATUS_MODES } from "@/constants/app";

export const StatusMode = atom(STATUS_MODES.DRAWING);
export const StageDragging = atom(false);
export const ShowEditor = atom(false);
