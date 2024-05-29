import AxiosInst from './axiosInstance'

export const getDirectoryFiles = () => {
  //   let resp = AxiosInst.get('newapi/view-files/')
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
    }
  ]
  return resp
}
