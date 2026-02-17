import { ipcMain, dialog, app, BrowserWindow } from 'electron'
import { getFormats, downloadVideo, cancelDownload } from './ytdlp'

let downloadFolder = app.getPath('downloads')

export function registerIpcHandlers(mainWindow: BrowserWindow): void {
  ipcMain.handle('get-formats', async (_event, url: string) => {
    return await getFormats(url)
  })

  ipcMain.handle(
    'start-download',
    (_event, url: string, height: number, outputDir: string) => {
      const downloadId = downloadVideo(
        url,
        height,
        outputDir,
        (progress) => {
          mainWindow.webContents.send('download-progress', progress)
        },
        (filePath) => {
          mainWindow.webContents.send('download-complete', filePath)
        },
        (error) => {
          mainWindow.webContents.send('download-error', error)
        }
      )
      return { downloadId }
    }
  )

  ipcMain.handle('cancel-download', (_event, downloadId: string) => {
    cancelDownload(downloadId)
  })

  ipcMain.handle('select-download-folder', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      defaultPath: downloadFolder
    })
    if (!result.canceled && result.filePaths.length > 0) {
      downloadFolder = result.filePaths[0]
      return downloadFolder
    }
    return null
  })

  ipcMain.handle('get-download-folder', () => {
    return downloadFolder
  })
}
