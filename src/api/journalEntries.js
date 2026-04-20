import api from './axios'

export const getJournalEntries = (params) => api.get('/journal-entries', { params })
export const getJournalEntry   = (id)     => api.get(`/journal-entries/${id}`)
export const createJournalEntry = (data)  => api.post('/journal-entries', data)