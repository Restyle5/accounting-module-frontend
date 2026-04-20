<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold mb-0">Accounts</h4>
            <RouterLink :to="{ name: 'accounts.create' }" class="btn btn-dark btn-sm">
                + New Account
            </RouterLink>
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div class="card shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="5" class="text-center py-4">Loading...</td>
                        </tr>
                        <tr v-else-if="accounts.length === 0">
                            <td colspan="5" class="text-center py-4 text-muted">No accounts found.</td>
                        </tr>
                        <tr v-for="account in accounts" :key="account.id">
                            <td class="fw-mono">{{ account.code }}</td>
                            <td>{{ account.name }}</td>
                            <td>
                                <span class="badge" :class="typeBadge(account.type)">
                                    {{ account.type }}
                                </span>
                            </td>
                            <td>
                                <span class="badge" :class="account.is_active ? 'bg-success' : 'bg-secondary'">
                                    {{ account.is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td class="text-end">
                                <RouterLink
                                    :to="{ name: 'accounts.edit', params: { id: account.id } }"
                                    class="btn btn-sm btn-outline-secondary me-1"
                                >
                                    Edit
                                </RouterLink>
                                <button
                                    class="btn btn-sm btn-outline-danger"
                                    @click="handleDelete(account)"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getAccounts, deleteAccount } from '../../api/accounts'

const accounts = ref([])
const loading  = ref(false)
const error    = ref(null)

async function fetchAccounts() {
    loading.value = true
    try {
        const response = await getAccounts()
        accounts.value = response.data.data ?? response.data
    } catch (e) {
        error.value = 'Failed to load accounts.'
    } finally {
        loading.value = false
    }
}

async function handleDelete(account) {
    if (!confirm(`Delete account "${account.name}"?`)) return

    try {
        await deleteAccount(account.id)
        await fetchAccounts()
    } catch (e) {
        error.value = e.response?.data?.message ?? 'Failed to delete account.'
    }
}

function typeBadge(type) {
    const map = {
        asset:     'bg-primary',
        liability: 'bg-danger',
        equity:    'bg-warning text-dark',
        revenue:   'bg-success',
        expense:   'bg-secondary',
    }
    return map[type] ?? 'bg-dark'
}

onMounted(fetchAccounts)
</script>