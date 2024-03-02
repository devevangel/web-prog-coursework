class AppState {
  constructor(initState) {
    this.state = initState;
  }

  setAppState(newState) {
    this.appState = newState;
  }
}

const appState = new AppState({
  theme: "light",
});

export default appState;
