import axios from 'axios'

const api = axios.create({
  baseURL: 'https://ss-referring-og-encoding.trycloudflare.com',
  withCredentials: true
})

export default api
