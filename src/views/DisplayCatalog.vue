<script setup>
import {
  getDirectoryFiles,
  createFolderAnnotation,
  getFolderAnnotation,
  editFolderAnnotation,
  createCaseAnnotation,
  getScannerCasesByfolder,
  getCaseAnnotation,
  editCaseAnnotation,
  //Redactor API
  getFolderAnnotationRedactor,
  editFolderAnnotationRedactor,
  editCaseAnnotationRedactor,
  getScannerCasesByfolderRedactor,
  getCaseAnnotationRedactor, // Import the correct API function
  //Publish folder in catalog API
  publishCatalog
} from '@/api/api'
import { ref, watch } from 'vue'
import { useLocationHandler } from '@/stores/location'
import folder from '../assets/folder.svg'
import image from '../assets/image.svg'
import db from '../assets/db.svg'
import Modal from '../components/Modal.vue'
import { storeToRefs } from 'pinia'

const store = useLocationHandler()
const { changeLocation } = store

const folders = ref()
const active = ref(null)
const userRole = ref(localStorage.getItem('role'))
const annotationForm = ref({
  folder_no: null,
  year: null,
  description: null,
  scanner_folder_location: null,
  redactor_folder_location: null
})
const annotationFormCase = ref({
    case_no: null,
    ip_case: null,
    ip_object_type: null,
    ip_case_name:  null,
    ip_author: null,
    ip_applicant: null,
    ip_classes: null,
    page_start: null,
    page_end: null,
    scanner_folder_annotation: null
})
const cases = ref([]) // New ref for storing cases
const publishMessage = ref(''); // New ref for storing the publish message
const isPublishModalOpened = ref(false); // New ref for controlling the publish modal visibility
const folderToPublish = ref(null); // New ref for storing the folder to be publishe

const { location, folderLoc } = storeToRefs(store)

const initial = async (directory, folder_name) => {
  folders.value = await getDirectoryFiles(directory, folder_name);
}

initial('Catalog', '');
    

watch(folderLoc, async () => {
  let tempLocation = location.value.map((el) => {
    return el.name
  })
  initial(tempLocation.at(0), tempLocation.slice(1).join('/'))
})

const isCreateModalOpened = ref(false)
const isEditModalOpened = ref(false)
const isCreateCaseOpened = ref(false)
const isCasesOpen = ref(false)
const isEditCaseModalOpened = ref(false)

const openCreateModal = async (item) => {
  annotationForm.value.scanner_folder_location = item.folder_location;
  annotationForm.value.redactor_folder_location = item.folder_location;
  isCreateModalOpened.value = true
}

const openCasesModal = async (item) => {
  userRole.value == 1
    ? cases.value = await getScannerCasesByfolder(item.is_annotated)
    : cases.value = await getScannerCasesByfolderRedactor(item.is_annotated)
    console.log(cases.value.data) // Fetch cases for the specified folder
    isCasesOpen.value = true
}

const closeViewCasesModal = () =>{
  isCasesOpen.value=false
}

const runClose = () => {
  createFolderAnnotation(annotationForm.value), closeCreateModal()
}
const runEdit = () => {
  const id = annotationForm.value.id
  console.log(annotationForm)
  userRole.value == 1
    ? editFolderAnnotation(annotationForm.value, id)
    : editFolderAnnotationRedactor(annotationForm.value, id),
    closeEditModal()
}
const runCaseClose = () => {
  createCaseAnnotation(annotationFormCase.value), closeCreateCaseModal()
}
const closeCreateModal = () => {
  annotationForm.value = {
    folder_no: null,
    year: null,
    description: null,
    scanner_folder_location: null,
    redactor_folder_location: null
  }
  isCreateModalOpened.value = false
}
const openEditModal = async (annotationId) => {
  let response;
  if (userRole.value == 1) response = await getFolderAnnotation(annotationId)
  else if (userRole.value == 2) response = await getFolderAnnotationRedactor(annotationId)
  annotationForm.value = response.data; // Assuming the response structure has a `data` property
  isEditModalOpened.value = true;
};

const closeEditModal = () => {
  annotationForm.value = {
    folder_no: null,
    year: null,
    description: null,
    scanner_folder_location: null,
    redactor_folder_location: null
  }
  isEditModalOpened.value = false
}

const openCreateCaseModal = async (item) => {
  annotationFormCase.value.scanner_folder_annotation = item.is_annotated;
  isCreateCaseOpened.value = true
}

const closeCreateCaseModal = () => {
  annotationFormCase.value = {
    case_no: null,
    ip_case: null,
    ip_object_type: null,
    ip_case_name:  null,
    ip_author: null,
    ip_applicant: null,
    ip_classes: null,
    page_start: null,
    page_end: null,
    scanner_folder_annotation: null
  }
  isCreateCaseOpened.value = false
}

const currentCaseId = ref(null)

const openEditCaseModal = async (id) => {
  let response;
  if (userRole.value == 1) {
    response = await getCaseAnnotation(id);
  } else {
    response = await getCaseAnnotationRedactor(id);
  }
  currentCaseId.value = id;
  annotationFormCase.value = response.data; // Assuming the response structure has a `data` property
  isEditCaseModalOpened.value = true;
};

const closeEditCaseModal = () => {
  annotationFormCase.value = {
    case_no: null,
    ip_case: null,
    page_start: null,
    page_end: null,
    scanner_folder_annotation: null
  }
  isEditCaseModalOpened.value = false
  currentCaseId.value = null
}

const openPublishModal = (id) => {
  folderToPublish.value = id;
  isPublishModalOpened.value = true;
};

const confirmPublish = async () => {
  if (folderToPublish.value) {
    console.log(folderToPublish)
    const response = await publishCatalog(folderToPublish.value);
    publishMessage.value = response.error || "Folder published successfully";
    isPublishModalOpened.value = false;
    folderToPublish.value = null;
  }
};

const cancelPublish = () => {
  isPublishModalOpened.value = false;
  folderToPublish.value = null;
};

const runEditCase = () => {
  console.log(annotationFormCase)
  userRole.value == 1 
  ? editCaseAnnotation(annotationFormCase.value, currentCaseId.value)
  : editCaseAnnotationRedactor(annotationFormCase.value, currentCaseId.value)
  closeEditCaseModal()
}

const submitHandler = () => {
  // Handle form submission if needed
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
      <template #header>
        <h3 style="width: 100%; text-align: center">{{ active }}</h3>
      </template>
      <template #content>
        <div style="display: flex; flex-direction: column; flex-wrap: wrap; gap: 12px">
          <label>Folder no</label>
          <input v-model="annotationForm.folder_no" type="text" placeholder="*" />
          <label>Year</label>
          <input v-model="annotationForm.year" type="number" placeholder="*" />
          <label>Description</label>
          <input v-model="annotationForm.description" type="text" placeholder="*" />
          <label>Scanner Folder Location</label>
          <input v-model="annotationForm.scanner_folder_location" type="text" placeholder="*" />
          <label>Redactor Folder Location</label>
          <input v-model="annotationForm.redactor_folder_location" type="text" placeholder="*" />
        </div>
      </template>
      <template #footer>
        <div style="display: flex; justify-content: end; align-items: end">
          <button class="button-30" role="button" @click="runClose">Create Folder Annotation</button>
        </div>
      </template>
    </Modal>

    <Modal
      :isOpen="isEditModalOpened"
      @modal-close="closeEditModal"
      @submit="submitHandler"
      name="Edit-Modal"
    >
      <template #header>
        <h3 style="width: 100%; text-align: center">{{ active }}</h3>
      </template>
      <template #content>
        <div style="display: flex; flex-direction: column; flex-wrap: wrap; gap: 12px">
          <label>Folder no</label>
          <input v-model="annotationForm.folder_no" type="text" placeholder="*" />
          <label>Year</label>
          <input v-model="annotationForm.year" type="number" placeholder="*" />
          <label>Description</label>
          <input v-model="annotationForm.description" type="text" placeholder="*" />
          <label>Scanner Folder Location</label>
          <input v-model="annotationForm.scanner_folder_location" type="text" placeholder="*" />
          <label>Redactor Folder Location</label>
          <input v-model="annotationForm.redactor_folder_location" type="text" placeholder="*" />
        </div>
      </template>
      <template #footer>
        <div style="display: flex; justify-content: end; align-items: end">
          <button class="button-30" role="button" @click="runEdit">Edit Folder Annotation</button>
        </div>
      </template>
    </Modal>

    <Modal
      :isOpen="isCreateCaseOpened"
      @modal-close="closeCreateCaseModal"
      @submit="submitHandler"
      name="create-case-Modal"
    >
      <template #header>
        <h3 style="width: 100%; text-align: center">{{ active }}</h3>
      </template>
      <template #content>
        <div style="display: flex; flex-direction: column; flex-wrap: wrap; gap: 12px">
          <label>Case No</label>
          <input v-model="annotationFormCase.case_no" type="text" placeholder="*" required />
          <label>IP Case</label>
          <input v-model="annotationFormCase.ip_case" type="text" placeholder="Optional" />
          <label>IP Object Type</label>
          <input v-model="annotationFormCase.ip_object_type" type="text" placeholder="Optional" />
          <label>IP Case Name</label>
          <input v-model="annotationFormCase.ip_case_name" type="text" placeholder="Optional" />
          <label>IP Author</label>
          <input v-model="annotationFormCase.ip_author" type="text" placeholder="Optional" />
          <label>IP Applicant</label>
          <input v-model="annotationFormCase.ip_applicant" type="text" placeholder="Optional" />
          <label>IP Classes</label>
          <input v-model="annotationFormCase.ip_classes" type="text" placeholder="Optional" />
          <label>Page Start</label>
          <input v-model="annotationFormCase.page_start" type="text" placeholder="*" required />
          <label>Page End</label>
          <input v-model="annotationFormCase.page_end" type="text" placeholder="*" required />
        </div>
      </template>
      <template #footer>
        <div style="display: flex; justify-content: end; align-items: end">
          <button class="button-30" role="button" @click="runCaseClose">Add Case Annotation</button>
        </div>
      </template>
    </Modal>

    <Modal
    :isOpen="isCasesOpen"
    @modal-close="closeViewCasesModal"
    @submit="submitHandler"
    name="view-cases-Modal"
  >
    <template #header>
      <h3 style="width: 100%; text-align: center">Cases in {{ active }}</h3>
    </template>
    <template #content>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <div v-for="caseItem in cases.data" :key="caseItem.id" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span><strong>Case No:</strong> {{ caseItem.case_no }}</span><br>
          </div>
          <button class="button-30" role="button" @click="openEditCaseModal(caseItem.id)">Edit Case Annotation</button>
        </div>
      </div>
    </template>
    <template #footer>
        <div style="display: flex; justify-content: end; align-items: end">
          <button class="button-30" role="button" @click="closeViewCasesModal">Close</button>
        </div>
      </template>
  </Modal>

  <Modal
    :isOpen="isEditCaseModalOpened"
    @modal-close="closeEditCaseModal"
    @submit="runEditCase"
    name="edit-case-Modal"
  >
    <template #header>
      <h3 style="width: 100%; text-align: center">Edit Case Annotation</h3>
    </template>
    <template #content>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <label>Case No</label>
        <input v-model="annotationFormCase.case_no" type="text" placeholder="*" required />
        <label>IP Case</label>
        <input v-model="annotationFormCase.ip_case" type="text" placeholder="Optional" />
        <label>IP Object Type</label>
        <input v-model="annotationFormCase.ip_object_type" type="text" placeholder="Optional" />
        <label>IP Case Name</label>
        <input v-model="annotationFormCase.ip_case_name" type="text" placeholder="Optional" />
        <label>IP Author</label>
        <input v-model="annotationFormCase.ip_author" type="text" placeholder="Optional" />
        <label>IP Applicant</label>
        <input v-model="annotationFormCase.ip_applicant" type="text" placeholder="Optional" />
        <label>IP Classes</label>
        <input v-model="annotationFormCase.ip_classes" type="text" placeholder="Optional" />
        <label>Page Start</label>
        <input v-model="annotationFormCase.page_start" type="text" placeholder="*" required />
        <label>Page End</label>
        <input v-model="annotationFormCase.page_end" type="text" placeholder="*" required />
      </div>
    </template>
    <template #footer>
      <div style="display: flex; justify-content: end; align-items: end">
        <button class="button-30" role="button" @click="runEditCase">Edit Case Annotation</button>
      </div>
    </template>
  </Modal>

  <Modal
      :isOpen="isPublishModalOpened"
      name="edit-case-Modal" v-if="isPublishModalOpened" @close="cancelPublish">
      <template #header>
        <h3>Confirm Publish</h3>
      </template>
      <template #body>
        <p>Are you sure you want to publish this folder?</p>
      </template>
      <template #footer>
        <button @click="confirmPublish">Yes</button>
        <button @click="cancelPublish">No</button>
      </template>
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
          @click="ss"
        >
          Preview
        </p>
        <div>
          <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-if="item.is_annotated === 0 && item.format === 'Folder'"
            @click="openCreateModal(item)"
          >
            Create Annotation
          </p>
          <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-else-if="item.is_annotated"
            @click="openEditModal(item.is_annotated)"
          >
            Edit Annotation
          </p>
        </div>
        <div>
          <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-if="item.is_annotated > 0 && userRole == 1"
            @click="openCreateCaseModal(item)"
          >
            Add Case Annotation
          </p>
          <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-if="item.is_annotated > 0"
            @click="openCasesModal(item)"
          >
            View Cases
          </p>
        </div>
        <div>
           <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-if="item.is_annotated && userRole == 2 && item.format === 'Folder'"
            @click="openPublishModal(item.is_annotated)"
          >
            Publish Folder
          </p>
        </div>
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
