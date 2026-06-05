<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useSystemStore } from '../stores/system.store'
import {
  NCard, NDescriptions, NDescriptionsItem, NTag, NStatistic, NDivider,
  NProgress, NButton, NCheckbox, NSpace, NTable, NInputNumber, NSelect
} from 'naive-ui'

const store = useSystemStore()

// ---------- helpers ----------
const g = (obj: any, path: string, def: any = '—') =>
  path.split('.').reduce((o, k) => o?.[k], obj) ?? def

const formatBytes = (bytes: number | null | undefined) => {
  if (bytes == null || isNaN(bytes)) return '—'
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const USD_TO_PKR = 280

// ---------- data from store ----------
const data = computed(() => store.systemInfo)
const cpu = computed(() => data.value?.cpu)
const cpuCurrentSpeed = computed(() => data.value?.cpuCurrentSpeed)
const currentLoad = computed(() => data.value?.currentLoad)
const cpuTemp = computed(() => data.value?.cpuTemperature)
const mem = computed(() => data.value?.mem)
const battery = computed(() => data.value?.battery)
const diskLayout = computed(() => data.value?.diskLayout)
const graphics = computed(() => data.value?.graphics)

// ---------- Manual Checklist ----------
interface ChecklistItem { label: string; done: boolean }
const manualChecks = ref<ChecklistItem[]>([
  { label: 'Screen: no dead pixels, backlight bleed, pressure marks', done: false },
  { label: 'Hinges: smooth, no wobble or grinding', done: false },
  { label: 'Keyboard: all keys work, backlight even', done: false },
  { label: 'Trackpad: smooth, no dead zones, clicks properly', done: false },
  { label: 'Ports (USB, HDMI, audio, card reader): physically test', done: false },
  { label: 'Webcam & microphone: clear, no static', done: false },
  { label: 'Speakers: no distortion at high volume', done: false },
  { label: 'Chassis & rubber feet: no cracks, dents, missing feet', done: false },
  { label: 'Liquid damage signs: residue, sticky keys, corrosion', done: false },
  { label: 'Charger: original, no frayed cables, properly charges', done: false },
  { label: 'BIOS lock / Computrace: no unknown passwords', done: false },
  { label: 'Proof of ownership / invoice: matches serial', done: false }
])

watch(manualChecks, (val) => {
  localStorage.setItem('laptop-checklist', JSON.stringify(val))
}, { deep: true })
try {
  const saved = localStorage.getItem('laptop-checklist')
  if (saved) manualChecks.value = JSON.parse(saved)
} catch {}
const allChecked = computed(() => manualChecks.value.every(i => i.done))

// ---------- Processor Database (unchanged) ----------
interface CpuEntry {
  brand: 'Intel' | 'AMD'
  series: string
  generation: string
  suffix: string
  tier: number
  tierLabel: string
  year: number
  notes: string
}
const processorDatabase: CpuEntry[] = [
  { brand: 'Intel', series: 'Core Ultra 9',  generation: 'Meteor Lake', suffix: 'H',  tier: 1, tierLabel: 'Flagship', year: 2024, notes: 'Latest AI‑boosted mobile flagship' },
  { brand: 'Intel', series: 'Core Ultra 7',  generation: 'Meteor Lake', suffix: 'H',  tier: 1, tierLabel: 'Flagship', year: 2024, notes: 'Premium performance with AI engine' },
  { brand: 'Intel', series: 'Core i9',       generation: '14th',         suffix: 'HX', tier: 1, tierLabel: 'Flagship', year: 2024, notes: 'Unlocked extreme performance' },
  { brand: 'Intel', series: 'Core i9',       generation: '14th',         suffix: 'H',  tier: 1, tierLabel: 'Flagship', year: 2024, notes: 'High‑end gaming / workstation' },
  { brand: 'Intel', series: 'Core i7',       generation: '14th',         suffix: 'HX', tier: 2, tierLabel: 'High‑end',  year: 2024, notes: 'Unlocked enthusiast' },
  { brand: 'Intel', series: 'Core i7',       generation: '14th',         suffix: 'H',  tier: 2, tierLabel: 'High‑end',  year: 2024, notes: 'Solid all‑rounder' },
  { brand: 'Intel', series: 'Core i5',       generation: '14th',         suffix: 'H',  tier: 3, tierLabel: 'Mid‑range', year: 2024, notes: 'Mainstream performance' },
  { brand: 'Intel', series: 'Core i3',       generation: '14th',         suffix: 'U',  tier: 4, tierLabel: 'Entry',     year: 2024, notes: 'Budget office tasks' },
  { brand: 'Intel', series: 'Core i9',       generation: '13th',         suffix: 'HX', tier: 1, tierLabel: 'Flagship', year: 2023, notes: 'Raptor Lake top tier' },
  { brand: 'Intel', series: 'Core i9',       generation: '13th',         suffix: 'H',  tier: 1, tierLabel: 'Flagship', year: 2023, notes: 'Raptor Lake mobile king' },
  { brand: 'Intel', series: 'Core i7',       generation: '13th',         suffix: 'HX', tier: 2, tierLabel: 'High‑end',  year: 2023, notes: 'Powerful multitasker' },
  { brand: 'Intel', series: 'Core i7',       generation: '13th',         suffix: 'H',  tier: 2, tierLabel: 'High‑end',  year: 2023, notes: 'Great for creators' },
  { brand: 'Intel', series: 'Core i5',       generation: '13th',         suffix: 'H',  tier: 3, tierLabel: 'Mid‑range', year: 2023, notes: 'Balanced price/perf' },
  { brand: 'Intel', series: 'Core i5',       generation: '13th',         suffix: 'U',  tier: 3, tierLabel: 'Mid‑range', year: 2023, notes: 'Efficient everyday' },
  { brand: 'Intel', series: 'Core i3',       generation: '13th',         suffix: 'U',  tier: 4, tierLabel: 'Entry',     year: 2023, notes: 'Light use' },
  { brand: 'Intel', series: 'Core i9',       generation: '12th',         suffix: 'HX', tier: 1, tierLabel: 'Flagship', year: 2022, notes: 'Alder Lake extreme' },
  { brand: 'Intel', series: 'Core i9',       generation: '12th',         suffix: 'H',  tier: 1, tierLabel: 'Flagship', year: 2022, notes: 'Hybrid architecture' },
  { brand: 'Intel', series: 'Core i7',       generation: '12th',         suffix: 'HX', tier: 2, tierLabel: 'High‑end',  year: 2022, notes: 'High clock hybrid' },
  { brand: 'Intel', series: 'Core i7',       generation: '12th',         suffix: 'H',  tier: 2, tierLabel: 'High‑end',  year: 2022, notes: 'Efficient performance' },
  { brand: 'Intel', series: 'Core i5',       generation: '12th',         suffix: 'H',  tier: 3, tierLabel: 'Mid‑range', year: 2022, notes: 'Solid hybrid chip' },
  { brand: 'Intel', series: 'Core i5',       generation: '12th',         suffix: 'U',  tier: 3, tierLabel: 'Mid‑range', year: 2022, notes: 'Ultra‑portable' },
  { brand: 'Intel', series: 'Core i3',       generation: '12th',         suffix: 'U',  tier: 4, tierLabel: 'Entry',     year: 2022, notes: 'Budget ultrabook' },
  { brand: 'Intel', series: 'Core i7',       generation: '11th',         suffix: 'H',  tier: 2, tierLabel: 'High‑end',  year: 2021, notes: 'Tiger Lake H' },
  { brand: 'Intel', series: 'Core i5',       generation: '11th',         suffix: 'H',  tier: 3, tierLabel: 'Mid‑range', year: 2021, notes: 'Good gaming' },
  { brand: 'Intel', series: 'Core i5',       generation: '11th',         suffix: 'U',  tier: 3, tierLabel: 'Mid‑range', year: 2021, notes: 'Thin & light' },
  { brand: 'Intel', series: 'Core i3',       generation: '11th',         suffix: 'U',  tier: 4, tierLabel: 'Entry',     year: 2021, notes: 'Affordable ULV' },
  { brand: 'Intel', series: 'Core i7',       generation: '10th',         suffix: 'H',  tier: 2, tierLabel: 'High‑end',  year: 2020, notes: 'Comet Lake H' },
  { brand: 'Intel', series: 'Core i5',       generation: '10th',         suffix: 'U',  tier: 3, tierLabel: 'Mid‑range', year: 2020, notes: 'Common ultrabook' },
  { brand: 'Intel', series: 'Core i3',       generation: '10th',         suffix: 'U',  tier: 4, tierLabel: 'Entry',     year: 2020, notes: 'Basic laptop' },
  { brand: 'Intel', series: 'Core i7',       generation: '8th/9th',      suffix: 'H',  tier: 2, tierLabel: 'High‑end',  year: 2019, notes: 'Coffee Lake H' },
  { brand: 'Intel', series: 'Core i5',       generation: '8th/9th',      suffix: 'U',  tier: 3, tierLabel: 'Mid‑range', year: 2019, notes: 'Quad‑core ULV' },
  { brand: 'Intel', series: 'Core i3',       generation: '8th/9th',      suffix: 'U',  tier: 4, tierLabel: 'Entry',     year: 2019, notes: 'Dual/Quad ULV' },
  { brand: 'Intel', series: 'Core i5/i7',    generation: '7th',          suffix: 'U',  tier: 4, tierLabel: 'Entry',     year: 2017, notes: 'Dual‑core, dated' },
  { brand: 'Intel', series: 'Core i3/i5',    generation: '≤6th',         suffix: 'U',  tier: 5, tierLabel: 'Legacy',    year: 2016, notes: 'Very old, avoid' },
  { brand: 'Intel', series: 'Xeon W/E',      generation: 'Various',      suffix: '',   tier: 2, tierLabel: 'High‑end',  year: 2023, notes: 'Workstation/server, powerful, may lack iGPU' },
  { brand: 'Intel', series: 'Xeon Scalable', generation: 'Various',      suffix: '',   tier: 1, tierLabel: 'Flagship', year: 2023, notes: 'Data center class, rare in laptops' },
  // AMD
  { brand: 'AMD', series: 'Ryzen 9',   generation: '7045', suffix: 'HX', tier: 1, tierLabel: 'Flagship', year: 2023, notes: 'Dragon Range extreme' },
  { brand: 'AMD', series: 'Ryzen 9',   generation: '7040', suffix: 'HS', tier: 1, tierLabel: 'Flagship', year: 2023, notes: 'Phoenix thin flagship' },
  { brand: 'AMD', series: 'Ryzen 7',   generation: '7040', suffix: 'HS', tier: 2, tierLabel: 'High‑end',  year: 2023, notes: 'Excellent efficiency' },
  { brand: 'AMD', series: 'Ryzen 7',   generation: '7040', suffix: 'U',  tier: 2, tierLabel: 'High‑end',  year: 2023, notes: 'Premium ultraportable' },
  { brand: 'AMD', series: 'Ryzen 5',   generation: '7040', suffix: 'U',  tier: 3, tierLabel: 'Mid‑range', year: 2023, notes: 'Great value' },
  { brand: 'AMD', series: 'Ryzen 9',   generation: '6000', suffix: 'HX', tier: 1, tierLabel: 'Flagship', year: 2022, notes: 'Rembrandt HX' },
  { brand: 'AMD', series: 'Ryzen 7',   generation: '6000', suffix: 'H',  tier: 2, tierLabel: 'High‑end',  year: 2022, notes: '6nm, good iGPU' },
  { brand: 'AMD', series: 'Ryzen 7',   generation: '6000', suffix: 'U',  tier: 2, tierLabel: 'High‑end',  year: 2022, notes: 'Long battery life' },
  { brand: 'AMD', series: 'Ryzen 5',   generation: '6000', suffix: 'U',  tier: 3, tierLabel: 'Mid‑range', year: 2022, notes: 'Efficient mid‑range' },
  { brand: 'AMD', series: 'Ryzen 9',   generation: '5000', suffix: 'HX', tier: 1, tierLabel: 'Flagship', year: 2021, notes: 'Cezanne HX' },
  { brand: 'AMD', series: 'Ryzen 7',   generation: '5000', suffix: 'H',  tier: 2, tierLabel: 'High‑end',  year: 2021, notes: 'Very popular gaming' },
  { brand: 'AMD', series: 'Ryzen 7',   generation: '5000', suffix: 'U',  tier: 2, tierLabel: 'High‑end',  year: 2021, notes: 'Great efficiency' },
  { brand: 'AMD', series: 'Ryzen 5',   generation: '5000', suffix: 'U',  tier: 3, tierLabel: 'Mid‑range', year: 2021, notes: 'Solid everyday' },
  { brand: 'AMD', series: 'Ryzen 3',   generation: '5000', suffix: 'U',  tier: 4, tierLabel: 'Entry',     year: 2021, notes: 'Budget Zen 3' },
  { brand: 'AMD', series: 'Ryzen 7',   generation: '4000', suffix: 'U',  tier: 3, tierLabel: 'Mid‑range', year: 2020, notes: 'Renoir, still decent' },
  { brand: 'AMD', series: 'Ryzen 5',   generation: '4000', suffix: 'U',  tier: 3, tierLabel: 'Mid‑range', year: 2020, notes: 'Affordable Zen 2' },
  { brand: 'AMD', series: 'Ryzen 3',   generation: '4000', suffix: 'U',  tier: 4, tierLabel: 'Entry',     year: 2020, notes: 'Basic Zen 2' },
  { brand: 'AMD', series: 'Ryzen 5',   generation: '3000', suffix: 'U',  tier: 4, tierLabel: 'Entry',     year: 2019, notes: 'Zen+, older' },
  { brand: 'AMD', series: 'Ryzen 3',   generation: '3000', suffix: 'U',  tier: 4, tierLabel: 'Entry',     year: 2019, notes: 'Budget older' },
  { brand: 'AMD', series: 'Ryzen 5',   generation: '2000', suffix: 'U',  tier: 5, tierLabel: 'Legacy',    year: 2018, notes: 'Zen, outdated' },
  { brand: 'AMD', series: 'EPYC',      generation: 'Various', suffix: '',   tier: 2, tierLabel: 'High‑end',  year: 2023, notes: 'Server CPU, extremely rare in laptops' },
]

// ---------- CPU Identification (unchanged) ----------
const cpuBrand = computed(() => {
  const b = (cpu.value?.brand || '').toLowerCase()
  if (b.includes('xeon') || b.includes('intel')) return 'Intel'
  if (b.includes('amd') || b.includes('ryzen') || b.includes('epyc') || b.includes('opteron')) return 'AMD'
  return 'Unknown'
})

const cpuMatchedEntry = computed(() => {
  if (!cpu.value) return null
  const brand = cpuBrand.value
  const fullName = cpu.value.brand || ''

  if (brand === 'Intel' && fullName.toLowerCase().includes('xeon'))
    return processorDatabase.find(e => e.brand === 'Intel' && e.series.includes('Xeon'))
  if (brand === 'AMD' && fullName.toLowerCase().includes('epyc'))
    return processorDatabase.find(e => e.brand === 'AMD' && e.series === 'EPYC')

  const intelMatch = fullName.match(/(Core\s(?:Ultra\s)?i\d+)/i)
  const amdMatch = fullName.match(/(Ryzen\s\d+)/i)
  const series = intelMatch ? intelMatch[1] : amdMatch ? amdMatch[1] : ''
  let gen = ''
  if (brand === 'Intel') {
    const m = fullName.match(/i\d-(\d{2})\d*/) || fullName.match(/Ultra\s(\d)/i)
    if (m) gen = m[1] + 'th'
  } else if (brand === 'AMD') {
    const m = fullName.match(/Ryzen\s\d+\s(\d{4})/)
    if (m) gen = m[1].substring(0,1) + 'xxx'
  }
  const suffixMatch = fullName.match(/\w(\d{2,})(\w+)/)
  const suffix = suffixMatch ? suffixMatch[2] : ''

  return processorDatabase.find(e =>
    e.brand === brand &&
    series.toLowerCase().includes(e.series.toLowerCase()) &&
    (gen === e.generation || e.generation.includes(gen)) &&
    (suffix === e.suffix || e.suffix.includes(suffix))
  ) || null
})

const cpuVerdict = computed(() => {
  const entry = cpuMatchedEntry.value
  if (entry) {
    return {
      text: `${entry.series} ${entry.generation} ${entry.suffix} – ${entry.tierLabel}`,
      color: entry.tier <= 2 ? 'success' as const : entry.tier === 3 ? 'warning' as const : 'error' as const,
      suffixDetail: entry.notes,
      usage: entry.tier <= 2 ? 'Suitable for heavy workloads' : entry.tier === 3 ? 'Good for daily tasks' : 'Basic usage or legacy'
    }
  }
  if (!cpu.value) return { text: 'No data', color: 'default' as const, suffixDetail: '', usage: '' }
  return { text: cpuBrand.value + ' processor – manual check advised', color: 'default' as const, suffixDetail: '', usage: '' }
})

// ------- Throttling Test -------
const stressRunning = ref(false)
const stressResult = ref<{
  baseSpeed: number
  avgSpeed: number
  minSpeed: number
  samples: number[]
  throttled: boolean
} | null>(null)

async function runStressTest() {
  stressRunning.value = true
  stressResult.value = null
  try {
    const result = await (window.api as any).runStressTest()
    stressResult.value = result
  } catch (e) {
    console.error('Stress test error:', e)
  } finally {
    stressRunning.value = false
  }
}

const isPassiveThrottling = computed(() => {
  if (!currentLoad.value || !cpuCurrentSpeed.value || !cpu.value) return false
  const load = currentLoad.value.currentLoad ?? 0
  const avgSpeed = cpuCurrentSpeed.value.avg
  const baseSpeed = cpu.value.speed
  return load > 70 && baseSpeed > 0 && avgSpeed < baseSpeed * 0.85
})

// ---------- RAM / Storage / Battery Verdicts (unchanged) ----------
const ramVerdict = computed(() => {
  const total = mem.value?.total || 0
  const sticks = data.value?.memLayout?.length || 0
  let verdict = '', color: 'success' | 'warning' | 'error' | 'default' = 'default'
  if (total < 4 * 1024 ** 3) { verdict = 'Very low RAM (<4 GB) – insufficient'; color = 'error' }
  else if (total < 8 * 1024 ** 3) { verdict = 'Minimum RAM (4‑8 GB) – basic only'; color = 'warning' }
  else if (total < 16 * 1024 ** 3) { verdict = 'Decent RAM (8‑16 GB) – good for most'; color = 'success' }
  else { verdict = 'Plenty of RAM (16+ GB) – ready for heavy use'; color = 'success' }

  const dualPossible = sticks >= 2 && data.value?.memLayout?.every(
    (s: any, _: number, arr: any[]) => s.size === arr[0].size && s.type === arr[0].type
  )
  return { text: verdict, color, dual: dualPossible ? 'Likely dual‑channel' : 'Single‑channel or mismatched' }
})

const diskVerdicts = computed(() => {
  return diskLayout.value?.map(d => {
    let verdict = '', color: 'success' | 'warning' | 'error' | 'default' | 'info' = 'default', type = d.type
    if (d.interfaceType?.includes('NVMe') || d.type?.toLowerCase() === 'ssd') type = 'SSD (NVMe)'
    else if (d.interfaceType?.includes('SATA') && d.type?.toLowerCase() !== 'hd') type = 'SSD (SATA)'
    else if (d.type === 'HD') type = 'Hard Disk (HDD)'

    const smartOk = (d.smartStatus || '').toUpperCase() === 'OK'
    if (!smartOk) { verdict = 'SMART failure – replace!'; color = 'error' }
    else if (type.includes('NVMe')) { verdict = 'Excellent speed (NVMe SSD)'; color = 'success' }
    else if (type.includes('SATA')) { verdict = 'Good speed (SATA SSD)'; color = 'success' }
    else if (type.includes('HDD')) { verdict = 'Slow mechanical drive'; color = 'warning' }
    else { verdict = 'Unknown'; color = 'default' }
    return { ...d, type, verdict, color }
  }) || []
})

const batteryHealth = computed(() => {
  const b = battery.value
  if (!b?.hasBattery || !b.maxCapacity) return null
  const design = b.designCapacity ?? b.maxCapacity
  if (!design) return null
  return ((b.maxCapacity / design) * 100).toFixed(1)
})
const batteryVerdict = computed(() => {
  if (!battery.value?.hasBattery) return null
  const health = parseFloat(batteryHealth.value || '0')
  let text = '', color: 'success' | 'warning' | 'error' | 'default' = 'default'
  if (health >= 80) { text = 'Battery health good'; color = 'success' }
  else if (health >= 60) { text = 'Moderately worn'; color = 'warning' }
  else { text = 'Heavily worn – replace soon'; color = 'error' }
  return { text, color }
})

// Warnings
const isBatteryWeak = computed(() => battery.value?.hasBattery && parseFloat(batteryHealth.value ?? '0') < 80)
const isCpuTempHigh = computed(() => (cpuTemp.value?.main ?? 0) > 80)
const isOldBios = computed(() => {
  const d = data.value?.bios?.releaseDate
  if (!d) return false
  const biosDate = new Date(d)
  if (isNaN(biosDate.getTime())) return false
  return (Date.now() - biosDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25) > 5
})
const diskSmartFail = computed(() => diskLayout.value?.some(d => (d.smartStatus || '').toUpperCase() !== 'OK'))
const warnings = computed(() => {
  const w: string[] = []
  if (isBatteryWeak.value) w.push('Battery health below 80%')
  if (isCpuTempHigh.value) w.push('CPU temperature critically high (>80°C)')
  if (isOldBios.value) w.push('BIOS date older than 5 years – likely old hardware')
  if (diskSmartFail.value) w.push('One or more disks have SMART failure')
  if (isPassiveThrottling.value) w.push('CPU appears to be throttling under current load')
  if (stressResult.value?.throttled) w.push('CPU throttled during stress test')
  return w
})

const negotiationTips = computed(() => {
  const tips: { issue: string; discount: string }[] = []
  if (isBatteryWeak.value) tips.push({ issue: 'Worn battery', discount: '10–20%' })
  if (isOldBios.value) tips.push({ issue: 'Device >5 years', discount: '15–25%' })
  if (diskSmartFail.value) tips.push({ issue: 'Failing disk', discount: 'Price of new disk + 10%' })
  if (isCpuTempHigh.value) tips.push({ issue: 'High CPU temp', discount: '5–10%' })
  if (isPassiveThrottling.value || stressResult.value?.throttled) tips.push({ issue: 'CPU throttling detected', discount: '5–10%' })
  if (cpuVerdict.value.color === 'error') tips.push({ issue: 'Legacy CPU', discount: '10–15%' })
  if (ramVerdict.value.color === 'error' || ramVerdict.value.color === 'warning') tips.push({ issue: 'Low/mismatched RAM', discount: '5–10%' })
  if (diskVerdicts.value.some(d => d.color === 'warning')) tips.push({ issue: 'HDD instead of SSD', discount: '5–10%' })
  return tips
})

// ---------- Expanded Model Dictionary with Prices ----------
interface BrandModel {
  manufacturer: string
  series: string
  modelKeywords: string[]
  type: 'laptop' | 'workstation' | 'desktop'
  // Estimated new price range (USD)
  priceRange: [number, number]
}
const brandModelDatabase: BrandModel[] = [
  // HP
  { manufacturer: 'HP', series: 'Spectre x360', modelKeywords: ['spectre', 'x360'], type: 'laptop', priceRange: [1200, 2000] },
  { manufacturer: 'HP', series: 'Spectre', modelKeywords: ['spectre'], type: 'laptop', priceRange: [1400, 2200] },
  { manufacturer: 'HP', series: 'Envy x360', modelKeywords: ['envy', 'x360'], type: 'laptop', priceRange: [800, 1300] },
  { manufacturer: 'HP', series: 'Envy', modelKeywords: ['envy'], type: 'laptop', priceRange: [700, 1200] },
  { manufacturer: 'HP', series: 'Pavilion x360', modelKeywords: ['pavilion', 'x360'], type: 'laptop', priceRange: [500, 900] },
  { manufacturer: 'HP', series: 'Pavilion', modelKeywords: ['pavilion'], type: 'laptop', priceRange: [400, 800] },
  { manufacturer: 'HP', series: 'EliteBook', modelKeywords: ['elitebook'], type: 'laptop', priceRange: [1000, 2500] },
  { manufacturer: 'HP', series: 'ProBook', modelKeywords: ['probook'], type: 'laptop', priceRange: [600, 1200] },
  { manufacturer: 'HP', series: 'ZBook', modelKeywords: ['zbook'], type: 'workstation', priceRange: [1500, 5000] },
  { manufacturer: 'HP', series: 'Omen', modelKeywords: ['omen'], type: 'laptop', priceRange: [1000, 3000] },
  { manufacturer: 'HP', series: 'Victus', modelKeywords: ['victus'], type: 'laptop', priceRange: [700, 1500] },
  { manufacturer: 'HP', series: 'Dragonfly', modelKeywords: ['dragonfly'], type: 'laptop', priceRange: [1600, 3000] },
  { manufacturer: 'HP', series: 'EliteDesk', modelKeywords: ['elitedesk'], type: 'desktop', priceRange: [700, 2000] },
  { manufacturer: 'HP', series: 'ProDesk', modelKeywords: ['prodesk'], type: 'desktop', priceRange: [500, 1200] },
  { manufacturer: 'HP', series: 'OMEN Desktop', modelKeywords: ['omen'], type: 'desktop', priceRange: [1200, 4000] },
  { manufacturer: 'HP', series: 'Workstation Z', modelKeywords: ['z2', 'z4', 'z6', 'z8'], type: 'workstation', priceRange: [2000, 8000] },

  // Lenovo
  { manufacturer: 'Lenovo', series: 'ThinkPad X1 Carbon', modelKeywords: ['x1 carbon'], type: 'laptop', priceRange: [1500, 2500] },
  { manufacturer: 'Lenovo', series: 'ThinkPad X1 Yoga', modelKeywords: ['x1 yoga'], type: 'laptop', priceRange: [1600, 2600] },
  { manufacturer: 'Lenovo', series: 'ThinkPad X1 Extreme', modelKeywords: ['x1 extreme'], type: 'laptop', priceRange: [1800, 3500] },
  { manufacturer: 'Lenovo', series: 'ThinkPad T Series', modelKeywords: ['t14', 't15', 't16'], type: 'laptop', priceRange: [1000, 2000] },
  { manufacturer: 'Lenovo', series: 'ThinkPad X Series', modelKeywords: ['x13', 'x1'], type: 'laptop', priceRange: [1200, 2200] },
  { manufacturer: 'Lenovo', series: 'ThinkPad L Series', modelKeywords: ['l13', 'l14', 'l15'], type: 'laptop', priceRange: [700, 1300] },
  { manufacturer: 'Lenovo', series: 'ThinkPad E Series', modelKeywords: ['e14', 'e15', 'e16'], type: 'laptop', priceRange: [500, 1000] },
  { manufacturer: 'Lenovo', series: 'ThinkPad P Series', modelKeywords: ['p1', 'p14', 'p15', 'p16', 'p17', 'p53', 'p73'], type: 'workstation', priceRange: [1800, 5000] },
  { manufacturer: 'Lenovo', series: 'ThinkBook', modelKeywords: ['thinkbook'], type: 'laptop', priceRange: [600, 1200] },
  { manufacturer: 'Lenovo', series: 'IdeaPad', modelKeywords: ['ideapad'], type: 'laptop', priceRange: [300, 800] },
  { manufacturer: 'Lenovo', series: 'IdeaPad Flex', modelKeywords: ['ideapad flex', 'ideapad 5 flex'], type: 'laptop', priceRange: [500, 900] },
  { manufacturer: 'Lenovo', series: 'Yoga', modelKeywords: ['yoga'], type: 'laptop', priceRange: [800, 1800] },
  { manufacturer: 'Lenovo', series: 'Legion', modelKeywords: ['legion'], type: 'laptop', priceRange: [1000, 3000] },
  { manufacturer: 'Lenovo', series: 'LOQ', modelKeywords: ['loq'], type: 'laptop', priceRange: [700, 1500] },
  { manufacturer: 'Lenovo', series: 'ThinkCentre', modelKeywords: ['thinkcentre'], type: 'desktop', priceRange: [500, 1500] },
  { manufacturer: 'Lenovo', series: 'IdeaCentre', modelKeywords: ['ideacentre'], type: 'desktop', priceRange: [400, 1200] },
  { manufacturer: 'Lenovo', series: 'Legion Tower', modelKeywords: ['legion'], type: 'desktop', priceRange: [1000, 3500] },

  // Dell
  { manufacturer: 'Dell', series: 'XPS 13', modelKeywords: ['xps 13', 'xps13'], type: 'laptop', priceRange: [1000, 2000] },
  { manufacturer: 'Dell', series: 'XPS 15', modelKeywords: ['xps 15', 'xps15'], type: 'laptop', priceRange: [1300, 2500] },
  { manufacturer: 'Dell', series: 'XPS 17', modelKeywords: ['xps 17', 'xps17'], type: 'laptop', priceRange: [1500, 3000] },
  { manufacturer: 'Dell', series: 'Inspiron', modelKeywords: ['inspiron'], type: 'laptop', priceRange: [400, 1000] },
  { manufacturer: 'Dell', series: 'Latitude', modelKeywords: ['latitude'], type: 'laptop', priceRange: [800, 2000] },
  { manufacturer: 'Dell', series: 'Precision', modelKeywords: ['precision'], type: 'workstation', priceRange: [1500, 5000] },
  { manufacturer: 'Dell', series: 'G Series', modelKeywords: ['g15', 'g16'], type: 'laptop', priceRange: [800, 1500] },
  { manufacturer: 'Dell', series: 'Alienware', modelKeywords: ['alienware'], type: 'laptop', priceRange: [1500, 4000] },
  { manufacturer: 'Dell', series: 'OptiPlex', modelKeywords: ['optiplex'], type: 'desktop', priceRange: [600, 1500] },

  // Asus
  { manufacturer: 'Asus', series: 'ZenBook', modelKeywords: ['zenbook'], type: 'laptop', priceRange: [800, 1800] },
  { manufacturer: 'Asus', series: 'ROG Zephyrus', modelKeywords: ['zephyrus'], type: 'laptop', priceRange: [1500, 3000] },
  { manufacturer: 'Asus', series: 'ROG Strix', modelKeywords: ['strix'], type: 'laptop', priceRange: [1200, 2500] },
  { manufacturer: 'Asus', series: 'TUF Gaming', modelKeywords: ['tuf'], type: 'laptop', priceRange: [800, 1500] },
  { manufacturer: 'Asus', series: 'VivoBook', modelKeywords: ['vivobook'], type: 'laptop', priceRange: [400, 900] },
  { manufacturer: 'Asus', series: 'ExpertBook', modelKeywords: ['expertbook'], type: 'laptop', priceRange: [1000, 2000] },

  // Acer
  { manufacturer: 'Acer', series: 'Swift', modelKeywords: ['swift'], type: 'laptop', priceRange: [600, 1200] },
  { manufacturer: 'Acer', series: 'Aspire', modelKeywords: ['aspire'], type: 'laptop', priceRange: [400, 900] },
  { manufacturer: 'Acer', series: 'Predator Helios', modelKeywords: ['predator', 'helios'], type: 'laptop', priceRange: [1200, 2500] },
  { manufacturer: 'Acer', series: 'Nitro', modelKeywords: ['nitro'], type: 'laptop', priceRange: [700, 1500] },
  { manufacturer: 'Acer', series: 'ConceptD', modelKeywords: ['conceptd'], type: 'laptop', priceRange: [1500, 3000] }
]

// ---------- Model Detection (unchanged) ----------
const systemManufacturer = computed(() => g(data, 'system.manufacturer', '').toLowerCase())
const systemModel = computed(() => g(data, 'system.model', '').toLowerCase())

const brandModelMatch = computed(() => {
  if (!systemManufacturer.value || !systemModel.value) return null
  const manu = systemManufacturer.value
  const model = systemModel.value
  const brandEntries = brandModelDatabase.filter(entry =>
    manu.includes(entry.manufacturer.toLowerCase())
  )
  if (brandEntries.length === 0) return null
  return brandEntries.find(entry =>
    entry.modelKeywords.some(k => model.includes(k.toLowerCase()))
  ) || null
})

// ---------- Seller's Claimed Model (now used as reference price source) ----------
const selectedModel = ref<string | null>(null) // value is manufacturer series
const ignoreSeriesPrice = ref(false)

const modelOptions = computed(() => {
  const options = brandModelDatabase.map(entry => ({
    label: `${entry.manufacturer} ${entry.series} ($${entry.priceRange[0]} – $${entry.priceRange[1]})`,
    value: `${entry.manufacturer} ${entry.series}`
  }))
  // add a "None" option at top
  options.unshift({ label: 'Select a model (optional)', value: '' })
  return options
})

const selectedEntry = computed(() => {
  if (!selectedModel.value) return null
  return brandModelDatabase.find(e =>
    `${e.manufacturer} ${e.series}` === selectedModel.value
  ) || null
})

// ---------- Fair Price Calculation based on selected series ----------
const isUsedDevice = ref(true)

const fairPrice = computed(() => {
  const ageYears = store.ageInYears ?? 0
  if (!selectedEntry.value || ignoreSeriesPrice.value) return null

  const newLow = selectedEntry.value.priceRange[0]
  const newHigh = selectedEntry.value.priceRange[1]

  if (!isUsedDevice.value) {
    // new device
    return {
      used: false,
      lowEstimate: newLow,
      highEstimate: newHigh,
      newPriceRange: [newLow, newHigh] as [number, number]
    }
  } else {
    // used device – apply depreciation and condition deductions
    const ageFactor = Math.min(0.6, ageYears * 0.07) // up to 60%
    const ageMultiplier = 1 - ageFactor

    let usedLow = newLow * ageMultiplier
    let usedHigh = newHigh * ageMultiplier

    let deductions = 0
    if (diskSmartFail.value) deductions += 80
    if (isPassiveThrottling.value || stressResult.value?.throttled) deductions += 40
    if (isCpuTempHigh.value) deductions += 25
    if (isBatteryWeak.value) deductions += 30
    if (cpuVerdict.value.color === 'error') deductions += 30

    usedLow = Math.max(0, usedLow - deductions)
    usedHigh = Math.max(0, usedHigh - deductions)

    return {
      used: true,
      lowEstimate: Math.round(usedLow),
      highEstimate: Math.round(usedHigh),
      newPriceRange: [newLow, newHigh] as [number, number]
    }
  }
})

// ---------- Seller's Asking Price ----------
const sellerPrice = ref<number | null>(null)
const dealVerdict = computed(() => {
  if (sellerPrice.value === null || isNaN(sellerPrice.value)) return null
  if (!fairPrice.value) {
    return { text: 'No reference price selected', color: 'default' as const }
  }

  const low = fairPrice.value.lowEstimate
  const high = fairPrice.value.highEstimate

  if (fairPrice.value.used) {
    if (sellerPrice.value <= low) return { text: 'Excellent deal!', color: 'success' as const }
    if (sellerPrice.value <= high) return { text: 'Fair price', color: 'info' as const }
    if (sellerPrice.value <= high * 1.2) return { text: 'Slightly overpriced', color: 'warning' as const }
    return { text: 'Overpriced – negotiate!', color: 'error' as const }
  } else {
    // new device comparison
    if (sellerPrice.value <= low) return { text: 'Below typical new price', color: 'info' as const }
    if (sellerPrice.value <= high) return { text: 'Within new price range', color: 'success' as const }
    return { text: 'Above typical new price', color: 'warning' as const }
  }
})

// ---------- Comparison Tables (unchanged) ----------
const cpuComparisonTable = computed(() => {
  const brand = cpuBrand.value
  if (brand === 'Unknown') return { entries: [], current: null }
  const entries = processorDatabase.filter(e => e.brand === brand).sort((a,b) => a.tier - b.tier || b.year - a.year)
  const current = cpuMatchedEntry.value
  return { entries, current }
})

const ramComparison = computed(() => {
  const total = (mem.value?.total || 0) / (1024 ** 3)
  const ddrType = data.value?.memLayout?.[0]?.type || 'DDR?'
  const rows = [
    { size: '32 GB+', type: 'DDR4/DDR5', verdict: 'Heavy multitasking, VMs' },
    { size: '16 GB', type: 'DDR4/DDR5', verdict: 'Comfortable for most' },
    { size: '8 GB', type: 'DDR3/DDR4', verdict: 'Basic usage' },
    { size: '4 GB', type: 'DDR3', verdict: 'Insufficient' },
  ]
  const pos = total >= 32 ? 0 : total >= 16 ? 1 : total >= 8 ? 2 : 3
  return { rows, pos, total, ddrType }
})

const storageComparison = computed(() => {
  const types = diskLayout.value?.map(d => {
    if (d.interfaceType?.includes('NVMe')) return 'NVMe SSD'
    if (d.interfaceType?.includes('SATA') && d.type !== 'HD') return 'SATA SSD'
    if (d.type === 'HD') return 'HDD'
    return 'Unknown'
  }) || []
  const rows = [
    { type: 'NVMe SSD', speed: '~3000+ MB/s', verdict: 'Excellent' },
    { type: 'SATA SSD', speed: '~550 MB/s', verdict: 'Good' },
    { type: 'HDD', speed: '~100 MB/s', verdict: 'Slow' },
  ]
  return { rows, currentTypes: types }
})

const batteryComparison = computed(() => {
  if (!battery.value?.hasBattery) return null
  const health = parseFloat(batteryHealth.value || '0')
  const rows = [
    { range: '90–100%', label: 'Excellent', color: 'success' },
    { range: '80–90%', label: 'Good', color: 'success' },
    { range: '60–80%', label: 'Worn', color: 'warning' },
    { range: 'Below 60%', label: 'Replace soon', color: 'error' }
  ]
  const pos = health >= 90 ? 0 : health >= 80 ? 1 : health >= 60 ? 2 : 3
  return { rows, pos, health }
})
</script>

<template>
  <div v-if="store.loading" class="h-screen flex justify-center items-center">
    <div class="i-svg-spinners:90-ring-with-bg text-6xl text-blue-500" />
    <span class="ml-4 text-xl">Scanning system…</span>
  </div>

  <div v-else-if="store.error" class="max-w-xl mx-auto mt-20">
    <n-card title="Error" type="error">
      {{ store.error }}
      <br /><n-button @click="store.fetchSystemInfo()" type="error">Retry</n-button>
    </n-card>
  </div>

  <div v-else-if="data" class="p-6 max-w-5xl mx-auto space-y-6">
    <!-- Warnings -->
    <n-card v-if="warnings.length" type="warning" title="⚠️ Issues Found">
      <ul class="list-disc ml-4"><li v-for="w in warnings" :key="w">{{ w }}</li></ul>
    </n-card>

    <!-- Price Negotiation Tips -->
    <n-card v-if="negotiationTips.length" title="💰 Price Negotiation Advice">
      <div v-for="(tip, idx) in negotiationTips" :key="idx" class="text-sm mb-1">
        {{ tip.issue }} – <strong class="text-red-500">suggested discount {{ tip.discount }}</strong>
      </div>
    </n-card>

    <!-- PRICE ESTIMATION (Series-based) -->
    <n-card title="💵 Price Estimation">
      <div class="mb-3">
        <n-checkbox v-model:checked="isUsedDevice">Used Device</n-checkbox>
        <span class="text-xs text-gray-500 ml-2">
          {{ isUsedDevice ? 'Estimating used value based on depreciation and condition.' : 'Comparing to new price range.' }}
        </span>
      </div>

      <div class="mb-4">
        <label class="text-sm font-medium block mb-1">Select Laptop/PC Model (for price reference)</label>
        <n-select
          v-model:value="selectedModel"
          :options="modelOptions"
          placeholder="Choose a model…"
          clearable
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <n-checkbox v-model:checked="ignoreSeriesPrice">Ignore series price (no reference)</n-checkbox>
      </div>

      <!-- Detected model info -->
      <div v-if="brandModelMatch" class="text-xs text-gray-600 mb-3">
        Detected system model: <strong>{{ brandModelMatch.manufacturer }} {{ brandModelMatch.series }}</strong>
      </div>

      <!-- Selected series price range display -->
      <div v-if="selectedEntry && !ignoreSeriesPrice" class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
        <div class="text-sm font-medium">Reference New Price Range:</div>
        <div class="text-lg font-bold mt-1">
          ${{ selectedEntry.priceRange[0].toLocaleString() }} – ${{ selectedEntry.priceRange[1].toLocaleString() }}
        </div>
        <div class="text-gray-500">
          PKR {{ (selectedEntry.priceRange[0] * USD_TO_PKR).toLocaleString() }} – {{ (selectedEntry.priceRange[1] * USD_TO_PKR).toLocaleString() }}
        </div>
        <div v-if="fairPrice && fairPrice.used" class="mt-2 text-sm">
          Estimated Used Value (after depreciation & issues):
          <div class="font-bold text-green-600">
            ${{ fairPrice.lowEstimate.toLocaleString() }} – ${{ fairPrice.highEstimate.toLocaleString() }}
          </div>
          <div class="text-gray-500">
            PKR {{ (fairPrice.lowEstimate * USD_TO_PKR).toLocaleString() }} – {{ (fairPrice.highEstimate * USD_TO_PKR).toLocaleString() }}
          </div>
        </div>
      </div>

      <!-- Seller's Asking Price -->
      <n-divider />
      <div class="flex items-center gap-4 mt-2">
        <span class="text-sm font-medium">Seller’s Asking Price (USD):</span>
        <n-input-number v-model:value="sellerPrice" :min="0" :step="50" placeholder="Enter price in $" />
        <n-tag v-if="dealVerdict" :type="dealVerdict.color" size="small">{{ dealVerdict.text }}</n-tag>
      </div>
      <div v-if="sellerPrice !== null && !isNaN(sellerPrice)" class="text-xs text-gray-500 mt-1">
        PKR {{ (sellerPrice! * USD_TO_PKR).toLocaleString() }}
      </div>
      <p class="text-xs text-gray-500 mt-2">
        Compare seller’s price against the selected model’s {{ isUsedDevice ? 'estimated used value' : 'new price range' }}.
      </p>
    </n-card>

    <!-- Age -->
    <n-card size="small" class="text-center">
      <n-statistic label="Estimated Device Age">{{ store.ageInYears ? store.ageInYears + ' years' : 'Unknown' }}</n-statistic>
    </n-card>

    <!-- System Hardware -->
    <n-card title="🖥 System Hardware">
      <n-descriptions bordered :column="1" label-placement="left">
        <n-descriptions-item label="Manufacturer">{{ g(data, 'system.manufacturer') }}</n-descriptions-item>
        <n-descriptions-item label="Model">{{ g(data, 'system.model') }}</n-descriptions-item>
        <n-descriptions-item label="Serial">{{ g(data, 'system.serial') }}</n-descriptions-item>
        <n-descriptions-item label="Virtual Machine">
          <n-tag :type="data.system?.virtual ? 'warning' : 'success'">{{ data.system?.virtual ? 'Yes' : 'No' }}</n-tag>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <!-- BIOS -->
    <n-card title="🔧 BIOS">
      <n-descriptions bordered :column="1" label-placement="left">
        <n-descriptions-item label="Vendor">{{ g(data, 'bios.vendor') }}</n-descriptions-item>
        <n-descriptions-item label="Version">{{ g(data, 'bios.version') }}</n-descriptions-item>
        <n-descriptions-item label="Date">
          <span :class="isOldBios ? 'text-red-500 font-bold' : ''">{{ g(data, 'bios.releaseDate') }}</span>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <!-- CPU -->
    <n-card title="🧠 Processor (CPU)">
      <n-descriptions bordered :column="1" label-placement="left">
        <n-descriptions-item label="Model">{{ cpu?.brand }}</n-descriptions-item>
        <n-descriptions-item label="Cores / Physical">{{ cpu?.cores }} ({{ cpu?.physicalCores }} physical)</n-descriptions-item>
        <n-descriptions-item label="Base / Max GHz">{{ cpu?.speed }} / {{ cpu?.speedMax }}</n-descriptions-item>
        <n-descriptions-item label="Passive Throttling">
          <n-tag :type="isPassiveThrottling ? 'error' : 'success'">{{ isPassiveThrottling ? 'Detected' : 'Not detected' }}</n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="Temperature">
          <span :class="isCpuTempHigh ? 'text-red-500 font-bold' : ''">{{ cpuTemp?.main ?? '—' }}°C</span>
        </n-descriptions-item>
      </n-descriptions>

      <n-divider />
      <div class="text-sm font-medium mb-2">Active Throttling Test</div>
      <n-button type="primary" :loading="stressRunning" @click="runStressTest" :disabled="stressRunning">
        {{ stressRunning ? 'Running (10 sec)...' : 'Start Throttling Test' }}
      </n-button>
      <div v-if="stressResult" class="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
        <p class="text-sm"><strong>Base Speed:</strong> {{ stressResult.baseSpeed.toFixed(2) }} GHz</p>
        <p class="text-sm"><strong>Avg Speed under load:</strong> {{ stressResult.avgSpeed.toFixed(2) }} GHz</p>
        <p class="text-sm"><strong>Min Speed:</strong> {{ stressResult.minSpeed.toFixed(2) }} GHz</p>
        <p class="text-sm">
          <strong>Verdict:</strong>
          <n-tag :type="stressResult.throttled ? 'error' : 'success'" size="small" class="ml-2">
            {{ stressResult.throttled ? 'Throttled' : 'No throttling' }}
          </n-tag>
        </p>
      </div>

      <n-divider />
      <div class="text-sm font-medium mb-1">Buyer’s Verdict</div>
      <n-tag :type="cpuVerdict.color" size="small">{{ cpuVerdict.text }}</n-tag>
      <p v-if="cpuVerdict.suffixDetail" class="text-xs text-gray-500 mt-1">{{ cpuVerdict.suffixDetail }}</p>

      <n-divider />
      <p class="text-sm font-medium mb-2">Processor Hierarchy ({{ cpuBrand }}) – Your CPU highlighted</p>
      <n-table :single-line="false" size="small" v-if="cpuComparisonTable.entries.length">
        <thead><tr><th>Series</th><th>Generation</th><th>Suffix</th><th>Tier</th><th>Year</th><th>Notes</th></tr></thead>
        <tbody>
          <tr v-for="entry in cpuComparisonTable.entries" :key="entry.series + entry.generation + entry.suffix"
              :class="{ 'bg-blue-50 dark:bg-blue-900 font-bold': entry === cpuComparisonTable.current }">
            <td>{{ entry.series }}</td><td>{{ entry.generation }}</td><td>{{ entry.suffix || '—' }}</td><td>{{ entry.tierLabel }}</td><td>{{ entry.year }}</td><td class="text-xs">{{ entry.notes }}</td>
          </tr>
        </tbody>
      </n-table>
      <div v-else class="text-gray-400 text-sm">Could not determine processor brand.</div>
    </n-card>

    <!-- Memory -->
    <n-card title="🧮 Memory (RAM)">
      <n-descriptions bordered :column="1" label-placement="left">
        <n-descriptions-item label="Total">{{ formatBytes(mem?.total) }}</n-descriptions-item>
        <n-descriptions-item label="Used / Available">{{ formatBytes(mem?.used) }} / {{ formatBytes(mem?.available) }}</n-descriptions-item>
      </n-descriptions>
      <n-divider />
      <div class="text-sm font-medium mb-1">Installed Modules</div>
      <div v-if="data.memLayout?.length" class="space-y-2">
        <div v-for="(stick, idx) in data.memLayout" :key="idx" class="border rounded p-2 text-sm">
          {{ stick.bank }} – {{ formatBytes(stick.size) }}, {{ stick.type }}, {{ stick.clockSpeed }}MHz, {{ stick.formFactor }}
        </div>
      </div>
      <div v-else class="text-gray-400">No layout data (may be soldered).</div>
      <n-divider />
      <div class="text-sm font-medium mb-1">Buyer’s Verdict</div>
      <n-tag :type="ramVerdict.color" size="small">{{ ramVerdict.text }}</n-tag>
      <p class="text-xs text-gray-500 mt-1">⚡ {{ ramVerdict.dual }}</p>

      <n-divider />
      <p class="text-sm font-medium mb-2">RAM Tier Comparison</p>
      <n-table :single-line="false" size="small">
        <thead><tr><th>Capacity</th><th>Type</th><th>Verdict</th></tr></thead>
        <tbody>
          <tr v-for="(r, idx) in ramComparison.rows" :key="r.size" :class="{ 'bg-blue-50 dark:bg-blue-900 font-bold': idx === ramComparison.pos }">
            <td>{{ r.size }}</td><td>{{ r.type }}</td><td>{{ r.verdict }}</td>
          </tr>
        </tbody>
      </n-table>
      <p class="text-xs mt-1 text-gray-500">Your RAM: {{ ramComparison.total?.toFixed(1) }} GB, {{ ramComparison.ddrType }}</p>
    </n-card>

    <!-- Graphics -->
    <n-card title="🎮 Graphics (GPU)">
      <div v-if="graphics?.controllers?.length">
        <div v-for="(ctrl, idx) in graphics.controllers" :key="idx" class="mb-3">
          <div class="font-semibold">{{ ctrl.model }} ({{ ctrl.vendor }})</div>
          <div class="text-xs text-gray-500">VRAM: {{ ctrl.vram ? ctrl.vram + ' MB' : 'Shared' }}, Bus: {{ ctrl.bus }}</div>
        </div>
        <n-divider />
        <n-tag v-if="graphics.controllers.some((c: any) => c.vram > 0 && !c.vramDynamic)" type="success" size="small">Dedicated GPU present</n-tag>
        <n-tag v-else type="default" size="small">Integrated graphics only</n-tag>
      </div>
      <div v-else class="text-gray-400">No GPU detected.</div>
    </n-card>

    <!-- Storage -->
    <n-card title="💾 Storage">
      <div v-if="diskVerdicts.length" class="space-y-4">
        <div v-for="(disk, idx) in diskVerdicts" :key="idx" class="border rounded p-3">
          <n-descriptions :column="1" label-placement="left" size="small">
            <n-descriptions-item label="Device">{{ disk.device }}</n-descriptions-item>
            <n-descriptions-item label="Name">{{ disk.name }}</n-descriptions-item>
            <n-descriptions-item label="Type">{{ disk.type }}</n-descriptions-item>
            <n-descriptions-item label="Size">{{ formatBytes(disk.size) }}</n-descriptions-item>
            <n-descriptions-item label="SMART">
              <n-tag :type="(disk.smartStatus || '').toUpperCase() === 'OK' ? 'success' : 'error'">{{ disk.smartStatus }}</n-tag>
            </n-descriptions-item>
            <n-descriptions-item label="Temp">{{ disk.temperature ?? '—' }}°C</n-descriptions-item>
            <n-descriptions-item v-if="disk.smartData?.power_on_time" label="Power‑On Hours">{{ disk.smartData.power_on_time.hours }}h</n-descriptions-item>
            <n-descriptions-item v-if="disk.smartData?.nvme_smart_health_information_log?.percentage_used" label="NVMe Wear">{{ disk.smartData.nvme_smart_health_information_log.percentage_used }}%</n-descriptions-item>
          </n-descriptions>
          <div class="mt-2 text-sm font-medium">Buyer’s Verdict</div>
          <n-tag :type="disk.color" size="small">{{ disk.verdict }}</n-tag>
        </div>
      </div>
      <div v-else class="text-gray-400">No disk info.</div>

      <n-divider />
      <p class="text-sm font-medium mb-2">Storage Type Comparison</p>
      <n-table :single-line="false" size="small">
        <thead><tr><th>Type</th><th>Speed</th><th>Verdict</th></tr></thead>
        <tbody>
          <tr v-for="r in storageComparison.rows" :key="r.type" :class="{ 'bg-blue-50 dark:bg-blue-900 font-bold': storageComparison.currentTypes.includes(r.type) }">
            <td>{{ r.type }}</td><td>{{ r.speed }}</td><td>{{ r.verdict }}</td>
          </tr>
        </tbody>
      </n-table>
      <p class="text-xs mt-1 text-gray-500">Your drives: {{ storageComparison.currentTypes.join(', ') }}</p>
    </n-card>

    <!-- Battery -->
    <n-card v-if="battery?.hasBattery" title="🔋 Battery">
      <n-descriptions bordered :column="1" label-placement="left">
        <n-descriptions-item label="Status">{{ battery.isCharging ? 'Charging' : 'Discharging' }} ({{ battery.percent }}%)</n-descriptions-item>
        <n-descriptions-item label="Health">{{ batteryHealth ?? '—' }}%</n-descriptions-item>
        <n-descriptions-item label="Cycles">{{ battery.cycleCount }}</n-descriptions-item>
      </n-descriptions>
      <n-divider />
      <div class="text-sm font-medium mb-1">Buyer’s Verdict</div>
      <n-tag v-if="batteryVerdict" :type="batteryVerdict.color" size="small">{{ batteryVerdict.text }}</n-tag>

      <n-divider />
      <p class="text-sm font-medium mb-2">Battery Health Comparison</p>
      <div v-for="(r, idx) in batteryComparison?.rows" :key="r.range"
           class="flex items-center mb-1 text-sm"
           :class="{ 'bg-blue-100 dark:bg-blue-800 rounded px-2 py-1': idx === (batteryComparison?.pos ?? -1) }">
        <div class="w-24">{{ r.range }}</div>
        <div class="flex-1"><n-progress type="line" :percentage="(idx === (batteryComparison?.pos ?? -1) ? 100 : (idx < (batteryComparison?.pos ?? -1) ? 60 : 20))" :color="r.color" :height="8" /></div>
        <div class="ml-2">{{ r.label }}</div>
      </div>
      <p class="text-xs mt-1 text-gray-500">Your battery health: {{ batteryComparison?.health }}%</p>
    </n-card>

    <!-- Manual Checklist -->
    <n-card title="📝 Manual Inspection Checklist">
      <p class="text-xs text-gray-500 mb-2">Tick each item as you physically check.</p>
      <NSpace vertical>
        <n-checkbox v-for="(item, idx) in manualChecks" :key="idx" v-model:checked="item.done">{{ item.label }}</n-checkbox>
      </NSpace>
      <n-divider />
      <n-tag :type="allChecked ? 'success' : 'warning'" size="small">
        {{ allChecked ? 'All done' : `${manualChecks.filter(i => i.done).length} / ${manualChecks.length}` }}
      </n-tag>
    </n-card>
  </div>
</template>