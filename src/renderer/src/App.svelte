<script lang="ts">
  import UrlInput from './components/UrlInput.svelte'
  import ResolutionPicker from './components/ResolutionPicker.svelte'
  import FolderPicker from './components/FolderPicker.svelte'
  import DownloadButton from './components/DownloadButton.svelte'
  import ProgressBar from './components/ProgressBar.svelte'

  let dark = $state(false)
  let showAbout = $state(false)

  function toggleTheme(): void {
    dark = !dark
    document.documentElement.classList.toggle('dark', dark)
  }
</script>

<main>
  <div class="form-grid">
    <span class="form-label">URL:</span>
    <UrlInput />

    <span class="form-label">Resolution:</span>
    <ResolutionPicker />

    <span class="form-label">Save to:</span>
    <FolderPicker />
  </div>
  <DownloadButton />
  <ProgressBar />

  <div class="spacer"></div>

  <div class="bottom-bar">
    <button class="bottom-btn" onclick={toggleTheme}>
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
    <button class="bottom-btn" onclick={() => (showAbout = true)}>About</button>
  </div>
</main>

{#if showAbout}
  <div class="overlay" onclick={() => (showAbout = false)} role="presentation">
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div class="modal" onclick={(e) => e.stopPropagation()} onkeydown={(e) => { if (e.key === 'Escape') showAbout = false }} role="dialog" aria-modal="true" tabindex="-1">
      <h2>Watch Later</h2>
      <p class="version">Version 1.0.0</p>
      <p class="description">Download YouTube videos in MP4 format.</p>
      <button class="close-btn" onclick={() => (showAbout = false)}>Close</button>
    </div>
  </div>
{/if}

<style>
  main {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
  }

  .form-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px 12px;
    align-items: center;
  }

  .form-label {
    font-size: 0.9rem;
    color: var(--text-muted);
    white-space: nowrap;
    text-align: right;
  }

  .spacer {
    flex: 1;
  }

  .bottom-bar {
    display: flex;
    gap: 8px;
  }

  .bottom-btn {
    flex: 1;
    background: var(--surface);
    color: var(--text-muted);
    border: 1px solid var(--border);
    padding: 8px;
    font-size: 0.85rem;
  }

  .bottom-btn:hover {
    background: var(--surface-hover);
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: var(--overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 32px;
    text-align: center;
    min-width: 260px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .modal h2 {
    color: var(--primary);
    font-size: 1.2rem;
  }

  .version {
    color: var(--text-muted);
    font-size: 0.85rem;
  }

  .description {
    color: var(--text);
    font-size: 0.9rem;
  }

  .close-btn {
    margin-top: 8px;
    background: var(--primary);
    color: white;
    padding: 8px 24px;
    align-self: center;
  }

  .close-btn:hover {
    background: var(--primary-hover);
  }
</style>
