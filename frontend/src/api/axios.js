import axios from 'axios'

const api = axios.create({
  baseURL: 'https://alert-vanilla-pennsylvania-winston.trycloudflare.com',
  withCredentials: true
})

export default api
