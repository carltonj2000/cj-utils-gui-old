import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

class Photos extends Component {
  state = { path: "tbd" };
  render() {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            Raw Photo Processing
          </Typography>
          <div>
            <Typography style={styles.label} variant="h6" component="h6">
              Selected Directory:
            </Typography>
            <Typography
              style={styles.directory}
              color="secondary"
              component="span"
            >
              {this.state.path}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={this.onClick}>
            Change Selected Directory
          </Button>
          <Button size="small" color="primary">
            Process Photos
          </Button>
        </CardActions>
      </Card>
    );
  }

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

const styles = {
  label: {
    display: "inline-block",
    marginRight: "10px"
  },
  directory: {
    display: "inline-block"
  }
};
export default Photos;
