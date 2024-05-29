<script setup>
import { getDirectoryFiles } from '@/api/api'
import { ref } from 'vue'
// defineProps({
//   msg: {
//     type: String,
//     required: true
//   }
// })
const folders = ref()
folders.value = getDirectoryFiles()
</script>

<template>
  <div class="folder">
    <p v-for="item in folders" :key="item.name" class="singleFolder">{{ item.name }}</p>
    <!-- <h1 class="green">{{ msg }}</h1> -->
  </div>
</template>

<style scoped>
.folder {
  margin-right: 12px;
  box-shadow: 5px 5px 15px rgb(154, 148, 148);
  min-height: 100vh;
  padding: 0px 24px;
}
.singleFolder {
  font-size: 24px;
  margin-top: 0px;
}
</style>
