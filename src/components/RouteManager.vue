<script setup>
import { getDirectoryFiles } from '@/api/api'
import { ref } from 'vue'
import { useLocationHandler } from '@/stores/location'
import { storeToRefs } from 'pinia'

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
</script>

<template>
  <div class="folder">
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
    <!-- <h1 class="green">{{ msg }}</h1> -->
  </div>
</template>

<style scoped>
.folder {
  display: flex;
  align-items: center;
  /* box-shadow: 5px 5px 15px rgb(154, 148, 148); */
  min-width: 100vw;
  background-color: #ffffff;
  /* color: darkblue; */
  color: rgb(14, 22, 22);
  padding: 24px 24px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
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
