import React, { Component, Fragment } from "react";

import Photos from "./Photos";
import NavBar from "./NavBar";

class App extends Component {
  render() {
    return (
      <Fragment>
        <NavBar />
        <Photos />
      </Fragment>
    );
  }
}

export default App;
