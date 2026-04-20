<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="fw-bold mb-0">Journal Entries</h4>
            <RouterLink :to="{ name: 'journal.create' }" class="btn btn-dark btn-sm">
                + New Entry
            </RouterLink>
        </div>

        <!-- Filters -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label">Date From</label>
                        <input v-model="filters.date_from" type="date" class="form-control" />
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Date To</label>
                        <input v-model="filters.date_to" type="date" class="form-control" />
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Reference</label>
                        <input v-model="filters.reference" type="text" class="form-control" placeholder="JV-0001" />
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Description</label>
                        <input v-model="filters.description" type="text" class="form-control" placeholder="Search..." />
                    </div>
                </div>
                <div class="mt-3 d-flex gap-2">
                    <button class="btn btn-dark btn-sm" @click="fetchEntries">Search</button>
                    <button class="btn btn-outline-secondary btn-sm" @click="resetFilters">Reset</button>
                </div>
            </div>
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div class="card shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Description</th>
                            <th>Created By</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="5" class="text-center py-4">Loading...</td>
                        </tr>
                        <tr v-else-if="entries.length === 0">
                            <td colspan="5" class="text-center py-4 text-muted">No entries found.</td>
                        </tr>
                        <tr v-for="entry in entries" :key="entry.id">
                            <td>{{ entry.date }}</td>
                            <td class="fw-bold">{{ entry.reference }}</td>
                            <td>{{ entry.description }}</td>
                            <td>{{ entry.created_by?.name }}</td>
                            <td class="text-end">
                                <RouterLink
                                    :to="{ name: 'journal.show', params: { id: entry.id } }"
                                    class="btn btn-sm btn-outline-secondary"
                                >
                                    View
                                </RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="card-footer d-flex justify-content-between align-items-center" v-if="pagination">
                <small class="text-muted">
                    Showing {{ pagination.from }}–{{ pagination.to }} of {{ pagination.total }}
                </small>
                <div class="d-flex gap-2">
                    <button
                        class="btn btn-sm btn-outline-secondary"
                        :disabled="!pagination.prev_page_url"
                        @click="changePage(currentPage - 1)"
                    >
                        Previous
                    </button>
                    <button
                        class="btn btn-sm btn-outline-secondary"
                        :disabled="!pagination.next_page_url"
                        @click="changePage(currentPage + 1)"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getJournalEntries } from '../../api/journalEntries'

const entries    = ref([])
const pagination = ref(null)
const loading    = ref(false)
const error      = ref(null)
const currentPage = ref(1)

const filters = ref({
    date_from:   '',
    date_to:     '',
    reference:   '',
    description: '',
})

async function fetchEntries() {
    loading.value = true
    error.value   = null

    try {
        const params = { page: currentPage.value }

        Object.entries(filters.value).forEach(([key, val]) => {
            if (val) params[key] = val
        })

        const response   = await getJournalEntries(params)
        entries.value    = response.data.data
        pagination.value = response.data
    } catch (e) {
        error.value = 'Failed to load journal entries.'
    } finally {
        loading.value = false
    }
}

function resetFilters() {
    filters.value = { date_from: '', date_to: '', reference: '', description: '' }
    currentPage.value = 1
    fetchEntries()
}

function changePage(page) {
    currentPage.value = page
    fetchEntries()
}

onMounted(fetchEntries)
</script>