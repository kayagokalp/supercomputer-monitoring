
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'dashboard', component: () => import('pages/Dashboard.vue'), meta: { skeleton: true } },
      { path: 'superview', component: () => import('pages/Superview.vue'), meta: { skeleton: true } },
      { path: 'customDashboard', name: 'customDashboard', component: () => import('pages/CustomDashboard.vue'), meta: { skeleton: true } }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
