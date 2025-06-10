import axios from 'axios'

const api = axios.create({
  baseURL: 'https://epinions-searching-portugal-compilation.trycloudflare.com/',
  withCredentials: true
})

export default api
