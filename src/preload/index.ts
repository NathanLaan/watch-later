import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export interface FormatInfo {
  height: number
  label: string
}

export interface ProgressInfo {
  percent: number
  speed: string
  eta: string
}

const api = {
  getFormats: (url: string): Promise<FormatInfo[]> => ipcRenderer.invoke('get-formats', url),

  startDownload: (
    url: string,
    height: number,
    outputDir: string
  ): Promise<{ downloadId: string }> =>
    ipcRenderer.invoke('start-download', url, height, outputDir),

  cancelDownload: (downloadId: string): Promise<void> =>
    ipcRenderer.invoke('cancel-download', downloadId),

  selectDownloadFolder: (): Promise<string | null> =>
    ipcRenderer.invoke('select-download-folder'),

  getDownloadFolder: (): Promise<string> => ipcRenderer.invoke('get-download-folder'),

  onProgress: (callback: (progress: ProgressInfo) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, progress: ProgressInfo): void =>
      callback(progress)
    ipcRenderer.on('download-progress', handler)
    return () => ipcRenderer.removeListener('download-progress', handler)
  },

  onComplete: (callback: (filePath: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, filePath: string): void =>
      callback(filePath)
    ipcRenderer.on('download-complete', handler)
    return () => ipcRenderer.removeListener('download-complete', handler)
  },

  onError: (callback: (error: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, error: string): void => callback(error)
    ipcRenderer.on('download-error', handler)
    return () => ipcRenderer.removeListener('download-error', handler)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
