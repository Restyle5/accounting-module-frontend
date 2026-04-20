import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login          from '../views/auth/Login.vue'
import AppLayout      from '../views/layouts/AppLayout.vue'
import AccountList    from '../views/accounts/AccountList.vue'
import AccountForm    from '../views/accounts/AccountForm.vue'
import JournalList    from '../views/journal/JournalList.vue'
import JournalCreate  from '../views/journal/JournalCreate.vue'
import JournalShow    from '../views/journal/JournalShow.vue'
import TrialBalance   from '../views/reports/TrialBalance.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { guest: true },
    },
    {
        path: '/',
        component: AppLayout,
        meta: { requiresAuth: true },
        children: [
            { path: '',                        redirect: '/accounts' },
            { path: 'accounts',                name: 'accounts',        component: AccountList },
            { path: 'accounts/create',         name: 'accounts.create', component: AccountForm },
            { path: 'accounts/:id/edit',       name: 'accounts.edit',   component: AccountForm },
            { path: 'journal-entries',         name: 'journal.index',   component: JournalList },
            { path: 'journal-entries/create',  name: 'journal.create',  component: JournalCreate },
            { path: 'journal-entries/:id',     name: 'journal.show',    component: JournalShow },
            { path: 'reports/trial-balance',   name: 'reports.trial',   component: TrialBalance },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next({ name: 'login' })
    }

    if (to.meta.guest && auth.isAuthenticated) {
        return next({ name: 'accounts' })
    }

    next()
})

export default router