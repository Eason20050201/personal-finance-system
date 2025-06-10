import axios from 'axios'

const api = axios.create({
  baseURL: 'https://alert-vanilla-pennsylvania-winston.trycloudflare.co',
  withCredentials: true
})

export default api
