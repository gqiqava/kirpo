<script setup>
import {
  getDirectoryFiles,
  createFolderAnnotation,
  getFolderAnnotation,
  editFolderAnnotation
} from '@/api/api'
import { ref } from 'vue'
import { useLocationHandler } from '@/stores/location'
import folder from '../assets/folder.svg'
import image from '../assets/image.svg'
import db from '../assets/db.svg'
import Modal from '../components/Modal.vue'

const store = useLocationHandler()
const { changeLocation } = store

const folders = ref()
const active = ref(null)
const annotationForm = ref({
  folder_no: null,
  year: null,
  description: null,
  scanner_folder_location: null
})

//ddaamate ROute mtliani arraydan
folders.value = getDirectoryFiles('')

const isCreateModalOpened = ref(false)
const isEditModalOpened = ref(false)

const openCreateModal = () => {
  isCreateModalOpened.value = true
}
const closeCreateModal = () => {
  createFolderAnnotation(annotationForm.value)
  annotationForm.value = {
    folder_no: null,
    year: null,
    description: null,
    scanner_folder_location: null
  }
  isCreateModalOpened.value = false
}
const openEditModal = () => {
  annotationForm.value = getFolderAnnotation()
  isEditModalOpened.value = true
}
const closeEditModal = () => {
  editFolderAnnotation(annotationForm.value)
  annotationForm.value = {
    folder_no: null,
    year: null,
    description: null,
    scanner_folder_location: null
  }
  isEditModalOpened.value = false
}

const submitHandler = () => {
  //ak rame submiti ravi
}
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 24px; margin: 24px">
    <Modal
      :isOpen="isCreateModalOpened"
      @modal-close="closeCreateModal"
      @submit="submitHandler"
      name="Create-Modal"
    >
      <template #header
        ><h3 style="width: 100%; text-align: center">{{ active }}</h3></template
      >
      <template #content>
        <div style="display: flex; flex-direction: column; flex-wrap: wrap; gap: 12px">
          <label>Folder no</label>
          <input v-model="annotationForm.folder_no" type="text" />
          <label>Year</label>
          <input v-model="annotationForm.year" type="number" />
          <label>description</label>
          <input v-model="annotationForm.description" type="text" />
          <label>scanner_folder_location</label>
          <input v-model="annotationForm.scanner_folder_location" type="text" />
        </div>
      </template>
      <template #footer
        ><div style="display: flex; justify-content: end; align-items: end">
          <button class="button-30" role="button" @click="closeCreateModal">
            Create annotation
          </button>
        </div></template
      >
    </Modal>
    <Modal
      :isOpen="isEditModalOpened"
      @modal-close="closeEditModal"
      @submit="submitHandler"
      name="Edit-Modal"
    >
      <template #header
        ><h3 style="width: 100%; text-align: center">{{ active }}</h3></template
      >
      <template #content>
        <div style="display: flex; flex-direction: column; flex-wrap: wrap; gap: 12px">
          <label>Folder no</label>
          <input v-model="annotationForm.folder_no" type="text" />
          <label>Year</label>
          <input v-model="annotationForm.year" type="number" />
          <label>description</label>
          <input v-model="annotationForm.description" type="text" />
          <label>scanner_folder_location</label>
          <input v-model="annotationForm.scanner_folder_location" type="text" />
        </div>
      </template>
      <template #footer
        ><div style="display: flex; justify-content: end; align-items: end">
          <button class="button-30" role="button" @click="closeEditModal">Edit annotation</button>
        </div></template
      >
    </Modal>
    <div
      v-for="item in folders"
      :key="item.name"
      class="singleFolder"
      @click="active = item.name"
      @dblclick="changeLocation({ name: item.name, format: item.format })"
    >
      <img
        :src="item.format === 'Folder' ? folder : item.format === 'db' ? db : image"
        alt="folder"
      />
      <p style="font-weight: 500">
        {{ item.name.length < 12 ? item.name : `${item?.name.slice(0, 10)}..` }}
      </p>
      <div v-if="active === item.name" class="moreAction">
        <p
          class="singleText"
          style="font-size: 14px; font-weight: 300"
          v-if="item.format === 'jpg'"
          @click="openCreateModal"
        >
          Preview
        </p>
        <p
          class="singleText"
          style="font-size: 14px; font-weight: 300"
          v-if="item.is_annotated && item.format === 'Folder'"
          @click="openCreateModal"
        >
          Create annotation
        </p>
        <p
          class="singleText"
          style="font-size: 14px; font-weight: 300"
          v-else
          @click="openEditModal"
        >
          Edit annotation
        </p>
        <p class="singleText" style="font-size: 14px; font-weight: 300">Some annotation</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.singleFolder {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.moreAction {
  position: absolute;
  top: 147px;
  text-align: start;
  background-color: rgba(255, 255, 255, 0.8);
  width: 130px;
  border-radius: 4px;
}
.singleText {
  padding: 4px 8px;
}
.singleText:hover {
  background-color: #cde8ff;
}

/* CSS */
.button-30 {
  align-items: center;
  appearance: none;
  margin-top: 30px;
  background-color: #fcfcfd;
  border-radius: 4px;
  border-width: 0;
  box-shadow:
    rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
    #d6d6e7 0 -3px 0 inset;
  box-sizing: border-box;
  color: #36395a;
  cursor: pointer;
  display: inline-flex;
  font-family: 'JetBrains Mono', monospace;
  height: 48px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition:
    box-shadow 0.15s,
    transform 0.15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow, transform;
  font-size: 18px;
}

.button-30:focus {
  box-shadow:
    #d6d6e7 0 0 0 1.5px inset,
    rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
    #d6d6e7 0 -3px 0 inset;
}

.button-30:hover {
  box-shadow:
    rgba(45, 35, 66, 0.4) 0 4px 8px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
    #d6d6e7 0 -3px 0 inset;
  transform: translateY(-2px);
}

.button-30:active {
  box-shadow: #d6d6e7 0 3px 7px inset;
  transform: translateY(2px);
}
</style>
