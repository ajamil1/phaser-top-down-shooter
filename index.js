import  { app, BrowserWindow } from 'electron';
import path from 'path'
function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true, // Enable Developer Tools
        }
    })
    win.loadFile('index.html');
}
 
app.whenReady().then(createWindow)
