import axios from 'axios'

const campeonatoApi = axios.create({
  baseURL: import.meta.env.VITE_CAMPEONATO_API_URL,
})

export default campeonatoApi