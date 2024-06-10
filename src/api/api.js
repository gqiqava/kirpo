import AxiosInst from './axiosInstance'
import axios from 'axios'

export const login = async (val) => {
  try {
    const resp = await axios.post('http://192.168.10.5:8000/newapi/login/', val);
    const { token, role_id } = resp.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role_id);

    return resp.data;
  } catch (error) {
    console.error('Login error', error);
    throw error;
  }
};

export const getDirectoryFiles = async (directory, folder_name) => {
  const body = {
    directory: directory,
    folder_name: folder_name
  }
  try {
    const response = await AxiosInst.post('view-files/', body);
    console.log('Response data:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching directory files:', error);
    throw error;
  }
}

export const viewImage = () => {
  const body = {
    directory: 'Scanners',
    folder_name: 'mzia chachanidze/folder 5',
    image_name: 'doxumenti.JPG'
  }
    let resp = AxiosInst.get('newapi/view-image/', body)

  return resp
}

//Scanner api
export const createFolderAnnotation = (val) => {
  if (Object.values(val).some((el) => el === null || el === '')) {
    alert('შეავსეთ ყველა ველი')
    return
  }
  const body = val
    let resp = AxiosInst.post('scanner-folder-annotations/', body)
  return resp
}

export const editFolderAnnotation = (val, id) => {
  if (Object.values(val).some((el) => el === null || el === '')) {
    alert('შეავსეთ ყველა ველი')
    return
  }
  
  const body = val
    let resp = AxiosInst.put(`scanner-folder-annotations/${id}/`, body)
  console.log(id);
  return resp
}

export const getFolderAnnotation = (id) => {
    let resp = AxiosInst.get(`scanner-folder-annotations/${id}/`)
  return resp
} 

export const createCaseAnnotation = (val) => {
  const body = val
    let resp = AxiosInst.post('scanner-case-annotations/', body)
  return resp
}

export const editCaseAnnotation = (val, id) => {
  const body = val
    let resp = AxiosInst.put(`scanner-case-annotations/${id}/`, body)

  return resp
}

export const getScannerCasesByfolder = (id) => {
    let resp = AxiosInst.get(`scanner-cases-by-folder/${id}/`)
  return resp
}

export const getCaseAnnotation = (id) => {
  let resp = AxiosInst.get(`scanner-case-annotations/${id}/`)
return resp
} 

//Redactor api
export const editFolderAnnotationRedactor = (val, id) => {
  if (Object.values(val).some((el) => el === null || el === '')) {
    alert('შეავსეთ ყველა ველი')
    return
  }
  
  const body = val
  let resp = AxiosInst.put(`redactor-folder-annotations/${id}/`, body)
  return resp
}

export const editCaseAnnotationRedactor = (val, id) => {
  const body = val
    let resp = AxiosInst.put(`redactor-case-annotations/${id}/`, body)

  return resp
}

export const getScannerCasesByfolderRedactor = (id) => {
    let resp = AxiosInst.get(`redactor-cases-by-folder/${id}/`)
  return resp
}

export const getCaseAnnotationRedactor = (id) => {
  let resp = AxiosInst.get(`redactor-case-annotations/${id}/`)
return resp
} 

export const getFolderAnnotationRedactor = (id) => {
  let resp = AxiosInst.get(`redactor-folder-annotations/${id}/`)
return resp
} 

export const publishCatalog = (id) => {
    let resp = AxiosInst.post(`publish-folder/${id}/`)
  return resp
}

export const returnCase = async (val) => {
  try {
    const response = await AxiosInst.post('return-case/', val);
    return response.data;
  } catch (error) {
    console.error('Error returning case:', error);
    throw error;
  }
}
