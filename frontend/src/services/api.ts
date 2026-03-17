import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // FastAPI backend 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const stockService = {
  fetchStock: (ticker: string) => api.get(`/stocks/fetch?ticker=${ticker}`),
  getForecast: (ticker: string) => api.get(`/forecast/${ticker}`),
  getTechnical: (ticker: string) => api.post(`/features/technical?ticker=${ticker}`),
};
