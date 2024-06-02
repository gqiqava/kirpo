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
    let resp = AxiosInst.get(`scanner-folder-annotations/${id}`)
  return resp
}

export const editFolderAnnotationRedactor = (val, id) => {
  if (Object.values(val).some((el) => el === null || el === '')) {
    alert('შეავსეთ ყველა ველი')
    return
  }
  
  const body = val
  let resp = AxiosInst.put(`redactor-folder-annotations/${id}/`, body)
  return resp
}

export const createCaseAnnotation = (val) => {
  if (Object.values(val).some((el) => el === null || el === '')) {
    alert('შეავსეთ ყველა ველი')
    return
  }
  const body = val
    let resp = AxiosInst.post('scanner-case-annotations/', body)
  return resp
}

export const editCaseAnnotation = (val) => {
  if (Object.values(val).some((el) => el === null || el === '')) {
    alert('შეავსეთ ყველა ველი')
    return
  }
  const body = val
    let resp = AxiosInst.post('newapi/scanner-case-annotations/', body)

  return resp
}

export const getScannerCasesByfolder = (id) => {
    let resp = AxiosInst.get(`scanner-cases-by-folder/${id}`)
  return resp
}
