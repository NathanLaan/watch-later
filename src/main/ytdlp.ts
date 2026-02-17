import { app } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const YTDlpWrap = require('yt-dlp-wrap').default
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpegPath: string = require('ffmpeg-static')

export interface FormatInfo {
  height: number
  label: string
}

export interface ProgressData {
  percent: number
  speed: string
  eta: string
}

function getBinaryDir(): string {
  return app.getPath('userData')
}

function getBinaryPath(): string {
  const ext = process.platform === 'win32' ? '.exe' : ''
  return join(getBinaryDir(), `yt-dlp${ext}`)
}

export async function ensureBinary(): Promise<string> {
  const binaryPath = getBinaryPath()
  if (existsSync(binaryPath)) {
    return binaryPath
  }

  const releases = await YTDlpWrap.getGithubReleases(1, 1)
  await YTDlpWrap.downloadFromGithub(binaryPath, releases[0].tag_name)
  return binaryPath
}

export async function getFormats(url: string): Promise<FormatInfo[]> {
  const binaryPath = await ensureBinary()
  const ytdlp = new YTDlpWrap(binaryPath)

  const stdout = await ytdlp.execPromise([url, '--dump-json', '--no-playlist'])
  const info = JSON.parse(stdout)
  const formats: Map<number, FormatInfo> = new Map()

  for (const f of info.formats || []) {
    if (f.height && f.vcodec && f.vcodec !== 'none') {
      if (!formats.has(f.height)) {
        formats.set(f.height, {
          height: f.height,
          label: `${f.height}p`
        })
      }
    }
  }

  return Array.from(formats.values()).sort((a, b) => b.height - a.height)
}

const activeDownloads = new Map<string, AbortController>()

export function downloadVideo(
  url: string,
  height: number,
  outputDir: string,
  onProgress: (data: ProgressData) => void,
  onComplete: (filePath: string) => void,
  onError: (error: string) => void
): string {
  const downloadId = crypto.randomUUID()

  ensureBinary()
    .then((binaryPath) => {
      const ytdlp = new YTDlpWrap(binaryPath)
      const controller = new AbortController()
      activeDownloads.set(downloadId, controller)

      const formatStr = `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`
      const outputTemplate = join(outputDir, '%(title)s.%(ext)s')

      const args = [
        url,
        '-f',
        formatStr,
        '--merge-output-format',
        'mp4',
        '--ffmpeg-location',
        ffmpegPath,
        '-o',
        outputTemplate,
        '--no-playlist',
        '--newline'
      ]

      let lastFilePath = ''
      const proc = ytdlp.exec(args, undefined, controller.signal)

      proc.on('progress', (progressData) => {
        onProgress({
          percent: progressData.percent ?? 0,
          speed: progressData.currentSpeed ?? '',
          eta: progressData.eta ?? ''
        })
      })

      proc.on('ytDlpEvent', (eventType: string, eventData: string) => {
        if (eventType === 'download') {
          const match = eventData.match(/Destination:\s*(.+)/)
          if (match) lastFilePath = match[1]
        }
        if (eventType === 'Merging') {
          const match = eventData.match(/Merging formats into "(.+)"/)
          if (match) lastFilePath = match[1]
        }
      })

      proc.on('close', () => {
        activeDownloads.delete(downloadId)
        const filePath = lastFilePath || join(outputDir, 'download.mp4')
        onComplete(filePath)
      })

      proc.on('error', (err: Error) => {
        activeDownloads.delete(downloadId)
        if (controller.signal.aborted) return
        onError(err.message || 'Download failed')
      })
    })
    .catch((err) => {
      onError(err.message || 'Failed to initialize yt-dlp')
    })

  return downloadId
}

export function cancelDownload(downloadId: string): void {
  const controller = activeDownloads.get(downloadId)
  if (controller) {
    controller.abort()
    activeDownloads.delete(downloadId)
  }
}
