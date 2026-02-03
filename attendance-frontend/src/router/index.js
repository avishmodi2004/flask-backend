import { createRouter, createWebHistory } from "vue-router";
import admin from "@/components/admin.vue";
import dashboard from "@/components/dashboard.vue";
import signIn from "@/components/sign-in.vue";
import register from "@/components/register.vue";

const routes = [
    {
      path: '/',
      redirect: '/signin'  // default route
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: signIn
    },
    {
      path: '/register',
      name: 'Register',
      component: register
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: dashboard
    },
    {
      path: '/admin',
      name: 'Admin',
      component: admin
    }
  ]

const router = createRouter({
    history: createWebHistory() ,
    routes
});

export default router;
  