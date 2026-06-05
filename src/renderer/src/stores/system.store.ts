// src/renderer/src/stores/system.store.ts
import { defineStore } from 'pinia'

export const useSystemStore = defineStore('system', {
  state: () => ({
    systemInfo: null as SystemInfo | null,
    loading: false,
    error: null as string | null,
       formatBytes(bytes: number): string {
      if (!bytes) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
  }),

  getters: {
    
    
    ageInYears(): number | null {
      if (!this.systemInfo?.bios?.releaseDate) return null
      const d = new Date(this.systemInfo.bios.releaseDate)
      if (isNaN(d.getTime())) return null
      const diff = Date.now() - d.getTime()
      return Math.round((diff / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10
    },
    // Battery health (max vs design capacity)
    batteryHealth(): string | null {
      const b = this.systemInfo?.battery
      if (!b?.hasBattery || !b.maxCapacity) return null
      const design = b.designCapacity ?? b.maxCapacity
      if (!design) return null
      return ((b.maxCapacity / design) * 100).toFixed(1) + '%'
    },

    batteryStatus(): string | null {
      const b = this.systemInfo?.battery
      if (!b?.hasBattery) return null
      if (b.isCharging) return 'Charging'
      if (b.percent != null) return `${b.percent}%`
      return 'Unknown'
    },
    hasBattery(): boolean {
      return this.systemInfo?.battery?.hasBattery ?? false
    },
   
  },

  actions: {
    async fetchSystemInfo() {
      this.loading = true
      this.error = null
      try {
        this.systemInfo = await window.api.getSystemInfo()
      
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})