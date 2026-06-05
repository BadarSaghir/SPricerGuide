<script setup lang="ts">
defineProps<{ data: any; keyName?: string }>()
</script>

<template>
  <div class="ml-4 border-l-2 border-gray-300 dark:border-gray-600 pl-3">
    <template v-if="data === null || data === undefined">
      <span class="text-gray-400 italic">null</span>
    </template>

    <template v-else-if="typeof data === 'object' && !Array.isArray(data)">
      <details v-for="(value, key) in data" :key="key" class="my-1">
        <summary class="cursor-pointer text-blue-600 dark:text-blue-400 font-mono text-sm">
          {{ key }}
        </summary>
        <JsonViewer :data="value" :keyName="key as string" />
      </details>
    </template>

    <template v-else-if="Array.isArray(data)">
      <details v-for="(item, index) in data" :key="index" class="my-1">
        <summary class="cursor-pointer text-blue-600 dark:text-blue-400 font-mono text-sm">
          [{{ index }}]
        </summary>
        <JsonViewer :data="item" />
      </details>
    </template>

    <template v-else>
      <span class="font-mono text-sm">{{ String(data) }}</span>
    </template>
  </div>
</template>