import axios from 'axios'

const api = axios.create({
  baseURL: 'https://friendly-weird-finland-star.trycloudflare.com',
  withCredentials: true
})

export default api
