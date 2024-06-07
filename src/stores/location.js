import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLocationHandler = defineStore('location', () => {
  const userRole = ref(localStorage.getItem('role'))
  const location = ref([{ name: 'Scanners', format: 'Folder' }])

  if (userRole.value == 2) {
    location.value = [{ name: 'Redactors', format: 'Folder' }]
  }

  const folderLoc = computed(() => {
    return location.value.length
  })

  const changeLocation = (val) => {
    location.value.push(val)
  }

  const backToLocation = (val) => {
    location.value = location.value.slice(0, val + 1)
  }

  return { location, changeLocation, backToLocation, folderLoc }
})
