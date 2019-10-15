const Layout = () => import(/* webpackChunkName: 'index' */ '../views/layout')

const staticRoute = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName: 'index' */ '../views/login/login.vue')
    },
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import(/* webpackChunkName: 'home' */ '../views/empty'),
                meta:{
                    name:'empty'
                }
            }
        ]
    },
    {
        path: '/home',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import(/* webpackChunkName: 'home' */ '../views/home'),
                meta:{
                    name:'首页'
                }
            }
        ]
    },
    {
        path: '/upload',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import(/* webpackChunkName: 'home' */ '../views/upload/upload.vue'),
                meta:{
                    name:'上传文件'
                }
            }
        ]
    },
    // 你的其他路由
    {
        path: '/error',
        icon:'el-icon-message',
        component: () => import(/* webpackChunkName: 'error' */ '../views/error'),
        children: [
            {
                path: '401',
                component: () => import(/* webpackChunkName: 'error' */ '../views/error/401')
            },
            {
                path: '403',
                component: () => import(/* webpackChunkName: 'error' */ '../views/error/403')
            },
            {
                path: '404',
                component: () => import(/* webpackChunkName: 'error' */ '../views/error/404')
            },
            {
                path: '500',
                component: () => import(/* webpackChunkName: 'error' */ '../views/error/500')
            }
        ]
    },
]

export default staticRoute

