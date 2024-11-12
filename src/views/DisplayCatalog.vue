<script setup>
import {
  getDirectoryFiles,
  filterCases,
  downloadFile,
  viewImage
} from '@/api/api'
import { ref, watch } from 'vue'
import { useLocationHandler } from '@/stores/location'
import folder from '../assets/folder.svg'
import image from '../assets/image.svg'
import db from '../assets/db.svg'
import { storeToRefs } from 'pinia'

const store = useLocationHandler()
const { changeLocation } = store

const folders = ref([])
const active = ref(null)
const previewImage = ref(null)

const { location, folderLoc } = storeToRefs(store)

const initial = async (directory, folder_name) => {
  folders.value = await getDirectoryFiles(directory, folder_name);
}

initial('Catalog', '');

let tempLocation;
watch(folderLoc, async () => {
  tempLocation = location.value.map((el) => el.name)
  initial(tempLocation.at(0), tempLocation.slice(1).join('/'))
})

const handleDownload = async (folder_name) => {
  try {
    await downloadFile(tempLocation.at(0), tempLocation.slice(1).join('/') + '/' + folder_name);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

const displayFileName = (name) => {
  if (name.length < 12) {
    return name;
  }
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex === -1) {
    return `..${name.slice(-10)}`;
  }
  const nameWithoutExtension = name.slice(0, dotIndex);
  const extension = name.slice(dotIndex);
  const shortName = nameWithoutExtension.slice(-10);
  return `..${shortName}${extension}`;
}

const handleViewImage = async (item) => {
  try {
    const response = await viewImage(tempLocation.at(0), tempLocation.slice(1).join('/'), item.name);
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    previewImage.value = url;
  } catch (error) {
    console.error('Error viewing image:', error);
  }
};

const closePreview = () => {
  window.URL.revokeObjectURL(previewImage.value);
  previewImage.value = null;
};

const searchForm = ref({
    case_no: "",
    ip_case: "",
    ip_object_type: "",
    ip_case_name: "",
    ip_author: "",
    ip_applicant: "",
    ip_classes: ""
})

const runSearch = async () => {
  try {
    const response = await filterCases(searchForm.value)
    folders.value = response.data.folder_locations.map(location => {
      return {
        path: location,
        name: location.split('/').pop(),
        format: 'Folder'
      }
    });
    closeSearch()
  } catch (error) {
    console.error('Error filtering cases:', error)
  }
}

const closeSearch = () => {
  searchForm.value = {
    case_no: "",
    ip_case: "",
    ip_object_type: "",
    ip_case_name: "",
    ip_author: "",
    ip_applicant: "",
    ip_classes: ""
  }
}

const submitHandler = async (event) => {
  event.preventDefault()
  await runSearch()
}
</script>

<template>
 
  <div style="display: flex; flex-wrap: wrap; gap: 24px; margin: 24px">
    <form @submit.prevent="submitHandler">
      <label>განაცხადის ნომერი</label>
      <input v-model="searchForm.case_no" type="text" placeholder="" />
      <label>განცხადების ნომერი(საქმის ნომერი)</label>
      <input v-model="searchForm.ip_case" type="text" placeholder="" />
      <label>ინტელექტუალური საკუთრების ობიექტის განმცხადებელი</label>
      <input v-model="searchForm.ip_applicant" type="text" placeholder="" />
      <label>ინტელექტუალური საკუთრების ობიექტის ავტორი</label>
      <input v-model="searchForm.ip_author" type="text" placeholder="" />
      <label>ინტელექტუალური საკუთრების ობიექტის დასახელება</label>
      <input v-model="searchForm.ip_case_name" type="text" placeholder="" />
      <label>ინტელექტუალური საკუთრების ობიექტი</label>
      <input v-model="searchForm.ip_object_type" type="text" placeholder="" />
      <label>ინტელექტუალური საკუთრების ობიექტის კლასები</label>
      <input v-model="searchForm.ip_classes" type="text" placeholder="" />

      <div style="display: flex; justify-content: end; align-items: end">
        <button class="button-30" role="button" type="submit">ძებნა</button>
      </div>
    </form>

    
    <div
      v-for="item in folders"
      :key="item.path"
      class="singleFolder"
      @click="active = item.path"
      @dblclick="changeLocation({ name: item.name, format: item.format })"
    >
    <template v-if="item.format !== 'db'">
      <img
        :src="item.format === 'Folder' ? folder : item.format === 'db' ? db : image"
        alt="folder"
      />
      <p style="font-weight: 500">
        {{ displayFileName(item.name) }}
      </p>
      <div v-if="active === item.path" class="moreAction">
        <button class="button-30" @click="handleDownload(item.name)">Download</button>
        <p
          class="singleText"
          style="font-size: 14px; font-weight: 300"
          v-if="item.format !== 'Folder'"
          @click="handleViewImage(item)"
        >
          Preview
        </p>
      </div>
    </template>
  </div>

    <!-- Display the image preview -->
    <div v-if="previewImage" class="image-preview">
      <img :src="previewImage" alt="Preview" />
      <button class="button-30" @click="closePreview">Close</button>
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
input {
  font-size: 22px;
}

::placeholder {
  color: red;
  opacity: 1; /* Firefox */
}

::-ms-input-placeholder {
  /* Edge 12-18 */
  color: red;
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
