import axios from 'axios'

const api = axios.create({
  baseURL: 'https://mariah-wildlife-perspective-loved.trycloudflare.com',
  withCredentials: true
})

export default api
