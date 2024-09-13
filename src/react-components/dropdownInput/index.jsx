import { useEffect, useMemo, useState } from "react";
import Icon from "@/react-components/icon";
import { prop_fontFamily } from "@/js/store";
import { FONT_FAMILY_NAMES, FONT_FAMILY_LIST } from "@/js/constants";

const DropdownInput = ({ type }) => {
  const [style, setStyle] = useState(null);
  const [val, setVal] = useState("");

  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (type === "fontFamily") {
      prop_fontFamily.subscribe((value) => {
        setStyle({ fontFamily: value });
        setVal(FONT_FAMILY_NAMES[value]);
      });
    }
  }, [type]);

  const options = useMemo(() => {
    if (type === "fontFamily") {
      return FONT_FAMILY_LIST.map((op) => {
        return {
          ...op,
          style: { fontFamily: op.value },
          onClick: () => {
            prop_fontFamily.set(op.value);
          },
        };
      });
    }
    return [];
  }, [type]);

  return (
    <div className="relative">
      <button
        className="tool-2 tool-2-focus rounded py-1 px-2 relative w-full text-left flex items-center justify-between"
        onFocus={() => {
          setIsFocus(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            setIsFocus(false);
          }, 150);
        }}
      >
        <div className="" style={style}>
          {val}
        </div>
        <Icon type="chevron-down" />
      </button>
      {isFocus ? (
        <div className="tool-2 absolute top-full left-0 w-full rounded shadow-xl">
          {options.map(({ label, value, style, onClick }) => {
            return (
              <div
                className="py-1 px-2 cursor-pointer hover:bg-orange-500/10"
                key={value}
                style={style}
                onClick={onClick}
              >
                {label}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default DropdownInput;
