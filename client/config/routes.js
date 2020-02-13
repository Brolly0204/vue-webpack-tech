export default [
  {
    path: '/',
    redirect: '/app'
  },
  {
    path: '/app',
    component: () => import('../views/todo')
  },
  {
    path: '/login',
    component: () => import('../views/Login')
  }
]
