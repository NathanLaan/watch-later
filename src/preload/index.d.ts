import { ElectronAPI } from '@electron-toolkit/preload'

export interface FormatInfo {
  height: number
  label: string
}

export interface ProgressInfo {
  percent: number
  speed: string
  eta: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getFormats: (url: string) => Promise<FormatInfo[]>
      startDownload: (url: string, height: number, outputDir: string) => Promise<{ downloadId: string }>
      cancelDownload: (downloadId: string) => Promise<void>
      selectDownloadFolder: () => Promise<string | null>
      getDownloadFolder: () => Promise<string>
      onProgress: (callback: (progress: ProgressInfo) => void) => () => void
      onComplete: (callback: (filePath: string) => void) => () => void
      onError: (callback: (error: string) => void) => () => void
    }
  }
}
