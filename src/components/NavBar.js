import React, { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
const NavBar = () => {
  return (
    <Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Carlton's Utilities
          </Typography>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
};
export default NavBar;
