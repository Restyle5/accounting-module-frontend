<template>
    <div>
        <h4 class="fw-bold mb-4">Trial Balance</h4>

        <!-- Filters -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Date From</label>
                        <input v-model="filters.date_from" type="date" class="form-control" />
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Date To</label>
                        <input v-model="filters.date_to" type="date" class="form-control" />
                    </div>
                    <div class="col-md-4 d-flex align-items-end gap-2">
                        <button class="btn btn-dark btn-sm" @click="fetchReport">Generate</button>
                        <button class="btn btn-outline-secondary btn-sm" @click="resetFilters">Reset</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-if="report" class="card shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>Code</th>
                            <th>Account</th>
                            <th>Type</th>
                            <th class="text-end">Total Debit</th>
                            <th class="text-end">Total Credit</th>
                            <th class="text-end">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="6" class="text-center py-4">Loading...</td>
                        </tr>
                        <tr v-for="account in report.accounts" :key="account.code">
                            <td>{{ account.code }}</td>
                            <td>{{ account.name }}</td>
                            <td>
                                <span class="badge" :class="typeBadge(account.type)">
                                    {{ account.type }}
                                </span>
                            </td>
                            <td class="text-end">{{ account.total_debit.toFixed(2) }}</td>
                            <td class="text-end">{{ account.total_credit.toFixed(2) }}</td>
                            <td class="text-end fw-bold" :class="account.balance < 0 ? 'text-danger' : ''">
                                {{ account.balance.toFixed(2) }}
                            </td>
                        </tr>
                    </tbody>
                    <tfoot class="table-light">
                        <tr>
                            <td colspan="3" class="fw-bold text-end">Totals</td>
                            <td class="text-end fw-bold">{{ report.totals.total_debit.toFixed(2) }}</td>
                            <td class="text-end fw-bold">{{ report.totals.total_credit.toFixed(2) }}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTrialBalance } from '../../api/reports'

const report  = ref(null)
const loading = ref(false)
const error   = ref(null)

const filters = ref({
    date_from: '',
    date_to:   '',
})

async function fetchReport() {
    loading.value = true
    error.value   = null

    try {
        const params = {}
        if (filters.value.date_from) params.date_from = filters.value.date_from
        if (filters.value.date_to)   params.date_to   = filters.value.date_to

        const response = await getTrialBalance(params)
        report.value   = response.data
    } catch (e) {
        error.value = e.response?.data?.message ?? 'Failed to load trial balance.'
    } finally {
        loading.value = false
    }
}

function resetFilters() {
    filters.value = { date_from: '', date_to: '' }
    fetchReport()
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

onMounted(fetchReport)
</script>