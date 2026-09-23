import axios from "axios"

const BASE_URL = "https://brothers-food-apps.onrender.com/api/v1"
//const BASE_URL = "https://perch-carnation-improving.ngrok-free.dev/api/v1"

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  headers: {
      "Content-Type": "application/json"
  }
})

export const retryApi = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  headers: {
      "Content-Type": "application/json"
  }
})