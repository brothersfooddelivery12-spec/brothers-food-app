import axios from "axios"

export const api = axios.create({
  baseURL: "https://brothers-food-app-backend.onrender.com/api/v1",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
})