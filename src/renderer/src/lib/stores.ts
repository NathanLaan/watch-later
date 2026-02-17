import { writable } from 'svelte/store'
import type { FormatInfo, DownloadState, ProgressInfo } from './types'

export const url = writable('')
export const formats = writable<FormatInfo[]>([])
export const selectedHeight = writable<number | null>(null)
export const downloadState = writable<DownloadState>('idle')
export const progress = writable<ProgressInfo>({ percent: 0, speed: '', eta: '' })
export const errorMessage = writable('')
export const downloadFolder = writable('')
export const downloadId = writable<string | null>(null)
export const completedFilePath = writable('')
