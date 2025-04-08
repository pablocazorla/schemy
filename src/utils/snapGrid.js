import { SNAP_SIZE } from "@/constants/app";

export const snapGrid = (value) => {
  return Math.round(value / SNAP_SIZE) * SNAP_SIZE;
};
