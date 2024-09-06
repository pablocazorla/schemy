class GlobalKeyInput {
  constructor() {
    this.keyInputs = {};

    window.addEventListener("keypress", (e) => {
      console.log(e.key);
    });
  }
}

export default GlobalKeyInput;
