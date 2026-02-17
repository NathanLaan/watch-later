<script lang="ts">
  import {
    url,
    selectedHeight,
    downloadFolder,
    downloadState,
    downloadId,
    progress,
    errorMessage,
    completedFilePath,
    formats
  } from '../lib/stores'
  import { onMount, onDestroy } from 'svelte'

  let cleanupProgress: (() => void) | null = null
  let cleanupComplete: (() => void) | null = null
  let cleanupError: (() => void) | null = null

  onMount(() => {
    cleanupProgress = window.api.onProgress((p) => {
      $progress = p
    })

    cleanupComplete = window.api.onComplete((filePath) => {
      $downloadState = 'complete'
      $completedFilePath = filePath
      $downloadId = null
    })

    cleanupError = window.api.onError((err) => {
      $downloadState = 'error'
      $errorMessage = err
      $downloadId = null
    })
  })

  onDestroy(() => {
    cleanupProgress?.()
    cleanupComplete?.()
    cleanupError?.()
  })

  async function startDownload(): Promise<void> {
    if (!$url || $selectedHeight === null || !$downloadFolder) return
    $downloadState = 'downloading'
    $progress = { percent: 0, speed: '', eta: '' }
    $errorMessage = ''
    $completedFilePath = ''

    try {
      const result = await window.api.startDownload($url, $selectedHeight, $downloadFolder)
      $downloadId = result.downloadId
    } catch (err: any) {
      $downloadState = 'error'
      $errorMessage = err.message || 'Failed to start download'
    }
  }

  async function cancelDownload(): Promise<void> {
    if ($downloadId) {
      await window.api.cancelDownload($downloadId)
      $downloadState = 'ready'
      $downloadId = null
      $progress = { percent: 0, speed: '', eta: '' }
    }
  }

  function reset(): void {
    $downloadState = 'ready'
    $progress = { percent: 0, speed: '', eta: '' }
    $errorMessage = ''
    $completedFilePath = ''
  }

  let canDownload = $derived(
    $downloadState === 'ready' && $url && $selectedHeight !== null && $formats.length > 0
  )
</script>

<div class="download-actions">
  {#if $downloadState === 'downloading'}
    <button class="cancel-btn" onclick={cancelDownload}>Cancel</button>
  {:else if $downloadState === 'complete' || $downloadState === 'error'}
    <button class="reset-btn" onclick={reset}>New Download</button>
  {:else}
    <button class="download-btn" onclick={startDownload} disabled={!canDownload}>
      Download
    </button>
  {/if}
</div>

<style>
  .download-actions {
    display: flex;
    justify-content: center;
  }

  button {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
  }

  .download-btn {
    background: var(--primary);
    color: white;
  }

  .download-btn:hover:not(:disabled) {
    background: var(--primary-hover);
  }

  .cancel-btn {
    background: var(--error);
    color: white;
  }

  .cancel-btn:hover {
    opacity: 0.9;
  }

  .reset-btn {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
  }

  .reset-btn:hover {
    background: var(--surface-hover);
  }
</style>
