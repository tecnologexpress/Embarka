import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // baseURL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // para enviar cookies junto com as requisições
    validateStatus: (status) => status >= 200 && status < 300, // Considera respostas de erro (4xx) como válidas para tratamento posterior
});