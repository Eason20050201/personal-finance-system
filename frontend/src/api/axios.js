import axios from 'axios'

const api = axios.create({
  //baseURL: 'http://localhost:8000', // 請根據你的後端修改
  baseURL: 'http: http://0.0.0.0:8000',
  withCredentials: true, // 若後端有設定 cookie/session
})

export default api
