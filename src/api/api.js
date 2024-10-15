import AxiosInst from './axiosInstance'
import axios from 'axios'
import { useLocationHandler } from '@/stores/location';

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

export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await AxiosInst.post('logout/', {}, {
      headers: {
        'Authorization': `token ${token}`
      }
    });

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setTimeout(() => {
      location.reload()
    }, 100);

    return response.data;
  } catch (error) {
    console.error('Logout error', error);
    throw error;
  }
};

export const getDirectoryFiles = async (directory, folder_name) => {
  const store = useLocationHandler(); 
  const { setIsLoading } = store;

  setIsLoading(true); 

  const body = {
    directory: directory,
    folder_name: folder_name
  }
  try {
    const response = await AxiosInst.post('view-files/', body);
    console.log('Response data:', response);
    setIsLoading(false); 
    return response.data;
  } catch (error) {
    setIsLoading(false); 
    console.error('Error fetching directory files:', error);
    throw error;
  }
}

export const viewImage = async (directory, folder_name, image_name) => {
  const body = {
    directory: directory,
    folder_name: folder_name,
    image_name: image_name
  }
    let resp = AxiosInst.post('view-image/', body, { responseType: 'blob' })

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

export const sendFolderToScanner = async (val) => {
  try {
    const response = await AxiosInst.post('send-to-scanner/', val);
    return response;
  } catch (error) {
    console.error('Error sending folder to scanner:', error);
    throw error; // Re-throw or handle the error as needed
  }
};

export const sendFolder = (id) => {
  let resp = AxiosInst.post(`send-to-redactor/${id}/`)
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

// Description APIs

// Create a new description
export const createDescription = async (descriptionData) => {
  try {
    const response = await AxiosInst.post('descriptions/', descriptionData);
    return response.data;
  } catch (error) {
    console.error('Error creating description:', error);
    throw error;
  }
};

// Edit an existing description
export const editDescription = async (id, descriptionData) => {
  try {
    const response = await AxiosInst.put(`descriptions/${id}/`, descriptionData);
    return response.data;
  } catch (error) {
    console.error('Error editing description:', error);
    throw error;
  }
};

// Get descriptions based on filters
export const getDescriptions = async (params) => {
  try {
    const response = await AxiosInst.get('descriptions/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching descriptions:', error);
    throw error;
  }
};

//Catalog Api
export const filterCases = (val) => {
  const body = val
    let resp = AxiosInst.post('search-catalog/', body)
  return resp
}

export const downloadFile = async (directory, folder_name) => {
  console.log(directory);
  const body = {
    directory: directory,
    folder_name: folder_name,
    responseType: 'blob'
  }
  try {
    // Send a GET request to the download endpoint
    const response = await AxiosInst.post(`download/`, body);

    // Check if the response is successful
    if (response.status === 200) {
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${folder_name}.zip`); // Set the file name for download
      document.body.appendChild(link);

      // Trigger the click event to start the download
      link.click();

      // Clean up: remove the temporary anchor and revoke the URL
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('Download failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};