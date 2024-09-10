import { useCallback, useEffect, useMemo, useState } from "react";
import MoreColorsPad from "./moreColorsPad";
import ButtonColor from "./buttonColor";
import useAtomProp from "../../hooks/useAtomProp";
import { prop_colorCollection } from "@/js/store";

const ColorInput = ({ colorProp }) => {
  const [colorValue, onChangeColor] = useAtomProp(colorProp);
  const [defaultColors] = useAtomProp(prop_colorCollection);

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
          {defaultColors.map((btnCol, i) => {
            if (i >= 5) {
              return null;
            }
            return (
              <ButtonColor
                key={i}
                btnCol={btnCol}
                opacity={opacity}
                color={color}
                setColor={setColor}
              />
            );
          })}
        </div>
        <div className="border-l border-gray-500 h-5" />
        <button
          className={`w-5 h-5 rounded${moreColorsOpen ? " bg-base" : ""}`}
          onClick={() => {
            setMoreColorsOpen(true);
          }}
        >
          +
        </button>
      </div>
      {moreColorsOpen ? (
        <MoreColorsPad
          opacity={opacity}
          color={color}
          setColor={setColor}
          setOpacity={setOpacity}
          setMoreColorsOpen={setMoreColorsOpen}
        />
      ) : null}
    </div>
  );
};

export default ColorInput;
