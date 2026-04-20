import api from './axios'

export const getTrialBalance = (params) => api.get('/reports/trial-balance', { params })