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
  getCaseAnnotationRedactor,
  viewImage, // Import the correct API function
  //Publish folder in catalog API
  publishCatalog,
  //Scanner list
  scannerList,
  //Return case API
  returnFolder,
  //Download file
  downloadFile,
  sendFolder
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

const sendFolderMessage = ref(''); // New ref for storing the publish message
const isSendFolderModalOpened = ref(false); // New ref for controlling the publish modal visibility
const folderToSend = ref(null); // New ref for storing the folder to be publishe

const { location, folderLoc } = storeToRefs(store)

const initial = async (directory, folder_name) => {
  folders.value = await getDirectoryFiles(directory, folder_name);
}

if (userRole.value == 1) initial('Scanners', '');
if (userRole.value == 2) initial('Redactors', '');
if (userRole.value == 3) initial('Initial', '');
    
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

const isCreateModalOpened = ref(false)
const isEditModalOpened = ref(false)
const isCreateCaseOpened = ref(false)
const isCasesOpen = ref(false)
const isEditCaseModalOpened = ref(false)

const previewImage = ref(null)

const isCorrectCaseModalOpened = ref(false)

const isMessageModalOpen = ref(false); // Control the visibility of the message modal
const currentMessage = ref(''); // Store the current message to display

const showMessage = (message) => {
  currentMessage.value = message;
  isMessageModalOpen.value = true;
};

const closeMessageModal = () => {
  currentMessage.value = '';
  isMessageModalOpen.value = false;
};
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

const openSendFolderModal = (id) => {
  folderToSend.value = id;
  isSendFolderModalOpened.value = true;
};

const confirmSendFolder = async () => {
  if (folderToSend.value) {
    console.log(folderToSend)
    const response = await sendFolder(folderToSend.value);
    sendFolderMessage.value = response.error || "Folder Sent successfully";
    isSendFolderModalOpened.value = false;
    folderToSend.value = null;
  }
};

const cancelSend = () => {
  isSendFolderModalOpened.value = false;
  folderToSend.value = null;
};

const runEditCase = () => {
  console.log(annotationFormCase)
  userRole.value == 1 
  ? editCaseAnnotation(annotationFormCase.value, currentCaseId.value)
  : editCaseAnnotationRedactor(annotationFormCase.value, currentCaseId.value)
  closeEditCaseModal()
}

const openCorrectCaseModal = async (id) => {
  let response = await getCaseAnnotationRedactor(id);
  currentCaseId.value = id;
  annotationFormCase.value = response.data; // Assuming the response structure has a `data` property
  isCorrectCaseModalOpened.value = true;
};

const runCorrectCase = () => {
  editCaseAnnotationRedactor(annotationFormCase.value, currentCaseId.value)
  closeCorrectCaseModal()
}

const closeCorrectCaseModal = () => {
  annotationFormCase.value = {
    case_no: null,
    ip_case: null,
    page_start: null,
    page_end: null,
    scanner_folder_annotation: null
  }
  isCorrectCaseModalOpened.value = false
  currentCaseId.value = null
}

const selectedFolderId = ref(null) // New ref for storing the selected folder ID for return
const returnMessage = ref(''); // New ref for storing the return message
const isReturnFolderModalOpen = ref(false); // New ref for controlling the return folder modal visibility
const selectedUserId = ref(null); // New ref for storing the selected user ID

const openReturnFolderModal = async (id) => {
  selectedFolderId.value = id;
  isReturnFolderModalOpen.value = true;
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

const closeReturnFolderModal = () => {
  selectedFolderId.value = null;
  returnMessage.value = '';
  isReturnFolderModalOpen.value = false;
};

const submitReturnFolder = async () => {
  if (selectedFolderId.value && returnMessage.value.trim() !== '' && selectedUserId.value) {
    try {
      const response = await returnFolder({
        redactor_folder_annotation_id: selectedFolderId.value,
        message: returnMessage.value,
        user_id: selectedUserId.value,
      });
      console.log('Folder returned successfully:', response.data);
      closeReturnFolderModal();
      // არასავალდებულოly refresh the folder list or emit an event
    } catch (error) {
      console.error('Error returning folder:', error);
    }
  } else {
    alert('Please select a user and enter a message.');
  }
};

const displayFileName = (name) => {
  if (name.length < 12) {
    return name;
  }
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex === -1) {
    return `${name.slice()}`;
  }
  const nameWithoutExtension = name.slice(0, dotIndex);
  const extension = name.slice(dotIndex);
  const shortName = nameWithoutExtension.slice();
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

console.log(userRole.value)
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
          <label>საქმის ნომერი</label>
          <input v-model="annotationForm.folder_no" type="text" placeholder="*" />
          <label>წელი</label>
          <input v-model="annotationForm.year" type="number" placeholder="*" />
          <label>აღწერა</label>
          <input v-model="annotationForm.description" type="text" placeholder="*" />
          <!-- <label>Scanner Folder Location</label>
          <input v-model="annotationForm.scanner_folder_location" type="text" placeholder="*" />
          <label>Redactor Folder Location</label>
          <input v-model="annotationForm.redactor_folder_location" type="text" placeholder="*" /> -->
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
          <label>საქმის ნომერი</label>
          <input v-model="annotationForm.folder_no" type="text" placeholder="*" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}">
          <label>წელი</label> 
          <input v-model="annotationForm.year" type="number" placeholder="*" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
          <label>აღწერა</label>
          <input v-model="annotationForm.description" type="text" placeholder="*" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
          <!-- <label>Scanner Folder Location</label>
          <input v-model="annotationForm.scanner_folder_location" type="text" placeholder="*" />
          <label>Redactor Folder Location</label>
          <input v-model="annotationForm.redactor_folder_location" type="text" placeholder="*" /> -->
        </div>
      </template>
      <template #footer>
        <div style="display: flex; justify-content: end; align-items: end">
          <button v-if="userRole == 2" class="button-30" role="button" @click="runEdit">შეცვალეთ საქმის ანოტაცია</button>
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
          <label>განაცხადის ნომერი</label>
          <input v-model="annotationFormCase.case_no" type="text" placeholder="*" required :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
          <label>განცხადების ნომერი(საქმის ნომერი)</label>
          <input v-model="annotationFormCase.ip_case" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
          <label>ინტელექტუალური საკუთრების ობიექტი</label>
          <input v-model="annotationFormCase.ip_object_type" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
          <label>ინტელექტუალური საკუთრების ობიექტის დასახელება</label>
          <input v-model="annotationFormCase.ip_case_name" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
          <label>ინტელექტუალური საკუთრების ობიექტის ავტორი</label>
          <input v-model="annotationFormCase.ip_author" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
          <label>ინტელექტუალური საკუთრების ობიექტის განმცხადებელი</label>
          <input v-model="annotationFormCase.ip_applicant" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
          <label>ინტელექტუალური საკუთრების ობიექტის რეგისტრაციის ნომერი</label>
          <input v-model="annotationFormCase.ip_patent_no" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
          <label>ინტელექტუალური საკუთრების ობიექტის კლასები</label>
          <input v-model="annotationFormCase.ip_classes" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
          <!-- <label>Page Start</label>
          <input v-model="annotationFormCase.page_start" type="text" placeholder="*" required />
          <label>Page End</label>
          <input v-model="annotationFormCase.page_end" type="text" placeholder="*" required /> -->
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
      <h3 style="width: 100%; text-align: center">განაცხადები საქმე N{{ active }}-ში</h3>
    </template>
    <template #content>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <div v-for="caseItem in cases.data" :key="caseItem.id" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span><strong>განაცხადის ნომერი:</strong> {{ caseItem.case_no }}</span><br>
          </div>
          <button class="button-30" role="button" @click="openEditCaseModal(caseItem.id)">{{ userRole !=2 ? 'განაცხადის ანოტაციის ნახვა' : 'განაცხადის ანოტაციის ცვლილება' }}</button>
          
          <!-- <button v-if="userRole == 2" class="button-30" role="button" @click="openReturnCaseModal(caseItem.id)">Return Case</button> -->
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
    :isOpen="isReturnFolderModalOpen"
    @modal-close="closeReturnFolderModal"
    @submit="submitReturnFolder"
    name="return-folder-modal"
  >
    <template #header>
      <h3>საქმის დაბრუნება</h3>
    </template>
    <template #content>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <label for="returnMessage"><strong>შეტყობინება:</strong></label>
        <textarea v-model="returnMessage" id="returnMessage" rows="4" style="width: 100%;"></textarea>
        <label><strong>აირჩიეთ დამსკანერებელი მომხმარებელი:</strong></label>
        <select v-model="selectedUserId">
          <option value="" disabled>აირჩიეთ დამსკანერებელი მომხმარებელი</option>
          <option v-for="scanner in scannerData" :key="scanner.id" :value="scanner.id">{{ scanner.first_name }} {{ scanner.last_name }}</option>
        </select>
      </div>
    </template>
    <template #footer>
      <div style="display: flex; justify-content: end; align-items: end">
        <button class="button-30" role="button" @click="closeReturnFolderModal">დახურვა</button>
        <button class="button-30" role="button" @click="submitReturnFolder">დაბრუნება</button>
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
      <h3 style="width: 100%; text-align: center">განაცხადის ანოტაცია</h3>
    </template>
    <template #content>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <label>განაცხადის ნომერი</label>
        <input v-model="annotationFormCase.case_no" type="text" placeholder="*" required :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>განცხადების ნომერი(საქმის ნომერი)</label>
        <input v-model="annotationFormCase.ip_case" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>ინტელექტუალური საკუთრების ობიექტი</label>
        <input v-model="annotationFormCase.ip_object_type" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>ინტელექტუალური საკუთრების ობიექტის დასახელება</label>
        <input v-model="annotationFormCase.ip_case_name" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>ინტელექტუალური საკუთრების ობიექტის ავტორი</label>
        <input v-model="annotationFormCase.ip_author" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>ინტელექტუალური საკუთრების ობიექტის განმცხადებელი</label>
        <input v-model="annotationFormCase.ip_applicant" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>ინტელექტუალური საკუთრების ობიექტის რეგისტრაციის ნომერი</label>
        <input v-model="annotationFormCase.ip_patent_no" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>ინტელექტუალური საკუთრების ობიექტის კლასები</label>
        <input v-model="annotationFormCase.ip_classes" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <!-- <label>Page Start</label>
        <input v-model="annotationFormCase.page_start" type="text" placeholder="*" required />
        <label>Page End</label>
        <input v-model="annotationFormCase.page_end" type="text" placeholder="*" required /> -->
      </div>
    </template>
    <template #footer>
      <div style="display: flex; justify-content: end; align-items: end">
        <button v-if="userRole ==2" class="button-30" role="button" @click="runEditCase">შეცვალეთ განაცხადის ანოტაცია</button>
      </div>
    </template>
  </Modal>

  <Modal
    :isOpen="isCorrectCaseModalOpened"
    @modal-close="closeCorrectCaseModal"
    @submit="runCorrectCase"
    name="edit-case-Modal"
  >
    <template #header>
      <h3 style="width: 100%; text-align: center">Correct Case Annotation</h3>
    </template>
    <template #content>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <label>Case No</label>
        <input v-model="annotationFormCase.case_no" type="text" placeholder="*" required :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>IP Case</label>
        <input v-model="annotationFormCase.ip_case" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>IP Object Type</label>
        <input v-model="annotationFormCase.ip_object_type" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>IP Case Name</label>
        <input v-model="annotationFormCase.ip_case_name" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>IP Author</label>
        <input v-model="annotationFormCase.ip_author" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>IP Applicant</label>
        <input v-model="annotationFormCase.ip_applicant" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
        <label>IP Classes</label>
        <input v-model="annotationFormCase.ip_classes" type="text" placeholder="არასავალდებულო" :disabled="userRole !=2" :style="{borderBottom: userRole !=2 ? 'none' :  null}"/>
      </div>
    </template>
    <template #footer>
      <div style="display: flex; justify-content: end; align-items: end">
        <button v-if="userRole ==2" class="button-30" role="button" @click="runCorrectCase">Edit Case Annotation</button>
      </div>
    </template>
  </Modal>


  <Modal
      :isOpen="isPublishModalOpened"
      name="edit-case-Modal" v-if="isPublishModalOpened" @close="cancelPublish">
      <template #header>
        <h3>გამოქვეყნების დადასტურება</h3>
      </template>
      <template #body>
        <p>საქმე კატალოგში გამოქყევნდება!</p>
      </template>
      <template #footer>
        <button class="button-30" @click="confirmPublish">დიახ</button>
        <button class="button-30" @click="cancelPublish">არა</button>
      </template>
    </Modal>

    <Modal
      :isOpen="isSendFolderModalOpened"
      name="edit-case-Modal" v-if="isSendFolderModalOpened" @close="cancelSend">
      <template #header>
        <h3>გადაგზავნის დადასტურება</h3>
      </template>
      <template #body>
        <p>დარწმუნებული ხართ, რომ გსურთ საქმის გადაგზავნა?</p>
      </template>
      <template #footer>
        <button class="button-30" @click="confirmSendFolder">დიახ</button>
        <button class="button-30" @click="cancelSend">არა</button>
      </template>
    </Modal>

    <!-- Message Modal -->
    <Modal :isOpen="isMessageModalOpen" @modal-close="closeMessageModal" name="Message-Modal">
      <template #header>
        <h3 style="width: 100%; text-align: center">შეტყობინება</h3>
      </template>
      <template #content>
        <p>{{ currentMessage }}</p>
      </template>
      <template #footer>
        <button class="button-30" role="button" @click="closeMessageModal">დახურვა</button>
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
          class="singleText"
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
            {{ userRole !=2 ? 'ანოტაციის ნახვა' : 'ანოტაციის ცვლილება' }}
          </p>
        </div>
        <div>
          <!-- <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-if="item.is_annotated > 0 && userRole == 1"
            @click="openCreateCaseModal(item)"
          >
            Add Case Annotation
          </p> -->
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
            v-if="item.returned"
            @click="showMessage(item.returned)"
          >
            შეტყობინების ნახვა
          </p>
          <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-if="item.corrected"
            @click="openCorrectCaseModal(item.corrected)"
          >
            Correct Case Annotation
          </p>
          <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-if="item.is_annotated && userRole == 1 && item.format === 'Folder'"
            @click="openSendFolderModal(item.is_annotated)"
          >
            რედაქტორთან გადაგზავნა
          </p>
          <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-if="item.is_annotated && userRole == 2 && item.format === 'Folder'"
            @click="openReturnFolderModal(item.is_annotated)"
          >
            საქმის დაბრუნება
          </p>
        </div>
        <div>
           <p
            class="singleText"
            style="font-size: 14px; font-weight: 300"
            v-if="item.is_annotated && userRole == 2 && item.format === 'Folder'"
            @click="openPublishModal(item.is_annotated)"
          >
            საქმის გამოქვეყნება
          </p>
        </div>
      </div>
    </template>
    </div>
    <div v-if="previewImage" class="image-preview">
      <img :src="previewImage" alt="Preview" />
      <button class="button-30" @click="closePreview">დახურვა</button>
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
