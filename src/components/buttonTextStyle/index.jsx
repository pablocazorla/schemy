import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/icon";
import {
  FontSize,
  TextAlign,
  StrokeWidth,
  Italic,
  Bold,
} from "@/store/element-props";
import {
  FONT_SIZES,
  TEXT_ALIGNS,
  BORDER_WIDTHS,
} from "@/constants/element-props";
import clsx from "clsx";
import useStore from "@/hooks/useStore";

const ButtonTextStyle = () => {
  const [isItalic, setIsItalic] = useStore(Italic);
  const [isBold, setIsBold] = useStore(Bold);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className={clsx(
          "bg-zinc-200 dark:bg-zinc-800 rounded w-7 h-7 border font-opensans_italic font-bold",
          {
            "border-transparent": !isItalic,
            "border-primary-500": isItalic,
          }
        )}
        onClick={() => {
          setIsItalic(!isItalic);
        }}
        title={"Italic"}
      >
        i
      </button>

      <button
        className={clsx(
          "bg-zinc-200 dark:bg-zinc-800 rounded w-7 h-7 border font-opensans font-bold",
          {
            "border-transparent": !isBold,
            "border-primary-500": isBold,
          }
        )}
        onClick={() => {
          setIsBold(!isBold);
        }}
        title={"Bold"}
      >
        B
      </button>
    </div>
  );
};

export default ButtonTextStyle;
