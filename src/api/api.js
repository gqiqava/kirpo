import AxiosInst from './axiosInstance'

export const getDirectoryFiles = () => {
  // let resp = AxiosInst.get('newapi/view-files/')
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
      is_annotated: true
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
  // const body = val
  //   let resp = AxiosInst.get('newapi/scanner-folder-annotations/', body)
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
  // const body = val
  //   let resp = AxiosInst.get(`newapi/scanner-folder-annotations/${id}/`, body)
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
