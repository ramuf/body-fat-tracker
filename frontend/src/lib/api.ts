import axios from 'axios';
import { BodyMetric, BodyMetricCreate, BodyMetricUpdate, User, UserUpdate } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global response interceptor: if the API returns 403, clear token and redirect to login
if (typeof window !== 'undefined') {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status ?? error?.status;
      if (status === 403) {
        try {
          localStorage.removeItem('token');
        } catch (e) {
          /* ignore */
        }
        window.location.href = '/login';
        // return a pending promise so downstream doesn't also try to handle
        return new Promise(() => {});
      }
      return Promise.reject(error);
    }
  );
}

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Initialize token from local storage if available
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      setAuthToken(''); // Clear token
      if (typeof window !== 'undefined') {
        window.location.href = '/login'; // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data: any) => api.post('/users/signup', data),
  login: (data: any) => api.post('/login/access-token', new URLSearchParams(data), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }),
  me: () => api.get<User>('/users/me'),
  updateMe: (data: UserUpdate) => api.patch<User>('/users/me', data),
  recalculateMetrics: () => api.post<BodyMetric[]>('/users/me/recalculate-metrics'),
};

export const bodyMetrics = {
  getAll: () => api.get<BodyMetric[]>('/body-metrics/'),
  create: (data: BodyMetricCreate) => api.post<BodyMetric>('/body-metrics/', data),
  update: (id: string, data: BodyMetricUpdate) => api.put<BodyMetric>(`/body-metrics/${id}`, data),
  delete: (id: string) => api.delete<BodyMetric>(`/body-metrics/${id}`),
};
