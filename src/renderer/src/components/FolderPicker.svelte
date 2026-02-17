<script lang="ts">
  import { onMount } from 'svelte'
  import { downloadFolder, downloadState } from '../lib/stores'

  onMount(async () => {
    $downloadFolder = await window.api.getDownloadFolder()
  })

  async function chooseFolder(): Promise<void> {
    const folder = await window.api.selectDownloadFolder()
    if (folder) {
      $downloadFolder = folder
    }
  }
</script>

<div class="folder-picker">
  <span class="folder-path" title={$downloadFolder}>{$downloadFolder || '...'}</span>
  <button
    onclick={chooseFolder}
    disabled={$downloadState === 'downloading'}
  >
    Change
  </button>
</div>

<style>
  .folder-picker {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .folder-path {
    flex: 1;
    font-size: 0.85rem;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: var(--surface);
    padding: 6px 10px;
    border-radius: var(--radius);
    border: 1px solid var(--border);
  }

  button {
    background: var(--surface);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }

  button:hover:not(:disabled) {
    background: var(--surface-hover);
  }
</style>
