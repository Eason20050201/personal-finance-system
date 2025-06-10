import axios from 'axios'

const api = axios.create({
  baseURL: 'https://field-command-schema-min.trycloudflare.com',
  withCredentials: true
})

export default api
