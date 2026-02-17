<script lang="ts">
  import { formats, selectedHeight, downloadState } from '../lib/stores'

  function handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    $selectedHeight = Number(target.value)
  }
</script>

<div class="resolution-picker">
  <select
    id="resolution"
    value={$selectedHeight}
    onchange={handleChange}
    disabled={$formats.length === 0 || $downloadState === 'downloading'}
  >
    {#if $formats.length === 0}
      <option disabled selected>--</option>
    {:else}
      {#each $formats as format}
        <option value={format.height}>{format.label}</option>
      {/each}
    {/if}
  </select>
</div>

<style>
  .resolution-picker {
    display: flex;
  }

  select {
    flex: 1;
  }
</style>
