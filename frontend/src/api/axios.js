import axios from 'axios'

const api = axios.create({
  baseURL: 'https://enter-distant-guys-chrome.trycloudflare.com',
  withCredentials: true
})

export default api
