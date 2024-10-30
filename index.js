import  { app, BrowserWindow } from 'electron';
import path from 'path'
function createWindow() {
    const win = new BrowserWindow({
        width: 1440,
        height: 1080,
        //frame: false,           // Disable window frame
        transparent: true,      // Make the window background transparent
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true, // Enable Developer Tools
        }
    })
    win.loadFile('index.html');
}
 
app.whenReady().then(createWindow)
