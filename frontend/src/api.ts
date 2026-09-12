import axios from 'axios';
const configuredApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '');
if (!configuredApiUrl) throw new Error('VITE_API_URL must be set for production builds.');
export const apiBaseUrl = configuredApiUrl.replace(/\/+$/, '').replace(/\/api$/, '') + '/api';
export const api = axios.create({ baseURL: apiBaseUrl, withCredentials: true });
api.interceptors.request.use(config => { const token = localStorage.getItem('socialboost_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export const unwrap = <T,>(response: { data: { data: T } }) => response.data.data;
