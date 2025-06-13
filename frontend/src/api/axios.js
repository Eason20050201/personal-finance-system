import axios from 'axios'

const api = axios.create({
  baseURL: 'https://customize-ips-deeper-drugs.trycloudflare.com',
  withCredentials: true
})

export default api
