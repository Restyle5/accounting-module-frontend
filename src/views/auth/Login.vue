<template>
    <div class="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div class="card shadow-sm" style="width: 400px;">
            <div class="card-body p-4">
                <h4 class="card-title mb-4 fw-bold">GL Journal</h4>

                <div v-if="error" class="alert alert-danger">{{ error }}</div>

                <form @submit.prevent="handleLogin">
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input
                            v-model="form.email"
                            type="email"
                            class="form-control"
                            placeholder="user1@gmail.com"
                            required
                        />
                    </div>

                    <div class="mb-4">
                        <label class="form-label">Password</label>
                        <input
                            v-model="form.password"
                            type="password"
                            class="form-control"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" class="btn btn-dark w-100" :disabled="loading">
                        {{ loading ? 'Logging in...' : 'Login' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth   = useAuthStore()
const router = useRouter()

const form = ref({ email: 'user1@gmail.com', password: 'password' })
const error   = ref(null)
const loading = ref(false)

async function handleLogin() {
    error.value   = null
    loading.value = true

    try {
        await auth.login(form.value)
        router.push({ name: 'accounts' })
    } catch (e) {
        error.value = e.response?.data?.message ?? 'Login failed.'
    } finally {
        loading.value = false
    }
}
</script>