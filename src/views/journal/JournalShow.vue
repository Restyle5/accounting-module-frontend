<template>
    <div>
        <div class="d-flex align-items-center mb-4 gap-2">
            <RouterLink :to="{ name: 'journal.index' }" class="btn btn-sm btn-outline-secondary">
                &larr; Back
            </RouterLink>
            <h4 class="fw-bold mb-0">Journal Entry</h4>
        </div>

        <div v-if="loading" class="text-center py-5">Loading...</div>

        <div v-else-if="entry" class="card shadow-sm">
            <div class="card-body p-4">
                <div class="row mb-4">
                    <div class="col-md-4">
                        <small class="text-muted d-block">Date</small>
                        <span class="fw-bold">{{ entry.date }}</span>
                    </div>
                    <div class="col-md-4">
                        <small class="text-muted d-block">Reference</small>
                        <span class="fw-bold">{{ entry.reference }}</span>
                    </div>
                    <div class="col-md-4">
                        <small class="text-muted d-block">Created By</small>
                        <span>{{ entry.created_by?.name }}</span>
                    </div>
                </div>

                <div class="mb-4">
                    <small class="text-muted d-block">Description</small>
                    <span>{{ entry.description }}</span>
                </div>

                <h6 class="fw-bold mb-3">Journal Lines</h6>

                <div class="table-responsive">
                    <table class="table table-bordered mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th>Account</th>
                                <th>Type</th>
                                <th class="text-end">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="line in entry.lines" :key="line.id">
                                <td>{{ line.account?.code }} — {{ line.account?.name }}</td>
                                <td>
                                    <span class="badge" :class="line.type === 'debit' ? 'bg-primary' : 'bg-success'">
                                        {{ line.type }}
                                    </span>
                                </td>
                                <td class="text-end">{{ parseFloat(line.amount).toFixed(2) }}</td>
                            </tr>
                        </tbody>
                        <tfoot class="table-light">
                            <tr>
                                <td colspan="2" class="text-end fw-bold">Total Debit</td>
                                <td class="text-end fw-bold">{{ totalDebit.toFixed(2) }}</td>
                            </tr>
                            <tr>
                                <td colspan="2" class="text-end fw-bold">Total Credit</td>
                                <td class="text-end fw-bold">{{ totalCredit.toFixed(2) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getJournalEntry } from '../../api/journalEntries'

const route   = useRoute()
const entry   = ref(null)
const loading = ref(false)

const totalDebit = computed(() =>
    (entry.value?.lines ?? [])
        .filter(l => l.type === 'debit')
        .reduce((sum, l) => sum + parseFloat(l.amount), 0)
)

const totalCredit = computed(() =>
    (entry.value?.lines ?? [])
        .filter(l => l.type === 'credit')
        .reduce((sum, l) => sum + parseFloat(l.amount), 0)
)

onMounted(async () => {
    loading.value = true
    const response = await getJournalEntry(route.params.id)
    entry.value    = response.data
    loading.value  = false
})
</script>