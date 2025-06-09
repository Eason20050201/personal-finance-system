import axios from 'axios'

const api = axios.create({
  baseURL: 'https://soft-eternal-ultram-perfume.trycloudflare.com',
  withCredentials: true
})

export default api
