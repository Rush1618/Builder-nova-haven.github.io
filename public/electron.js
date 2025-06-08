const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
    },
    icon: path.join(__dirname, "icon.png"),
    titleBarStyle: "default",
    show: false, // Don't show until ready
  });

  // Load the app
  const startUrl = isDev
    ? "http://localhost:8080"
    : `file://${path.join(__dirname, "../dist/index.html")}`;

  mainWindow.loadURL(startUrl);

  // Show window when ready to prevent visual flash
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: Prevent new window creation
app.on("web-contents-created", (event, contents) => {
  contents.on("new-window", (navigationEvent, navigationURL) => {
    navigationEvent.preventDefault();
    require("electron").shell.openExternal(navigationURL);
  });
});

// Create application menu
const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Upload Syllabus",
        accelerator: "CmdOrCtrl+O",
        click: async () => {
          const { canceled, filePaths } = await dialog.showOpenDialog(
            mainWindow,
            {
              properties: ["openFile"],
              filters: [
                { name: "PDF Files", extensions: ["pdf"] },
                { name: "All Files", extensions: ["*"] },
              ],
            },
          );

          if (!canceled && filePaths.length > 0) {
            mainWindow.webContents.send("file-selected", filePaths[0]);
          }
        },
      },
      { type: "separator" },
      {
        label: "Exit",
        accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "About Ultimate Student Planner",
        click: () => {
          dialog.showMessageBox(mainWindow, {
            type: "info",
            title: "About",
            message: "Ultimate Student Planner",
            detail: "AI-powered study planning application\nVersion 1.0.0",
          });
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

module.exports = { mainWindow };
