import { createRouter, createWebHistory } from 'vue-router'
import redirUrl from '../components/redirUrl.vue'

const routes = [
  {
    path: '/',
    name: 'Shortened URLs',
    component: redirUrl
  },
  {
    path: '/:url',
    name: 'Redirection...',
    component: redirUrl
  },
  {
    path: '/manage-shortened-urls',
    name: 'Gestion des raccourcis',
    component: () => import('../views/ManagePanel.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.afterEach((to) => {
  document.title = to.name;
});

export default router
