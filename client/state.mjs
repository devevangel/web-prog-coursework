class AppState {
  constructor() {
    this.state = {};
  }

  upateState(key, value) {
    this.state[key] = value;
    this.saveState();
  }

  saveState() {
    localStorage.setItem("state", JSON.stringify(this.state));
  }

  loadState() {
    const stateStr = localStorage.getItem("state");
    const parsedState = JSON.parse(stateStr);
    this.state = {
      ...parsedState,
    };
  }

  viewState() {
    console.log(this.state);
  }
}

const appState = new AppState();
appState.loadState();

export default appState;
