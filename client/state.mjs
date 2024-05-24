class AppState {
  constructor() {
    this.state = {
      path: '/',
      user: {},
    };
  }

  // updates data in localstorage
  upateState(key, value) {
    this.state[key] = value;
    this.saveState();
  }

  // Saves data to localstorage
  saveState() {
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  // Loads data from localstorage
  loadState() {
    const stateStr = localStorage.getItem('state');
    const parsedState = JSON.parse(stateStr);
    if (parsedState?.user) {
      this.state = {
        ...parsedState,
      };
    } else {
      this.state = {
        path: '/',
        user: {},
      };
    }
  }
}

const appState = new AppState();
appState.loadState();

export default appState;
