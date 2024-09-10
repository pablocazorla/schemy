import { useCallback, useEffect, useRef, useState } from "react";
import {
  TOOLS_PAD_WIDTH,
  TOOLS_PAD_PADDING_X,
  TOOLS_PAD_PADDING_Y,
} from "@/js/constants";
import { showEditTools } from "@/js/store";
import Editor from "./editor";

const ToolEdit = () => {
  const padRef = useRef(null);
  const headerRef = useRef(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let left = TOOLS_PAD_PADDING_X;
    let top = TOOLS_PAD_PADDING_Y;
    let initialX = 0;
    let initialY = 0;
    let dragging = false;

    const $pad = padRef.current;
    const $header = headerRef.current;

    const onMouseDown = (e) => {
      initialX = e.pageX;
      initialY = e.pageY;

      dragging = true;
    };
    const onMouseMove = (e) => {
      if (dragging) {
        let dx = Math.max(left + e.pageX - initialX, TOOLS_PAD_PADDING_X);
        let dy = Math.max(top + e.pageY - initialY, TOOLS_PAD_PADDING_Y);

        dx = Math.min(
          dx,
          window.innerWidth - (TOOLS_PAD_WIDTH + TOOLS_PAD_PADDING_X)
        );
        dy = Math.min(dy, window.innerHeight - TOOLS_PAD_PADDING_Y);

        $pad.style.left = `${dx}px`;
        $pad.style.top = `${dy}px`;
      }
    };
    const onMouseUp = (e) => {
      if (!dragging) {
        return;
      }
      dragging = false;
      left += e.pageX - initialX;
      top += e.pageY - initialY;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    $header.addEventListener("mousedown", onMouseDown);

    //
    showEditTools.subscribe((show) => {
      setVisible(show);
    });
    //

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      $header.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  const onClose = useCallback(() => {
    showEditTools.set(false);
  }, []);

  return (
    <div
      className={
        "fixed z-[100] tool rounded-md shadow-2xl w-72 min-h-20 transition-opacity" +
        (visible ? " opacity-100 visible" : " opacity-0 invisible")
      }
      style={{
        width: TOOLS_PAD_WIDTH,
        top: TOOLS_PAD_PADDING_Y,
        left: TOOLS_PAD_PADDING_X,
      }}
      ref={padRef}
    >
      <header
        className="tool-2 py-1 px-4 rounded-t-md cursor-move select-none flex items-center justify-between"
        ref={headerRef}
      >
        <div className="">Tools</div>
        <div className="">
          <button className="" onClick={onClose}>
            x
          </button>
        </div>
      </header>
      <div className="py-2 px-4">
        <div className="max-h-[calc(100dvh-126px)] overflow-y-auto overflow-x-hidden">
          <Editor />
        </div>
      </div>
    </div>
  );
};

export default ToolEdit;
