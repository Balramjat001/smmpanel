import axios from 'axios';
const configuredApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const apiBaseUrl = configuredApiUrl.replace(/\/+$/, '').replace(/\/api$/, '') + '/api';
export const api = axios.create({ baseURL: apiBaseUrl, withCredentials: true });
api.interceptors.request.use(config => { const token = localStorage.getItem('socialboost_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export const unwrap = <T,>(response: { data: { data: T } }) => response.data.data;
