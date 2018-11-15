import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

class Photos extends Component {
  state = { path: "tbd", error: null };
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
          {this.state.error && (
            <Typography color="secondary" variant="h6" component="h6">
              {this.state.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={this.onSelectDirectory}>
            Change Selected Directory
          </Button>
          <Button size="small" color="primary" onClick={this.onProcessPhotos}>
            Process Photos
          </Button>
          {this.state.error && (
            <Button size="small" color="secondary" onClick={this.onClearError}>
              Clear Error
            </Button>
          )}
        </CardActions>
      </Card>
    );
  }

  componentDidMount = () => {
    window.ipcRenderer.on("photos:set:dir", (e, item) => {
      this.setState({ path: item });
    });
    window.ipcRenderer.on("photos:error", (e, error) => {
      this.setState({ error });
    });
  };

  onSelectDirectory = e => {
    e.preventDefault();
    window.ipcRenderer.send("photos:get:dir");
  };

  onProcessPhotos = e => {
    e.preventDefault();
    window.ipcRenderer.send("photos:process", this.state.path);
  };

  onClearError = e => {
    e.preventDefault();
    this.setState({ error: null });
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
