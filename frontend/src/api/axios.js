import axios from 'axios'

const api = axios.create({
  baseURL: 'https://calculators-feat-saturn-airplane.trycloudflare.com',
  withCredentials: true
})

export default api
