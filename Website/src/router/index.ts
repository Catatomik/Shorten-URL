import { createRouter, createWebHistory } from "vue-router";
import RedirUrl from "../components/RedirUrl.vue";

const routes = [
  {
    path: "/",
    name: "Shortened URLs",
    component: RedirUrl,
  },
  {
    path: "/:url",
    name: "Redirection...",
    component: RedirUrl,
  },
  {
    path: "/manage-shortened-urls",
    name: "Gestion des raccourcis",
    component: () => import("../views/ManagePanel.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  document.title = to.name as string;
});

export default router;
