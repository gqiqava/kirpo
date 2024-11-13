<script setup>
import {
  getDirectoryFiles,
  getFolderAnnotation,
  editFolderAnnotation,
  getScannerCasesByfolder,
  getCaseAnnotation,
  editCaseAnnotation,
  sendFolderToScanner,
  scannerList,
  viewImage, 
  //Download file
  downloadFile
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
  inscription: null,
  scanner_folder_location: null,
  redactor_folder_location: null,
  initial_folder_location: null
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
const isSendFolderModalOpened = ref(false); // New ref for controlling the publish modal visibility

const { location, folderLoc } = storeToRefs(store)

const initial = async (directory, folder_name) => {
  folders.value = await getDirectoryFiles(directory, folder_name);
}

if (userRole.value == 3){
  console.log(12312312)
  initial('Initial', '');
}
    
let tempLocation;
watch(folderLoc, async () => {
  tempLocation = location.value.map((el) => {
    return el.name
  })
  initial(tempLocation.at(0), tempLocation.slice(1).join('/'))
})

const handleDownload = async (folder_name) => {
 // Adjust this based on the structure of your 'item' object
  try {
    await downloadFile(tempLocation.at(0), tempLocation.slice(1).join('/') + '/' + folder_name);
  } catch (error) {
    console.error('Error downloading file:', error);
    // Handle error if necessary
  }
};

const isEditModalOpened = ref(false)
const isCasesOpen = ref(false)
const isEditCaseModalOpened = ref(false)

const previewImage = ref(null)


const openCasesModal = async (item) => {
  if (userRole.value == 3) cases.value = await getScannerCasesByfolder(item.is_annotated)
    console.log(cases.value.data) // Fetch cases for the specified folder
    isCasesOpen.value = true
}

const closeViewCasesModal = () =>{
  isCasesOpen.value=false
}

const runEdit = () => {
  const id = annotationForm.value.id
  console.log(annotationForm)
  if (userRole.value == 3) editFolderAnnotation(annotationForm.value, id)
    closeEditModal()
}
const openEditModal = async (annotationId) => {
  let response;
  if (userRole.value == 3) response = await getFolderAnnotation(annotationId)
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

const currentCaseId = ref(null)

const openEditCaseModal = async (id) => {
  let response;
  if (userRole.value == 3)response = await getCaseAnnotation(id);
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

const selectedFolderId = ref(null) // New ref for storing the selected folder ID for send
const isSendFolderModalOpen = ref(false); // New ref for controlling the send folder modal visibility
const selectedUserId = ref(null); // New ref for storing the selected user ID

const openSendFolderModal = async (id) => {
  selectedFolderId.value = id;
  isSendFolderModalOpen.value = true;
};

// Fetch the scanner list data
const scannerData = ref([]);
const fetchScannerList = async () => {
  try {
    const response = await scannerList();
    scannerData.value = response.data;
  } catch (error) {
    console.error('Error fetching scanner list:', error);
  }
};

fetchScannerList();

const closeSendFolderModal = () => {
  selectedFolderId.value = null;
  isSendFolderModalOpen.value = false;
};

const submitSendFolder = async () => {
  if (selectedFolderId.value !== '' && selectedUserId.value) {
    try {
      const response = await sendFolderToScanner({
        scanner_folder_annotation_id: selectedFolderId.value,
        user_id: selectedUserId.value,
      });
      console.log('Folder sent successfully:', response.data);
      closeSendFolderModal();
      // არასავალდებულოly refresh the folder list or emit an event
    } catch (error) {
      console.error('Error sending folder:', error);
    }
  } else {
    alert('Please select a user');
  }
};

const runEditCase = () => {
  console.log(annotationFormCase)
  if (userRole.value == 3) editCaseAnnotation(annotationFormCase.value, currentCaseId.value)
  closeEditCaseModal()
}

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

const submitHandler = () => {
  // Handle form submission if needed
}
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 24px; margin: 24px">
    <Modal
      :isOpen="isEditModalOpened"
      @modal-close="closeEditModal"
      @submit="submitHandler"
      name="Edit-Modal"
    >
      <template #header>
        <h3 style="width: 100%; text-align: center">{{ annotationForm.inscription }} _ {{ active }}</h3>
      </template>
      <template #content>
        <div style="display: flex; flex-direction: column; flex-wrap: wrap; gap: 12px">
          <label>საქმის ნომერი</label>
          <input v-model="annotationForm.folder_no" type="text" placeholder="*" />
          <label>წელი</label>
          <input v-model="annotationForm.year" type="number" placeholder="*" />
          <label>აღწერა</label>
          <input v-model="annotationForm.description" type="text" placeholder="*" />
          <label>ანაწერის ნომერი</label>
          <input v-model="annotationForm.inscription" type="text" placeholder="*" />
          <!-- <label>Scanner Folder Location</label>
          <input v-model="annotationForm.scanner_folder_location" type="text" placeholder="*" />
          <label>Redactor Folder Location</label>
          <input v-model="annotationForm.redactor_folder_location" type="text" placeholder="*" /> -->
        </div>
      </template>
      <template #footer>
        <div style="display: flex; justify-content: end; align-items: end">
          <button class="button-30" role="button" @click="runEdit">შეცვალეთ საქმის ანოტაცია</button>
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
      <h3 style="width: 100%; text-align: center">განაცხადები საქმე N{{ active }}-ში</h3>
    </template>
    <template #content>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <div v-for="caseItem in cases.data" :key="caseItem.id" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span><strong>განაცხადის ნომერი:</strong> {{ caseItem.case_no }}</span><br>
          </div>
          <button class="button-30" role="button" @click="openEditCaseModal(caseItem.id)">შეცვალეთ განაცხადის ანოტაცია</button>
        </div>
      </div>
    </template>
    <template #footer>
        <div style="display: flex; justify-content: end; align-items: end">
          <button class="button-30" role="button" @click="closeViewCasesModal">დახურვა</button>
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
      <h3 style="width: 100%; text-align: center">შეცვალეთ განაცხადის ანოტაცია</h3>
    </template>
    <template #content>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <label>განაცხადის ნომერი</label>
        <input v-model="annotationFormCase.case_no" type="text" placeholder="*" required />
        <label>განცხადების ნომერი(საქმის ნომერი)</label>
        <input v-model="annotationFormCase.ip_case" type="text" placeholder="არასავალდებულო" />
        <label>ინტელექტუალური საკუთრების ობიექტი</label>
        <input v-model="annotationFormCase.ip_object_type" type="text" placeholder="არასავალდებულო" />
        <label>ინტელექტუალური საკუთრების ობიექტის დასახელება</label>
        <input v-model="annotationFormCase.ip_case_name" type="text" placeholder="არასავალდებულო" />
        <label>ინტელექტუალური საკუთრების ობიექტის ავტორი</label>
        <input v-model="annotationFormCase.ip_author" type="text" placeholder="არასავალდებულო" />
        <label>ინტელექტუალური საკუთრების ობიექტის განმცხადებელი</label>
        <input v-model="annotationFormCase.ip_applicant" type="text" placeholder="არასავალდებულო" />
        <label>ინტელექტუალური საკუთრების ობიექტის რეგისტრაციის ნომერი</label>
        <input v-model="annotationFormCase.ip_patent_no" type="text" placeholder="არასავალდებულო" />
        <label>ინტელექტუალური საკუთრების ობიექტის კლასები</label>
        <input v-model="annotationFormCase.ip_classes" type="text" placeholder="არასავალდებულო" />
        <!-- <label>Page Start</label>
        <input v-model="annotationFormCase.page_start" type="text" placeholder="*" required />
        <label>Page End</label>
        <input v-model="annotationFormCase.page_end" type="text" placeholder="*" required /> -->
      </div>
    </template>
    <template #footer>
      <div style="display: flex; justify-content: end; align-items: end">
        <button class="button-30" role="button" @click="runEditCase">შეცვალეთ განაცხადის ანოტაცია</button>
      </div>
    </template>
  </Modal>

  <Modal
    :isOpen="isSendFolderModalOpen"
    @modal-close="closeSendFolderModal"
    @submit="submitSendnFolder"
    name="send-folder-modal"
  >
    <template #header>
      <h3>Send Folder</h3>
    </template>
    <template #content>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <p>გსურთ საქმე N{{ active }} გაანაწილოთ?</p>
        <label><strong>აირჩიეთ დამსკანერებელი მომხმარებელი:</strong></label>
        <select v-model="selectedUserId">
          <option value="" disabled>აირჩიეთ დამსკანერებელი მომხმარებელი</option>
          <option v-for="scanner in scannerData" :key="scanner.id" :value="scanner.id">{{ scanner.first_name }} {{ scanner.last_name }}</option>
        </select>
      </div>
    </template>
    <template #footer>
      <div style="display: flex; justify-content: end; align-items: end">
        <button class="button-30" role="button" @click="closeSendFolderModal">დახურვა</button>
        <button class="button-30" role="button" @click="submitSendFolder">გადაგზავნა</button>
      </div>
    </template>
  </Modal>

  <Modal
    :isOpen="isSendFolderModalOpened"
    @modal-close="isSendFolderModalOpened = false"
    name="send-folder-modal"
  >
    <template #header>
      <h3 style="width: 100%; text-align: center">საქმის განაწილება</h3>
    </template>
    <template #content>
      
    </template>
    <template #footer>
      <div style="display: flex; justify-content: end; align-items: end;">
        <button class="button-30" role="button" @click="isSendFolderModalOpened = false">დახურვა</button>
      </div>
    </template>
  </Modal>

    <div
      v-for="item in folders"
      :key="item.name"
      class="singleFolder"
      @click="active = item.name"
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
      <div v-if="active === item.name" class="moreAction">
        <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
        
           @click="handleDownload(item.name)"
          >
            გადმოწერა
          </p>
        <p
          class="singleText:hover"
          style="font-size: 14px; font-weight: 300"
          v-if="item.format !== 'Folder'"
          @click="handleViewImage(item)"
        >
          ნახვა
        </p>
        <div>
          <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-if="item.is_annotated"
            @click="openEditModal(item.is_annotated)"
          >
            ანაწერის ცვლილება
          </p>
        </div>
        <div>
          <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-if="item.is_annotated > 0"
            @click="openCasesModal(item)"
          >
            განაცხადების ნახვა
          </p>
          <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-if="item.is_annotated && userRole == 3 && item.format === 'Folder'"
            @click="openSendFolderModal(item.is_annotated)"
          >
            საქმის განაწილება
          </p>
        </div>
      </div>
    </template>
    </div>
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
  top: 135px;
  text-align: start;
  background-color: rgba(255, 255, 255, 1);
  width: 130px;
  border-radius: 4px;
  z-index: 999;
  /* border: 1px solid rgb(214, 214, 214); */
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.2),
    0 12px 40px rgba(38, 38, 41, 0.3);
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
