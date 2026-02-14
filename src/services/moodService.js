import api from './api';

export const getMoodHistory = async () => {
  const res = await api.get('/mood/history');
  return res.data;
};