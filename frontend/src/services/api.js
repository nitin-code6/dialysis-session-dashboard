import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500/api',
});

export const fetchPatients = () => API.get('/patients');
export const fetchSessions = (params) => API.get('/sessions', { params });
export const createSession = (data) => API.post('/sessions', data);
export const startSession = (id) => API.patch(`/sessions/${id}/start`);
export const completeSession = (id, data) => API.patch(`/sessions/${id}/complete`, data);
export const updateNotes = (id, notes) => API.patch(`/sessions/${id}/notes`, { notes });

export default API;