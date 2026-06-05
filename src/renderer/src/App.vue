<script setup lang="ts">
import { onMounted } from 'vue'
import { useSystemStore } from './stores/system.store'
import SystemDashboard from './components/SystemDashboard.vue'

const store = useSystemStore()
onMounted(() => store.fetchSystemInfo())
</script>

<template>
  <SystemDashboard />
</template>