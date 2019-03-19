const {app, BrowserWindow, Menu, Tray, ipcMain, Notification} = require('electron');
const path = require('path');
const Datastore = require('nedb');
let db = new Datastore({ filename: 'storage.db' });
db.loadDatabase(function (err) {
  console.log("Database loaded.");
});

app.setAppUserModelId("doteric.dotnotes");

/* Main Window Generation */
function createWindow () {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "./assets/icon-32x32.png"
  });
  win.loadURL("http://localhost:3000");

  let template = [{
    label: 'Basic',
    submenu: [
      {label: "v"+app.getVersion()},
      {type: "separator"},
      {label: "Close", role: "quit"}
    ]
  }];
  if (!app.isPackaged) {
    template.push({
      label: "Dev Tab",
      submenu: [
        {role: "reload"},
        {role: "toggledevtools"}
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
  let iconPath = path.join(__dirname, "assets/icon-32x32.png");
  let appTray = new Tray(iconPath);
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

/* ipc Listeners */
let winCatCreation;
ipcMain.on('getCategories', (event) => {
  db.find({}, function (err, docs) {
    event.sender.send("receiveCats", docs);
  });
});
ipcMain.on('newCat', () => {
  winCatCreation = new BrowserWindow({
    width: 300,
    height: 400
  });
  winCatCreation.loadURL("http://localhost:3000/catcreation");
});
ipcMain.on('addCategory', (event, catname) => {
  console.log(catname);
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = mm + '.' + dd + '.' + yyyy;
  db.insert({
    catname: catname,
    date: today
  }, function (err) {
    // Category inserted.
  });
  winCatCreation.close();
});
ipcMain.on('openCategory', (event, catid) => {
  let winCatOpen = new BrowserWindow({
    width: 700,
    height: 500
  });
  winCatOpen.loadURL("http://localhost:3000/catpage/"+catid);
});
ipcMain.on('removeCategory', (event, catid) => {
  db.remove({_id: catid}, {}, function (err, numRemoved) {
    // Category removed.
  });
});
ipcMain.on('getCategory', (event, catid) => {
  db.findOne({_id: catid}, function (err, docs) {
    event.sender.send("receiveCategory", docs);
  });
});

ipcMain.on('testNotif', () => {
  console.log("Notification should happen.");
  let myNotification = new Notification('Title', {
    body: 'Lorem Ipsum Dolor Sit Amet'
  })
  
  myNotification.onclick = () => {
    console.log('Notification clicked');
  }
});