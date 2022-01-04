import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000'
export default async ({ Vue }) => {
  Vue.prototype.$axios = axios
}
