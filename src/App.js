import React, { Component, Fragment } from "react";

class App extends Component {
  render() {
    const { path } = this.state;
    return (
      <Fragment>
        <header>
          <h1>Carlton's Utilities</h1>
        </header>
        <form>
          <div>
            <label htmlFor="item">Directory:</label>
            <input type="text" id="item" autoFocus value={path} size="80" />
          </div>
          <button type="submit" onClick={this.onClick}>
            Choose Directory
          </button>
        </form>
      </Fragment>
    );
  }
  state = { path: "" };

  componentDidMount = () => {
    window.ipcRenderer.on("set:dir", (e, item) => {
      this.setState({ path: item });
    });
  };

  onClick = e => {
    e.preventDefault();
    window.ipcRenderer.send("get:dir");
  };
}

export default App;
