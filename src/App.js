import React, { Component } from "react";
import "./App.css";

// const { ipcRenderer } = require("electron");
// const { ipcRenderer } = window.require("electron");

class App extends Component {
  render() {
    const { path } = this.state;
    console.log(window.require);
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Carlton's Utilities</h1>
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
      </div>
    );
  }
  state = { path: "" };
  /*
  componentDidMount = () => {
    ipcRenderer.on("set:dir", (e, item) => {
      this.setState({ path: item });
    });
  };

  onClick = e => {
    e.preventDefault();
    ipcRenderer.send("get:dir");
  };
  */
}

export default App;
