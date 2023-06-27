import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'

export const api = axios.create({
  baseURL: import.meta.env.RENDERER_VITE_API_URL,
})

api.interceptors.request.use(function (config) {
  const token = useAuthStore.getState().token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    toast.error(error.response.data.message)

    if (error.response.status === 403) {
      useAuthStore.getState().setCredentials({
        token: '',
        user: null,
      })
    }

    return Promise.reject(error)
  },
)
