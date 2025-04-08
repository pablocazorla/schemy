import { useCallback, useMemo, useState } from "react";
import MoreColorsPad from "./moreColorsPad";
import ButtonColor from "./buttonColor";
import useStore from "@/hooks/useStore";
import { ColorCollection } from "@/store/element-props";
import { COLOR_SWATCH_COUNT } from "@/constants/editor";
import Icon from "@/components/icon";
import clsx from "clsx";

const ColorInput = ({ colorProp, editOpacity }) => {
  const [colorValue, onChangeColor] = useStore(colorProp);
  const [colorList] = useStore(ColorCollection);

  const { color, opacity } = useMemo(() => {
    return {
      color: [colorValue[0], colorValue[1], colorValue[2]],
      opacity: colorValue[3],
    };
  }, [colorValue]);

  const [moreColorsOpen, setMoreColorsOpen] = useState(false);

  const setColor = useCallback(
    (newColor) => {
      onChangeColor([newColor[0], newColor[1], newColor[2], opacity]);
    },
    [opacity, onChangeColor]
  );
  const setOpacity = useCallback(
    (newOpacity) => {
      onChangeColor([color[0], color[1], color[2], newOpacity]);
    },
    [color, onChangeColor]
  );

  return (
    <div className="">
      <div className="flex items-start gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {colorList.map((btnCol, i) => {
            if (i >= COLOR_SWATCH_COUNT) {
              return null;
            }
            return (
              <ButtonColor
                key={i}
                btnCol={btnCol}
                color={color}
                setColor={setColor}
              />
            );
          })}
        </div>
        {/* <div className="border-l border-gray-500 h-5" /> */}
        <div className=" border-t border-transparent">
          <button
            className={`sborder border-gray-500 w-5 h-5 leading-none rounded${
              moreColorsOpen ? " bg-base" : ""
            }`}
            onClick={() => {
              setMoreColorsOpen(true);
            }}
          >
            <Icon type="plus" />
          </button>
          <div
            className={clsx(
              "w-0 h-0 border-x-8 border-b-8 border-x-transparent border-t-transparent border-b-white dark:border-b-zinc-800 mx-auto",
              {
                "opacity-0": !moreColorsOpen,
                "opacity-100": moreColorsOpen,
              }
            )}
          ></div>
        </div>
      </div>
      {moreColorsOpen ? (
        <MoreColorsPad
          opacity={opacity}
          color={color}
          setColor={setColor}
          setOpacity={setOpacity}
          setMoreColorsOpen={setMoreColorsOpen}
          editOpacity={editOpacity}
        />
      ) : null}
    </div>
  );
};

export default ColorInput;
