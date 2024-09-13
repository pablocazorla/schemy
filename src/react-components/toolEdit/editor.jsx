import Label from "@/react-components/label";
import ColorInput from "@/react-components/colorInput";
import { prop_fillColor, prop_strokeColor, prop_textColor } from "@/js/store";
import DropdownInput from "@/react-components/dropdownInput";
import ButtonOptions from "@/react-components/buttonOptions";

const Editor = () => {
  return (
    <div className="text-sm">
      <div className="mb-4">
        <Label htmlFor="" text="Background" />
        <ColorInput colorProp={prop_fillColor} propToUpdate="fill" />
      </div>
      <hr className="separator mb-4" />
      <div className="mb-4">
        <Label htmlFor="" text="Border color" />
        <ColorInput colorProp={prop_strokeColor} propToUpdate="stroke" />
      </div>
      <div className="mb-4">
        <Label htmlFor="" text="Border Width" />
        <ButtonOptions type="strokeWidth" />
      </div>
      <hr className="separator mb-4" />
      <div className="mb-4">
        <Label htmlFor="" text="Text color" />
        <ColorInput colorProp={prop_textColor} propToUpdate="textFill" />
      </div>
      <div className="mb-4">
        <Label htmlFor="" text="Font Family" />
        <DropdownInput type="fontFamily" />
      </div>

      <div className="mb-4">
        <Label htmlFor="" text="Font Size" />
        <ButtonOptions type="fontSize" />
      </div>
      <div className="flex gap-4 justify-between">
        <div className="mb-4">
          <Label htmlFor="" text="Text Align" />
          <ButtonOptions type="textAlign" />
        </div>
        <div className="mb-4">
          <Label htmlFor="" text="Style" />
          <ButtonOptions type="asds" />
        </div>
      </div>
    </div>
  );
};

export default Editor;
