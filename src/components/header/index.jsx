import clsx from "clsx";
import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 z-50 p-2">
      <button
        className="bg-tool dark:bg-tool-dark text-white text-center w-12 h-12 rounded-full shadow-xl focus:bg-primary-500 focus:text-white block transition-all"
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => {
            setOpen(false);
          }, 150);
        }}
      >
        M
      </button>
      <menu
        className={clsx(
          "absolute top-full bg-zinc-200 dark:bg-zinc-800 z-50 items-center rounded-md shadow-xl min-w-56 right-2 transition-all",
          {
            "invisible -translate-y-2 opacity-0": !open,
          }
        )}
      >
        <ul className="p-4">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </menu>
    </header>
  );
};

export default Header;
