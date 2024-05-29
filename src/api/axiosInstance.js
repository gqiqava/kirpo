import axios from 'axios'

const commonConfig = {
  baseURL: 'http://192.168.10.5:8000/newapi/'
}

const requestInterceptorCallback = (config) => {
  config.headers['Content-Type'] = 'application/json'
  config.headers.Authorization = `bearer ${localStorage.getItem('token')}`
  return config
}

const AxiosInst = axios.create({ ...commonConfig })

AxiosInst.interceptors.request.use(requestInterceptorCallback)

AxiosInst.interceptors.request.use(
  (config) => {
    console.log(config)
  },
  (error) => {
    console.log('error', error)
  }
)

AxiosInst.interceptors.response.use(
  (response) => {
    console.log(response)
  },
  (error) => {
    console.log(error)
  }
)

export default AxiosInst
