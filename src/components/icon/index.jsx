import clsx from "clsx";
import listIcons from "./list";

const Icon = ({ type = "close",className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={clsx("inline-block",className)}
    >
      {listIcons[type] || listIcons.close}
    </svg>
  );
};
export default Icon;
