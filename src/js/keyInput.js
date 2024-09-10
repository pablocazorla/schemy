import { atom } from "nanostores";

class KeyInput {
  constructor(target) {
    this.target = target || window;
  }
  onKeyPress(key, callback) {
    let keyIsDown = false;
    this.target.addEventListener("keydown", (e) => {
      if (e.key === key && !keyIsDown) {
        callback();
        keyIsDown = true;
      }
    });
    this.target.addEventListener("keyup", (e) => {
      if (e.key === key) {
        keyIsDown = false;
      }
    });
  }
  onKeyDown(key, callback) {
    this.onKeyPress(key, callback);
  }
  onKeyUp(key, callback) {
    this.target.addEventListener("keyup", (e) => {
      if (e.key === key) {
        callback();
      }
    });
  }
  onKeyCtrlPress(key, callback) {
    let ctrlIsDown = false;
    let keyIsDown = false;

    this.target.addEventListener("keydown", (e) => {
      if ((e.key === "Control" || e.key === "Command") && !ctrlIsDown) {
        ctrlIsDown = true;
      }
      if (e.key === key && !keyIsDown && ctrlIsDown) {
        callback();
        keyIsDown = true;
      }
    });
    this.target.addEventListener("keyup", (e) => {
      if (e.key === "Control" || e.key === "Command") {
        ctrlIsDown = false;
      }
      if (e.key === key) {
        keyIsDown = false;
      }
    });
  }
}

export default KeyInput;
