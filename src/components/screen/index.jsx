import { useEffect, useRef } from "react";
import Screen from "@/js/screen";
import DrawingReceptor from "@/js/draw-receptor";
import { STATUS_MODES } from "@/constants/app";
import { StatusMode } from "@/store/app";
import useStore from "@/hooks/useStore";
import clsx from "clsx";
import { SNAP_SIZE } from "@/constants/app";

const gridColor = "rgba(27,120,255,0.1)";

const ScreenComp = () => {
  const containerCanvasSchemeRef = useRef(null);
  const canvasIARef = useRef(null);
  const canvasDrawingRef = useRef(null);
  const canvasDrawReceiptRef = useRef(null);

  const [statusApp] = useStore(StatusMode);

  useEffect(() => {
    const screen = new Screen(containerCanvasSchemeRef.current);
    new DrawingReceptor(
      screen,
      canvasDrawReceiptRef.current,
      canvasDrawingRef.current,
      canvasIARef.current
    );
  }, []);

  return (
    <section
      className="relative w-dvw h-dvh overflow-hidden"
      style={{
        backgroundImage: `url('data:image/svg+xml;utf8,<svg width="${SNAP_SIZE}" height="${SNAP_SIZE}" viewBox="0 0 ${SNAP_SIZE} ${SNAP_SIZE}" version="1.1" xmlns="http://www.w3.org/2000/svg"  style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><rect x="0" y="0" width="${SNAP_SIZE}" height="1" style="fill:${gridColor};"/><rect x="0" y="1" width="1" height="${
          SNAP_SIZE - 1
        }" style="fill:${gridColor};"/></svg>')`,
      }}
    >
      <div ref={containerCanvasSchemeRef} />
      <div
        className={clsx(
          "absolute top-0 left-0 w-dvw h-dvh overflow-hidden z-20",
          {
            hidden: statusApp !== STATUS_MODES.DRAWING,
          }
        )}
      >
        <canvas
          className="absolute bottom-0 left-0 hidden"
          width="20"
          height="20"
          ref={canvasIARef}
        />
        <canvas
          className="absolute top-0 left-0 block"
          ref={canvasDrawingRef}
        />
        <canvas
          className="absolute top-0 left-0 block opacity-0"
          ref={canvasDrawReceiptRef}
        />
      </div>
    </section>
  );
};

export default ScreenComp;
