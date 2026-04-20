<template>
    <div>
        <div class="d-flex align-items-center mb-4 gap-2">
            <RouterLink :to="{ name: 'accounts' }" class="btn btn-sm btn-outline-secondary">
                &larr; Back
            </RouterLink>
            <h4 class="fw-bold mb-0">{{ isEdit ? 'Edit Account' : 'New Account' }}</h4>
        </div>

        <div class="card shadow-sm" style="max-width: 540px;">
            <div class="card-body p-4">
                <AlertMessage :message="success" type="success" @close="success = null" />
                <AlertMessage :message="error" type="danger" @close="error = null" />

                <div v-if="errors && Object.keys(errors).length > 1" class="alert alert-danger">
                    <ul class="mb-0">
                        <li v-for="(messages, field) in errors" :key="field">
                            {{ messages[0] }}
                        </li>
                    </ul>
                </div>

                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label class="form-label">Code</label>
                        <input v-model="form.code" type="text" class="form-control" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input v-model="form.name" type="text" class="form-control" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Type</label>
                        <select v-model="form.type" class="form-select" required>
                            <option value="">Select type</option>
                            <option value="asset">Asset</option>
                            <option value="liability">Liability</option>
                            <option value="equity">Equity</option>
                            <option value="revenue">Revenue</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <div class="mb-4 form-check">
                        <input v-model="form.is_active" type="checkbox" class="form-check-input" id="isActive" />
                        <label class="form-check-label" for="isActive">Active</label>
                    </div>

                    <button type="submit" class="btn btn-dark" :disabled="loading">
                        {{ loading ? 'Saving...' : 'Save Account' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { getAccount, createAccount, updateAccount } from '../../api/accounts'
import AlertMessage from '../../components/AlertMessage.vue'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const error = ref(null)
const errors = ref(null)
const success = ref(null)

const form = ref({
    code: '',
    name: '',
    type: '',
    is_active: true,
})

onMounted(async () => {
    if (isEdit.value) {
        const response = await getAccount(route.params.id)
        const account = response.data.data ?? response.data
        form.value = {
            code: account.code,
            name: account.name,
            type: account.type,
            is_active: account.is_active,
        }
    }
})

async function handleSubmit() {
    error.value   = null
    errors.value  = null
    success.value = null
    loading.value = true

    try {
        if (isEdit.value) {
            await updateAccount(route.params.id, form.value)
        } else {
            await createAccount(form.value)
        }
        success.value = isEdit.value ? 'Account updated successfully.' : 'Account created successfully.'
        setTimeout(() => {
            router.push({ name: 'accounts' })
        }, 1500)
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors ?? null
            error.value  = e.response.data.message ?? null
        } else {
            error.value = 'Something went wrong.'
        }
    } finally {
        loading.value = false
    }
}
</script>