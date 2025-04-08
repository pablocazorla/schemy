import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/icon";
import { FontFamily, Italic } from "@/store/element-props";
import { FONT_FAMILIES } from "@/constants/element-props";
import clsx from "clsx";

const FONT_FAMILY_NAMES = FONT_FAMILIES.reduce((acc, curr) => {
  acc[curr.value] = curr.label;
  acc[curr.value + "_italic"] = curr.label;
  return acc;
}, {});

const FontFamilyInput = () => {
  const [currentClassFamily, setCurrentClassFamily] = useState(null);
  const [name, setName] = useState("");
  const [isItalic, setIsItalic] = useState(Italic.get());

  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    FontFamily.subscribe((value) => {
      setCurrentClassFamily(`font-${value.split("_")[0]}`);
      setName(FONT_FAMILY_NAMES[value]);
    });
    Italic.subscribe((value) => {
      setIsItalic(value);
    });
  }, []);

  const options = useMemo(() => {
    return FONT_FAMILIES.map((op) => {
      return {
        ...op,
        style: { fontFamily: op.value },
        classFamily: `font-${op.value}`,
        onClick: () => {
          FontFamily.set(op.value + (isItalic ? "_italic" : ""));
        },
      };
    });
  }, [isItalic]);

  return (
    <div className="relative">
      <button
        className={clsx(
          "bg-zinc-200 dark:bg-zinc-800 py-1 px-2 relative w-full text-left flex items-center justify-between",
          {
            rounded: !isFocus,
            "rounded-t bg-zinc-900": isFocus,
          }
        )}
        onFocus={() => {
          setIsFocus(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            setIsFocus(false);
          }, 150);
        }}
      >
        <div className={currentClassFamily}>{name}</div>
        <Icon type="chevron-down" className={clsx({ "rotate-180": isFocus })} />
      </button>
      {isFocus ? (
        <div className="bg-zinc-300 dark:bg-zinc-900 w-full rounded-b shadow-xl">
          {options.map(({ label, value, classFamily, onClick }) => {
            return (
              <div
                className={`py-1 px-2 cursor-pointer hover:bg-primary-500/10 ${classFamily}`}
                key={value}
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

export default FontFamilyInput;
