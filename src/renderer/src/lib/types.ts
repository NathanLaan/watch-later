export interface FormatInfo {
  height: number
  label: string
}

export interface ProgressInfo {
  percent: number
  speed: string
  eta: string
}

export type DownloadState = 'idle' | 'fetching-formats' | 'ready' | 'downloading' | 'complete' | 'error'
