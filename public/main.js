const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  TouchBar,
  dialog
} = require("electron");
const { TouchBarButton, TouchBarLabel, TouchBarSpacer } = TouchBar;

const path = require("path");
const isDev = require("electron-is-dev");

const photos = require("./photos");

let mainWindow;
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

createWindow = () => {
  mainWindow = new BrowserWindow({
    title: "cj-utils",
    backgroundColor: "#F7F7F7",
    minWidth: 880,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/preload.js"
    },
    height: 860,
    width: 1280
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3210"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = require("electron-devtools-installer");

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log("An error occurred: ", err);
      });

    installExtension(REDUX_DEVTOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log("An error occurred: ", err);
      });
  }

  mainWindow.once("ready-to-show", () => {
    if (isDev) mainWindow.webContents.openDevTools();
    mainWindow.show();
    ipcMain.on("open-external-window", (event, arg) => {
      shell.openExternal(arg);
    });
  });
};

generateMenu = () => {
  const template = [
    {
      label: "File",
      role: "File",
      submenu: [{ role: "about" }, { role: "quit" }]
    },
    {
      role: "help",
      submenu: [
        {
          click() {
            require("electron").shell.openExternal(
              "https://github.com/carltonj2000/cj-utils"
            );
          },
          label: "Learn More"
        },
        {
          click() {
            require("electron").shell.openExternal(
              "https://github.com/carltonj2000/cj-utils/issues"
            );
          },
          label: "File Issue on GitHub"
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

app.on("ready", () => {
  createWindow();
  generateMenu();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("load-page", (event, arg) => {
  mainWindow.loadURL(arg);
});
ipcMain.on("photos:gui:ready", (event, arg) =>
  mainWindow.webContents.send("photos:set:dir", process.cwd(), arg)
);
ipcMain.on("photos:get:dir", () => {
  const dirs = dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"]
  });
  if (dirs && dirs.length > 0)
    mainWindow.webContents.send("photos:set:dir", dirs[0]);
});
ipcMain.on("photos:reset", (e, cwd) => photos.reset(cwd));
ipcMain.on("photos:process", (e, cwd, resolution) => {
  photos
    .develope(
      cwd,
      resolution,
      t => mainWindow.webContents.send("photos:status:total", t),
      r => mainWindow.webContents.send("photos:status:extractRaw", r),
      c => mainWindow.webContents.send("photos:status:convert", c)
    )
    .then(() => mainWindow.webContents.send("photos:status:finished"))
    .catch(
      e => console.log("e", e) || mainWindow.webContents.send("photos:error", e)
    );
});
