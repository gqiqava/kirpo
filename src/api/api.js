import AxiosInst from './axiosInstance'
import axios from 'axios'

export const login = async (val) => {
  let resp = await axios.post('newapi/login/', val)

  localStorage.setItem('token', resp.token)
  localStorage.setItem('role', resp.role_id)

  return resp
}

export const getDirectoryFiles = async (val) => {
  // const body = {
  //   directory: 'Scanners',
  //   folder_name: val
  // }
  // let resp = await AxiosInst.get('newapi/view-files/', body)
  let resp = [
    {
      name: 'folder 3',
      format: 'Folder',
      upload_date: '2024-05-02 11:18:04',
      is_annotated: 2
    },
    {
      name: 'folder 2',
      format: 'Folder',
      upload_date: '2024-05-01 19:56:53',
      is_annotated: 3
    },
    {
      name: '01012001scan_200101s01163501.jpg',
      format: 'jpg',
      upload_date: '2024-05-02 11:18:04',
      is_annotated: null
    },
    {
      name: 'folder 1',
      format: 'Folder',
      upload_date: '2024-04-30 09:07:46',
      is_annotated: 0
    },
    {
      name: 'folder 4',
      format: 'Folder',
      upload_date: '2024-04-29 07:52:36',
      is_annotated: 0
    },
    {
      name: '01012001scan_20010101163501.jpg',
      format: 'jpg',
      upload_date: '2024-05-02 11:18:04',
      is_annotated: null
    },
    {
      name: 'Thumbs.db',
      format: 'db',
      upload_date: '2024-05-02 09:50:14',
      is_annotated: null
    }
  ]
  return resp
}

export const viewImage = () => {
  // const body = {
  //   directory: 'Scanners',
  //   folder_name: 'mzia chachanidze/folder 5',
  //   image_name: 'doxumenti.JPG'
  // }
  //   let resp = AxiosInst.get('newapi/view-image/', body)
  let resp = [
    {
      name: 'folder 3',
      format: 'Folder',
      upload_date: '2024-05-02 11:18:04',
      is_annotated: false
    },
    {
      name: 'folder 2',
      format: 'Folder',
      upload_date: '2024-05-01 19:56:53',
      is_annotated: false
    },
    {
      name: '01012001scan_20010101163501.jpg',
      format: 'jpg',
      upload_date: '2024-05-02 11:18:04',
      is_annotated: null
    },
    {
      name: 'folder 1',
      format: 'Folder',
      upload_date: '2024-04-30 09:07:46',
      is_annotated: true
    },
    {
      name: 'folder 4',
      format: 'Folder',
      upload_date: '2024-04-29 07:52:36',
      is_annotated: false
    },
    {
      name: '01012001scan_20010101163501.jpg',
      format: 'jpg',
      upload_date: '2024-05-02 11:18:04',
      is_annotated: null
    },
    {
      name: 'Thumbs.db',
      format: 'db',
      upload_date: '2024-05-02 09:50:14',
      is_annotated: null
    }
  ]
  return resp
}

export const createFolderAnnotation = (val) => {
  if (Object.values(val).some((el) => el === null || el === '')) {
    alert('შეავსეთ ყველა ველი')
    return
  }
  // const body = val
  //   let resp = AxiosInst.post('newapi/scanner-folder-annotations/', body)
  let resp = {
    id: 2,
    folder_no: 'sak_2001',
    year: 2001,
    description: 'Old folder',
    scanner_folder_location: 2,
    is_migrated: false
  }
  return resp
}

export const editFolderAnnotation = (val, id) => {
  if (Object.values(val).some((el) => el === null || el === '')) {
    alert('შეავსეთ ყველა ველი')
    return
  }
  //
  // const body = val
  //   let resp = AxiosInst.put(`newapi/scanner-folder-annotations/${id}/`, body)
  let resp = {
    id: 2,
    folder_no: 'sak_2001',
    year: 2001,
    description: 'Old folder',
    scanner_folder_location: 2,
    is_migrated: false
  }
  return resp
}

export const getFolderAnnotation = (id) => {
  //   let resp = AxiosInst.get(`newapi/scanner-folder-annotations/${id}`)
  let resp = {
    // id: 1,
    folder_no: 'abc_123',
    year: 2023,
    description: 'Shmest folder annotation',
    scanner_folder_location: 1
    // is_migrated: false
  }
  return resp
}

export const editFolderAnnotationRedactor = (val, id) => {
  if (Object.values(val).some((el) => el === null || el === '')) {
    alert('შეავსეთ ყველა ველი')
    return
  }
  //
  // const body = val
  // let resp = AxiosInst.put(`newapi/redactor-folder-annotations/${id}/`, body)
  let resp = {
    id: 2,
    folder_no: 'abc_123',
    year: 2023,
    description: 'Qmest folder annotation',
    is_published: false,
    migration_date: '2023-05-04T20:00:00Z',
    migrated_from_user: 2,
    redactor_folder_location: 1,
    migrated_from_scanner_folder_location: 1
  }
  return resp
}

export const createCaseAnnotation = (val) => {
  if (Object.values(val).some((el) => el === null || el === '')) {
    alert('შეავსეთ ყველა ველი')
    return
  }
  // const body = val
  //   let resp = AxiosInst.post('newapi/scanner-case-annotations/', body)
  let resp = {
    id: 1,
    folder_no: 'abc_123',
    year: 2023,
    description: 'Shmest folder annotation',
    scanner_folder_location: 1,
    is_migrated: false
  }
  return resp
}

export const editCaseAnnotation = (val) => {
  if (Object.values(val).some((el) => el === null || el === '')) {
    alert('შეავსეთ ყველა ველი')
    return
  }
  // const body = val
  //   let resp = AxiosInst.post('newapi/scanner-case-annotations/', body)
  let resp = {
    id: 1,
    folder_no: 'abc_123',
    year: 2023,
    description: 'Shmest folder annotation',
    scanner_folder_location: 1,
    is_migrated: false
  }
  return resp
}
