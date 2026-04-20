<template>
    <div>
        <div class="d-flex align-items-center mb-4 gap-2">
            <RouterLink :to="{ name: 'journal.index' }" class="btn btn-sm btn-outline-secondary">
                &larr; Back
            </RouterLink>
            <h4 class="fw-bold mb-0">New Journal Entry</h4>
        </div>

        <div class="card shadow-sm">
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

                <!-- Header -->
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <label class="form-label">Date</label>
                        <input v-model="form.date" type="date" class="form-control" required />
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Reference</label>
                        <input v-model="form.reference" type="text" class="form-control" placeholder="JV-0001"
                            required />
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Description</label>
                        <input v-model="form.description" type="text" class="form-control" required />
                    </div>
                </div>

                <!-- Lines -->
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold mb-0">Journal Lines</h6>
                    <button type="button" class="btn btn-sm btn-outline-dark" @click="addLine">
                        + Add Line
                    </button>
                </div>

                <div class="table-responsive mb-3">
                    <table class="table table-bordered mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Account</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(line, index) in form.lines" :key="index">
                                <td>
                                    <select v-model="line.account_id" class="form-select form-select-sm" required>
                                        <option value="">Select account</option>
                                        <option v-for="account in accounts" :key="account.id" :value="account.id">
                                            {{ account.code }} — {{ account.name }}
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    <select v-model="line.type" class="form-select form-select-sm" required>
                                        <option value="">Select</option>
                                        <option value="debit">Debit</option>
                                        <option value="credit">Credit</option>
                                    </select>
                                </td>
                                <td>
                                    <input v-model.number="line.amount" type="number" min="0.01" step="0.01"
                                        class="form-control form-control-sm" required />
                                </td>
                                <td>
                                    <button type="button" class="btn btn-sm btn-outline-danger"
                                        @click="removeLine(index)" :disabled="form.lines.length <= 2">
                                        &times;
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="table-light">
                            <tr>
                                <td colspan="2" class="text-end fw-bold">Total Debit</td>
                                <td :class="isBalanced ? 'text-success' : 'text-danger'" class="fw-bold">
                                    {{ totalDebit.toFixed(2) }}
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colspan="2" class="text-end fw-bold">Total Credit</td>
                                <td :class="isBalanced ? 'text-success' : 'text-danger'" class="fw-bold">
                                    {{ totalCredit.toFixed(2) }}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div v-if="!isBalanced" class="alert alert-warning py-2">
                    Total debits must equal total credits.
                </div>

                <button class="btn btn-dark" @click="handleSubmit" :disabled="loading || !isBalanced">
                    {{ loading ? 'Saving...' : 'Save Entry' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { getAccounts } from '../../api/accounts'
import { createJournalEntry } from '../../api/journalEntries'
import AlertMessage from '../../components/AlertMessage.vue'

const router = useRouter()
const accounts = ref([])
const loading = ref(false)
const success = ref(null)
const error = ref(null)
const errors = ref(null)


const form = ref({
    date: '',
    reference: '',
    description: '',
    lines: [
        { account_id: '', type: 'debit', amount: 0 },
        { account_id: '', type: 'credit', amount: 0 },
    ],
})

const totalDebit = computed(() =>
    form.value.lines
        .filter(l => l.type === 'debit')
        .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0)
)

const totalCredit = computed(() =>
    form.value.lines
        .filter(l => l.type === 'credit')
        .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0)
)

const isBalanced = computed(() =>
    totalDebit.value > 0 &&
    totalCredit.value > 0 &&
    totalDebit.value.toFixed(2) === totalCredit.value.toFixed(2)
)

function addLine() {
    form.value.lines.push({ account_id: '', type: 'debit', amount: 0 })
}

function removeLine(index) {
    form.value.lines.splice(index, 1)
}


async function handleSubmit() {
    error.value   = null
    errors.value  = null
    success.value = null
    loading.value = true

    try {
        await createJournalEntry(form.value)
        success.value = 'Journal entry saved successfully.'
        setTimeout(() => {
            router.push({ name: 'journal.index' })
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

onMounted(async () => {
    const response = await getAccounts()
    accounts.value = response.data.data ?? response.data
})
</script>