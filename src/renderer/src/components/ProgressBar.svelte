<script lang="ts">
  import { downloadState, progress, errorMessage, completedFilePath } from '../lib/stores'
</script>

{#if $downloadState === 'downloading' || $downloadState === 'complete' || $downloadState === 'error'}
  <div class="progress-section">
    {#if $downloadState === 'downloading'}
      <div class="progress-bar">
        <div class="progress-fill" style="width: {$progress.percent}%"></div>
      </div>
      <div class="progress-info">
        <span>{$progress.percent.toFixed(1)}%</span>
        {#if $progress.speed}
          <span>{$progress.speed}</span>
        {/if}
        {#if $progress.eta}
          <span>ETA: {$progress.eta}</span>
        {/if}
      </div>
    {:else if $downloadState === 'complete'}
      <div class="progress-bar">
        <div class="progress-fill complete" style="width: 100%"></div>
      </div>
      <p class="success">Download complete!</p>
      {#if $completedFilePath}
        <p class="file-path" title={$completedFilePath}>{$completedFilePath}</p>
      {/if}
    {:else if $downloadState === 'error'}
      <p class="error">{$errorMessage}</p>
    {/if}
  </div>
{/if}

<style>
  .progress-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--surface);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--primary);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-fill.complete {
    background: var(--success);
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .success {
    color: var(--success);
    font-size: 0.9rem;
    font-weight: 600;
  }

  .error {
    color: var(--error);
    font-size: 0.9rem;
  }

  .file-path {
    font-size: 0.75rem;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
