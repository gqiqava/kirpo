<script setup>
import { getDirectoryFiles,
  logout
 } from '@/api/api'
import { ref } from 'vue'
import { useLocationHandler } from '@/stores/location'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import arrow from '../assets/arrow.svg'
import folder from '../assets/folder.svg'
import image from '../assets/image.svg'
import db from '../assets/db.svg'
// defineProps({
//   msg: {
//     type: String,
//     required: true
//   }
// })

const store = useLocationHandler()
const { location } = storeToRefs(store)
const { backToLocation } = store

const folders = ref()
folders.value = getDirectoryFiles()
const router = useRouter()
const handleLogout = async () => {
  try {
    await logout();
    router.push('/')

  } catch (error) {
    console.error('Error during logout:', error);
  }
}
</script>

<template>
  <div class="folder">
    <div style="display: flex; align-items: center">
      <p
      v-for="(item, index) in location"
      :key="item.name"
      class="singleFolder"
      @click="backToLocation(index)"
    >
      <img v-if="index !== 0" :src="arrow" alt="arrow" class="arrow" />
      <img
        :src="item.format === 'Folder' ? folder : item.format === 'db' ? db : image"
        alt="image"
        style="width: 25px; height: 25px; margin-right: 6px"
      /><span class="location">{{ item.name }}</span>
    </p>
    </div>
    <!-- other components and content -->
    <button class="logout-button" @click="handleLogout">Logout</button>
  </div>
</template>

<style scoped>
.folder {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* box-shadow: 5px 5px 15px rgb(154, 148, 148); */
  width: 100%;
  background-color: #ffffff;
  /* color: darkblue; */
  color: rgb(14, 22, 22);
  padding: 24px 24px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.logout-container {
  display: flex;
  justify-content: flex-end; /* Aligns button to the right */
  padding: 10px;
}

.logout-button {
  display: inline-block;
  padding: 14px 36px;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  letter-spacing: 1.2px;
  transition: all 0.4s ease;
  position: relative;
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.1), 
    0 10px 20px rgba(255, 75, 43, 0.3);
}

.logout-button:hover {
  background: linear-gradient(135deg, #ff4b2b, #ff416c);
  transform: translateY(-4px);
  box-shadow: 
    0 5px 8px rgba(0, 0, 0, 0.15), 
    0 12px 25px rgba(255, 75, 43, 0.4);
}

.logout-button:active {
  transform: translateY(2px);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.2);
}

.singleFolder {
  font-size: 20px;
  margin-top: 0px;
  display: flex;
  align-items: center;
}
.arrow {
  margin: 0px 8px;
}
.location:hover {
  color: darkblue;
  text-decoration: underline;
  cursor: pointer;
}
</style>
