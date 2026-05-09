import { createRouter, createWebHistory } from "vue-router";

// --- Purane Imports ---
import signIn from "@/components/sign-in.vue";
import register from "@/components/register.vue";
import AdminSettings from "@/components/AdminSettings.vue";
import AddStudent from "@/components/AddStudent.vue";
import AddTeacher from "@/components/AddTeacher.vue";
import AddSubject from "@/components/AddSubject.vue";
import TeacherDashboard from "@/components/TeacherDashboard.vue";

// --- ✅ NAYE IMPORTS (Jo aapne abhi create kiye hain) ---
import StudentDashboard from "@/components/StudentDashboard.vue";
import AdminDashboard from "@/components/AdminDashboard.vue";

const routes = [
  {
    path: '/',
    redirect: '/signin'
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
  // 🔥 STUDENT DASHBOARD: Login ke baad student yahan aayega
  {
    path: '/dashboard',
    name: 'StudentDashboard',
    component: StudentDashboard
  },
  // 🔥 ADMIN DASHBOARD: Admin ka main management page
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  {
    path: '/admin-settings',
    name: 'AdminSettings',
    component: AdminSettings
  },
  {
    path: '/add-student',
    name: 'AddStudent',
    component: AddStudent
  },
  {
    path: '/add-teacher',
    name: 'AddTeacher',
    component: AddTeacher
  },
  {
    path: '/add-subject',
    name: 'AddSubject',
    component: AddSubject
  },
  {
    path: '/teacher-dashboard',
    name: 'TeacherDashboard',
    component: TeacherDashboard
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Security Guard
router.beforeEach((to, from, next) => {
  const publicPages = ['/signin', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('student') || localStorage.getItem('teacher') || localStorage.getItem('admin');

  if (authRequired && !loggedIn) {
    return next('/signin');
  }
  next();
});

export default router;