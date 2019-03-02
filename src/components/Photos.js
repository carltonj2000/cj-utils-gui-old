import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import CircularProgress from "@material-ui/core/CircularProgress";

const debug = true;

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 100
  },
  noNewLine: {
    display: "inline-block"
  },
  label: {
    display: "inline-block",
    marginRight: "10px"
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
});

class Photos extends Component {
  state = {
    path: "",
    error: null,
    total: 0,
    extractRaw: 0,
    convert: 0,
    resolution: "1620x1080",
    running: false
  };
  render() {
    const { classes } = this.props;
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            Raw Photo Processing
          </Typography>
          <div>
            <Typography className={classes.label} variant="h6" component="h6">
              Selected Directory:
            </Typography>
            <Typography
              className={classes.noNewLine}
              color="secondary"
              component="span"
            >
              {this.state.path}
            </Typography>
          </div>
          {this.state.error ? (
            <Typography color="secondary" variant="h6" component="h6">
              {this.state.error}
            </Typography>
          ) : null}
          {this.state.total ? (
            <Typography color="primary">
              Raw Extracted: {this.state.extractRaw} / {this.state.total}
            </Typography>
          ) : null}
          {this.state.total ? (
            <Typography color="primary">
              Resized: {this.state.convert} / {this.state.total}
            </Typography>
          ) : null}
          {this.state.running ? (
            <CircularProgress className={classes.progress} />
          ) : null}
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
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="resolution">Resolution</InputLabel>
            <Select
              value={this.state.resolution}
              onChange={this.handleChange}
              input={<Input name="resolution" id="resolution" />}
              autoWidth
            >
              <MenuItem value="1024x768">1024x768</MenuItem>
              <MenuItem value="1620x1080">1620x1080</MenuItem>
              <MenuItem value="1920x1280">1920x1280</MenuItem>
            </Select>
          </FormControl>
          {debug ? (
            <Button size="small" color="primary" onClick={this.onReset}>
              Reset
            </Button>
          ) : null}
        </CardActions>
      </Card>
    );
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  componentDidMount = () => {
    window.ipcRenderer.on("photos:set:dir", (e, item, arg) => {
      if (debug) item = "/Users/carltonjoseph/160_1212";
      this.setState({ path: item });
    });
    window.ipcRenderer.on("photos:error", (e, error) =>
      this.setState({ error, running: false })
    );
    window.ipcRenderer.on("photos:status:total", (e, total) =>
      this.setState({ total })
    );
    window.ipcRenderer.on("photos:status:extractRaw", (e, extractRaw) =>
      this.setState({ extractRaw })
    );
    window.ipcRenderer.on("photos:status:convert", (e, convert) =>
      this.setState(state => ({ convert: state.convert + convert }))
    );
    window.ipcRenderer.on("photos:status:finished", () =>
      this.setState({ running: false })
    );
    window.ipcRenderer.send("photos:gui:ready");
  };

  onSelectDirectory = e => window.ipcRenderer.send("photos:get:dir");
  onReset = e => window.ipcRenderer.send("photos:reset", this.state.path);
  onProcessPhotos = e => {
    this.setState({ total: 0, extractRaw: 0, convert: 0, running: true });
    const { path, resolution } = this.state;
    window.ipcRenderer.send("photos:process", path, resolution);
  };
  onClearError = e => this.setState({ error: null });
}

export default withStyles(styles)(Photos);
