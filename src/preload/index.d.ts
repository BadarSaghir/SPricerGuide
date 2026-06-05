import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
 type  SystemInfo =  Systeminformation.StaticData & Systeminformation.DynamicData


  interface Window {
    electron: ElectronAPI
    api: {
      
      getSystemInfo:()=> Promise<Systeminformation.StaticData & Systeminformation.DynamicData>
    }
  }
}
