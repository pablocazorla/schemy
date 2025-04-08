import { useEffect, useMemo, useState } from "react";
import Icon from "@/react-components/icon";
import { prop_fontSize, prop_textAlign, prop_strokeWidth } from "@/js/store";
import { FONT_SIZES, TEXT_ALIGNS, BORDER_WIDTH_LIST } from "@/js/constants";

const ButtonOptions = ({ type }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (type === "fontSize") {
      prop_fontSize.subscribe((value) => {
        setVal(value);
      });
    }
    if (type === "textAlign") {
      prop_textAlign.subscribe((value) => {
        setVal(value);
      });
    }
    if (type === "strokeWidth") {
      prop_strokeWidth.subscribe((value) => {
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
            prop_fontSize.set(op.value);
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
            prop_textAlign.set(op.value);
          },
        };
      });
    }
    if (type === "strokeWidth") {
      return BORDER_WIDTH_LIST.map((value) => {
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
            prop_strokeWidth.set(value);
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
            className={
              " rounded w-7 h-7 border " +
              (val === value
                ? " tool-2-focus_focus border-gray-500"
                : "tool-2 border-transparent")
            }
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
