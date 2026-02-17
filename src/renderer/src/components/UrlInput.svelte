<script lang="ts">
  import { url, formats, selectedHeight, downloadState, errorMessage } from '../lib/stores'

  const youtubePattern = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)/

  let inputValue = $state('')
  let fetchError = $state('')

  function isValidUrl(value: string): boolean {
    return youtubePattern.test(value)
  }

  async function fetchFormats(): Promise<void> {
    const currentUrl = inputValue.trim()
    if (!isValidUrl(currentUrl)) {
      fetchError = 'Please enter a valid YouTube URL'
      return
    }
    fetchError = ''
    $url = currentUrl
    $downloadState = 'fetching-formats'
    $errorMessage = ''

    try {
      const result = await window.api.getFormats(currentUrl)
      $formats = result
      if (result.length > 0) {
        $selectedHeight = result[0].height
        $downloadState = 'ready'
      } else {
        fetchError = 'No downloadable formats found'
        $downloadState = 'idle'
      }
    } catch (err: any) {
      fetchError = err.message || 'Failed to fetch formats'
      $downloadState = 'error'
      $errorMessage = fetchError
    }
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      fetchFormats()
    }
  }

  async function handlePaste(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText()
      inputValue = text.trim()
      fetchFormats()
    } catch {
      // clipboard access denied
    }
  }
</script>

<div class="url-input">
  <button class="paste-btn" onclick={handlePaste} title="Paste from clipboard">Paste</button>
  <input
    type="text"
    placeholder="Paste YouTube URL..."
    bind:value={inputValue}
    onkeydown={handleKeydown}
    disabled={$downloadState === 'fetching-formats' || $downloadState === 'downloading'}
  />
  <button
    class="fetch-btn"
    onclick={fetchFormats}
    disabled={$downloadState === 'fetching-formats' || $downloadState === 'downloading' || !inputValue.trim()}
  >
    {$downloadState === 'fetching-formats' ? 'Loading...' : 'Fetch'}
  </button>
</div>
{#if fetchError}
  <p class="error">{fetchError}</p>
{/if}

<style>
  .url-input {
    display: flex;
    gap: 8px;
  }

  input {
    flex: 1;
  }

  .paste-btn {
    background: var(--surface);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }

  .paste-btn:hover {
    background: var(--surface-hover);
  }

  .fetch-btn {
    background: var(--primary);
    color: white;
  }

  .fetch-btn:hover:not(:disabled) {
    background: var(--primary-hover);
  }

  .error {
    color: var(--error);
    font-size: 0.85rem;
    margin-top: -8px;
  }
</style>
