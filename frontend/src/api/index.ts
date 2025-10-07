import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // baseURL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // para enviar cookies junto com as requisições
});