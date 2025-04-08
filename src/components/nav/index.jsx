import { STATUS_MODES } from "@/constants/app";
import { StatusMode, ShowEditor } from "@/store/app";
import useStore from "@/hooks/useStore";
import clsx from "clsx";

const Nav = ({ children }) => {
  const [statusApp, setStatusApp] = useStore(StatusMode);
  const [isShowingEditor, setIsShowingEditor] = useStore(ShowEditor);

  return (
    <nav className="fixed top-0 left-0 z-50 flex gap-2 items-center p-2">
      <button
        className={clsx(
          "text-center w-12 h-12 rounded-full shadow-xl block transition-color",
          {
            "bg-tool dark:bg-tool-dark": !isShowingEditor,
            "bg-primary-500 text-white": isShowingEditor,
          }
        )}
        onClick={() => {
          setIsShowingEditor(!isShowingEditor);
        }}
      >
        T
      </button>
      <button
        className={clsx(
          "text-center w-12 h-12 rounded-full shadow-xl block transition-color",
          {
            "bg-tool dark:bg-tool-dark": statusApp !== STATUS_MODES.DRAWING,
            "bg-primary-500 text-white": statusApp === STATUS_MODES.DRAWING,
          }
        )}
        onClick={() => {
          if (statusApp === STATUS_MODES.ONSTAGE) {
            setStatusApp(STATUS_MODES.DRAWING);
          } else {
            setStatusApp(STATUS_MODES.ONSTAGE);
          }
        }}
      >
        D
      </button>
    </nav>
  );
};

export default Nav;
