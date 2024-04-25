class AppState {
  constructor() {
    this.state = {
      path: '/',
      user: {},
    };
  }

  upateState(key, value) {
    this.state[key] = value;
    this.saveState();
  }

  saveState() {
    localStorage.setItem('state', JSON.stringify(this.state));
  }

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

  viewState() {
    console.log(this.state);
  }
}

const appState = new AppState();
appState.loadState();

export default appState;
