import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/icon";
import { FontSize, TextAlign, StrokeWidth } from "@/store/element-props";
import {
  FONT_SIZES,
  TEXT_ALIGNS,
  BORDER_WIDTHS,
} from "@/constants/element-props";
import clsx from "clsx";

const ButtonOptions = ({ type }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (type === "fontSize") {
      FontSize.subscribe((value) => {
        setVal(value);
      });
    }
    if (type === "textAlign") {
      TextAlign.subscribe((value) => {
        setVal(value);
      });
    }
    if (type === "strokeWidth") {
      StrokeWidth.subscribe((value) => {
        setVal(value);
      });
    }
  }, [type]);

  const options = useMemo(() => {
    if (type === "fontSize") {
      return FONT_SIZES.map((op) => {
        return {
          ...op,
          text: "Aa",
          icon: null,
          style: { fontSize: `${op.value / 2}px` },
          onClick: () => {
            FontSize.set(op.value);
          },
        };
      });
    }
    if (type === "textAlign") {
      return TEXT_ALIGNS.map((op) => {
        return {
          ...op,
          text: null,
          icon: `text-${op.value}`,
          style: null,
          onClick: () => {
            TextAlign.set(op.value);
          },
        };
      });
    }
    if (type === "strokeWidth") {
      return BORDER_WIDTHS.map((value) => {
        return {
          value,
          text: value ? (
            <div
              className="border border-gray-500 w-4 mx-auto rounded-full"
              style={{ borderWidth: `${0.5 * value}px` }}
            ></div>
          ) : null,
          icon: value ? null : "close",
          style: null,
          onClick: () => {
            StrokeWidth.set(value);
          },
        };
      });
    }
    return [];
  }, [type]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map(({ label, value, text, icon, style, onClick }) => {
        return (
          <button
            className={clsx(
              "bg-zinc-200 dark:bg-zinc-800 rounded w-7 h-7 border",
              {
                "border-transparent": val !== value,
                "border-primary-500": val === value,
              }
            )}
            key={value}
            style={style}
            onClick={onClick}
            title={label}
          >
            {text ? text : null}
            {icon ? <Icon type={icon} /> : null}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonOptions;
