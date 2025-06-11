import axios from 'axios'

const api = axios.create({
  baseURL: 'https://figured-lawyers-flux-prime.trycloudflare.com',
  withCredentials: true
})

export default api
