import { ipcMain, shell } from 'electron'

ipcMain.on('open-in-browser', (event, params) => {
  shell.openExternal(params.url)
})
