<template>
    <div class="d-flex" style="min-height: 100vh;">
        <!-- Sidebar -->
        <nav class="d-flex flex-column p-3 bg-dark text-white" style="width: 240px; min-height: 100vh;">
            <div class="mb-4">
                <h5 class="fw-bold text-white mb-0">GL Journal</h5>
                <small class="text-secondary">{{ user?.name }}</small>
            </div>

            <ul class="nav nav-pills flex-column mb-auto gap-1">
                <li class="nav-item">
                    <RouterLink :to="{ name: 'accounts' }" class="nav-link text-white" active-class="active">
                        Accounts
                    </RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink :to="{ name: 'journal.index' }" class="nav-link text-white" active-class="active">
                        Journal Entries
                    </RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink :to="{ name: 'reports.trial' }" class="nav-link text-white" active-class="active">
                        Trial Balance
                    </RouterLink>
                </li>
            </ul>

            <div class="mt-auto">
                <button class="btn btn-outline-light btn-sm w-100" @click="handleLogout">
                    Logout
                </button>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="flex-grow-1 p-4 bg-light">
            <RouterView />
        </main>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { storeToRefs } from 'pinia'

const auth   = useAuthStore()
const router = useRouter()

const { user } = storeToRefs(auth)

onMounted(async () => {
    if (!user.value) {
        await auth.fetchUser()
    }
})

async function handleLogout() {
    await auth.logout()
    router.push({ name: 'login' })
}
</script>