import axios from "axios"

const BASE_URL = "https://brothers-food-app-backend.onrender.com/api/v1"

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