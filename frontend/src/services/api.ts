import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api', // Uses Vercel ENV var on deployment

  headers: {
    'Content-Type': 'application/json',
  },
});

export const stockService = {
  fetchStock: (ticker: string) => api.get(`/stocks/fetch?ticker=${ticker}`),
  getForecast: (ticker: string) => api.get(`/forecast/${ticker}`),
  getTechnical: (ticker: string) => api.post(`/features/technical?ticker=${ticker}`),
};
