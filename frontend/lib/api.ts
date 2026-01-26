import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  signup: async (username: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/sign-up', {
      username,
      email,
      password,
    })
    return response.data
  },

  login: async (usernameOrEmail: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      usernameOrEmail,
      password,
    })
    return response.data
  },

  emailVerify: async (email: string) => {
    const response = await apiClient.post('/auth/email-verify', { email })
    return response.data
  },

  verifyEmailCode: async (email: string, code: number) => {
    const response = await apiClient.post('/auth/verify-email-code', {
      email,
      code,
    })
    return response.data
  },

  resetCodeGenerate: async (usernameOrEmail: string) => {
    const response = await apiClient.post('/auth/reset-code-generate', {
      usernameOrEmail,
    })
    return response.data
  },

  resetCodeVerify: async (usernameOrEmail: string, code: number) => {
    const response = await apiClient.post('/auth/reset-code-verify', {
      usernameOrEmail,
      code,
    })
    return response.data
  },
}

export default apiClient
