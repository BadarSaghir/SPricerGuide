import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron/renderer'
import { Systeminformation } from 'systeminformation'


// Custom APIs for renderer
const api = {
  runStressTest: () => ipcRenderer.invoke('run-stress-test'),

  getSystemInfo: async (): Promise<Systeminformation.StaticData & Systeminformation.DynamicData> => {
    const raw = await ipcRenderer.invoke('get-system-info')
    // Validate and return typed data
    return raw
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
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
