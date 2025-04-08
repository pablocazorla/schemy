import { useCallback, useEffect, useRef, useState } from "react";
import { ShowEditor } from "@/store/app";
import { WIDTH, TOP, LEFT } from "@/constants/editor";
import useStore from "@/hooks/useStore";
import Icon from "../icon";
import Editor from "./editor";

const EditorContainer = () => {
  const padRef = useRef(null);
  const headerRef = useRef(null);

  const [visible, setVisible] = useStore(ShowEditor);

  useEffect(() => {
    let left = LEFT;
    let top = TOP;
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
        let dx = Math.max(left + e.pageX - initialX, LEFT);
        let dy = Math.max(top + e.pageY - initialY, TOP);

        dx = Math.min(dx, window.innerWidth - (WIDTH + LEFT));
        dy = Math.min(dy, window.innerHeight - TOP);

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

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      $header.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return (
    <div
      className={
        "bg-tool dark:bg-tool-dark fixed z-[100] rounded-md shadow-2xl w-72 transition-opacity" +
        (visible ? " opacity-100 visible" : " opacity-0 invisible")
      }
      style={{
        width: WIDTH,
        top: TOP,
        left: LEFT,
      }}
      ref={padRef}
    >
      <header
        className="bg-black/10 px-4 rounded-t-md cursor-move select-none flex items-center justify-between"
        ref={headerRef}
      >
        <div className="text-xs opacity-50">Properties</div>
        <div className="">
          <button
            className="opacity-50 hover:opacity-100 transition-opacity"
            onClick={() => {
              setVisible(false);
            }}
          >
            <Icon />
          </button>
        </div>
      </header>
      <div className="py-2 pl-4 pr-1">
        <div className="max-h-[calc(100dvh-126px)] overflow-x-hidden overflow-y-scroll custom-scrollbar pr-3">
          <Editor />
        </div>
      </div>
    </div>
  );
};

export default EditorContainer;
