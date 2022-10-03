// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
var exec = require('child_process').exec;

let prev_data = require('./list_users.json');

function monitor_json(data, prev_data) {
  for (var userName in data) {
    if (data.hasOwnProperty(userName) && prev_data.hasOwnProperty(userName)) {
      var userData = data[userName];
      var prevUserData = prev_data[userName];
      var has_user_data_changed = false;
      for (var key in userData) {
        if (userData[key] !== prevUserData[key]) {
          has_user_data_changed = true;
          break;
        }
      }

      if (has_user_data_changed) {
        console.log("Now autogenerating data for the users...");
        exec("python3 autogenerate_html.py list_users_second.json",
          function(error, stdout, stderr) {
            // console.log('stdout: ' + stdout);
            // console.log('stderr: ' + stderr);
            // console.log('error: ' + error);
          }
        );
        return data;
      }
      return prev_data;
    }
  }
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  app.on('ready', () => {
    console.log("Monitoring...");
    prev_data = monitor_json(require('./list_users.json'), prev_data);
    mainWindow.loadFile('index.html')
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
