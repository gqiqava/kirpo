import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLocationHandler = defineStore('location', () => {
  const userRole = ref(localStorage.getItem('role'))
  const showNavigation = ref(false)
  const isLoading = ref(false)

  const location = ref([{ name: 'Catalog', format: 'Folder' }])

  if (userRole.value == 1) {
    location.value = [{ name: 'Scanners', format: 'Folder' }]
  }

  if (userRole.value == 2) {
    location.value = [{ name: 'Redactors', format: 'Folder' }]
  }

  if (userRole.value == 3) {
    location.value = [{ name: 'Initial', format: 'Folder' }]
  }

  const folderLoc = computed(() => {
    return location.value.length
  })

  const changeLocation = (val) => {
    location.value.push(val)
  }

  const setShowNavigation = (val) => {
    showNavigation.value = val
  }

  const setIsLoading = (val) => {
    isLoading.value = val
  }


  const backToLocation = (val) => {
    location.value = location.value.slice(0, val + 1)
  }

  return { location, changeLocation, backToLocation, folderLoc, showNavigation, setShowNavigation, setIsLoading, isLoading }
})
