import { hexToHSLarray, HSLarrayToHex } from "@/utils/colorHSLarray";
import ButtonOpacity from "./buttonOpacity";
import ButtonColor from "./buttonColor";
import Label from "@/components/label";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_FILL_OPACITIES } from "@/constants/element-props";
import { COLOR_SWATCH_COUNT } from "@/constants/editor";
import { ColorCollection } from "@/store/element-props";
import useStore from "@/hooks/useStore";
import Icon from "@/components/icon";

const MoreColorsPad = ({
  opacity,
  color,
  setColor,
  setOpacity,
  setMoreColorsOpen,
  editOpacity,
}) => {
  const padRef = useRef(null);
  const [colorList, setColorList] = useStore(ColorCollection);

  useEffect(() => {
    let overPad = true;
    const $pad = padRef.current;
    const clickOverPad = () => {
      overPad = true;
    };
    const clickOverWindows = () => {
      if (!overPad) {
        setMoreColorsOpen(false);
      }
      overPad = false;
    };

    $pad.addEventListener("click", clickOverPad);
    window.addEventListener("click", clickOverWindows);

    return () => {
      $pad.removeEventListener("click", clickOverPad);
      window.removeEventListener("click", clickOverWindows);
    };
  }, [setMoreColorsOpen]);

  const [newColor, setNewColor] = useState([0, 0, 0]);

  return (
    <div
      className="bg-white dark:bg-zinc-800 rounded p-2 relative more-colors"
      ref={padRef}
    >
      <div className="flex flex-wrap items-center gap-2">
        {colorList.map((btnCol, i) => {
          if (i < COLOR_SWATCH_COUNT) {
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
        <div className="relative cursor-pointer">
          <div className="w-5 h-5  border border-gray-500 rounded flex items-center justify-center">
            <Icon type="plus" />
          </div>
          <input
            type="color"
            value={HSLarrayToHex(newColor)}
            className="border-0 w-5 h-5 block p-0 m-0 absolute top-0 left-0 opacity-0 cursor-pointer"
            title="Agregar color"
            onInput={(e) => {
              const newColor = hexToHSLarray(e.target.value);
              //console.log(e.target.value);
              setColor(newColor);
            }}
            onChange={(e) => {
              const newColor = hexToHSLarray(e.target.value);
              setNewColor(newColor);
            }}
            onBlur={(e) => {
              setColor(newColor);
              setColorList([newColor, ...colorList]);
            }}
          />
        </div>
      </div>
      {editOpacity ? (
        <div className="mt-2">
          <Label text="Opacity" />
          <div className="flex items-center gap-2">
            {DEFAULT_FILL_OPACITIES.map((btnOp, i) => {
              return (
                <ButtonOpacity
                  key={i}
                  btnOp={btnOp}
                  color={color}
                  opacity={opacity}
                  setOpacity={setOpacity}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default MoreColorsPad;
