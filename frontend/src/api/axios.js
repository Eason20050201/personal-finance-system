import axios from 'axios'

const api = axios.create({
  baseURL: 'https://pregnancy-linux-calculator-portion.trycloudflare.com',
  withCredentials: true
})

export default api
