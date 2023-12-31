import { contextBridge, ipcRenderer } from 'electron'
import { platform } from 'os'

import { ElectronAPI, electronAPI } from '@electron-toolkit/preload'

declare global {
  export interface Window {
    electron: ElectronAPI
    api: typeof api
  }
}

const api = {
  openInBrowser(params: { url: string }) {
    return ipcRenderer.send('open-in-browser', params)
  },
  onOauthToken: (callback: any) => ipcRenderer.on('oauth', callback),
  platform: platform(),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
