import axios from 'axios'

const api = axios.create({
  baseURL: 'https://blvd-kingdom-cambridge-energy.trycloudflare.com',
  withCredentials: true
})

export default api
