import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, logout as logoutApi, me as meApi } from '../api/auth'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') ?? null)
    const user  = ref(null)

    const isAuthenticated = computed(() => !!token.value)

    async function login(credentials) {
        const response = await loginApi(credentials)
        token.value    = response.data.token
        user.value     = response.data.user
        localStorage.setItem('token', token.value)
    }

    async function logout() {
        try {
            await logoutApi()
        } finally {
            token.value = null
            user.value  = null
            localStorage.removeItem('token')
        }
    }

    async function fetchUser() {
        const response = await meApi()
        user.value     = response.data
    }

    return { token, user, isAuthenticated, login, logout, fetchUser }
})