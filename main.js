const {app, BrowserWindow, Menu, Tray} = require('electron');
function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "./assets/icon-32x32.png"
  });
  win.loadURL("http://localhost:3000");

  let template = [{
    label: 'Basic',
    submenu: [
      {label:'Hello :)'},
      {type: "separator"},
      {label: 'Exit', click() {
        app.quit();
      }}
    ]
  }];
  if (!app.isPackaged) {
    template.push({
      label: 'Dev',
      submenu: [
        {label:'Open Dev Tools', click() {
          win.webContents.openDevTools();
        }}
      ]
    });
  }
  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  win.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide();
    }
    return false;
  });
  appTray = new Tray("./assets/icon-32x32.png");
  appTray.setContextMenu(Menu.buildFromTemplate([
    {label: 'Open', click() {
      win.show();
    }},
    {type: 'separator'},
    {label: 'Exit', click() {
      app.isQuiting = true;
      app.quit();
    }}
  ]));
  appTray.setToolTip('dotnotes');
  appTray.on('double-click', () => {
    win.show();
  });
}
app.on('ready', createWindow);