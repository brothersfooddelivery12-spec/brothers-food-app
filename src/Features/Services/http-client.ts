import axios from "axios"

export const api = axios.create({
  baseURL: "http://10.31.253.166:8000/",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
})