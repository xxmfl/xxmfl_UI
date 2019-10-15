import Vue from 'vue'
import Router from 'vue-router'
import {Message} from 'element-ui'
import staticRoute from './staticRoute'
import store from '../store'
import Auth from '@/utils/auth'
import whiteList from './whiteList'

var permissionList = []

function initRoute(router) {
    return new Promise((resolve) => {
        if (permissionList.length == 0) {
            console.log("没有权限数据，正在获取")
            store.dispatch('auth/getNavList').then((req) => {
                store.dispatch('auth/getPermissionList', req).then((res) => {
                    console.log("权限列表生成完毕")
                    // console.log(res)
                    permissionList = res.permissionList
                    router.addRoutes(res.routers)
                    resolve()
                })
            })
        } else {
            console.log("已有权限数据")
            resolve()
        }
    })
}

Vue.use(Router)

const router = new Router({
    mode: 'hash',
    routes: staticRoute
})

// 路由跳转前验证
router.beforeEach((to, from, next) => {
    if (Auth.isLogin()) {
        if (to.path === '/login') {
            localStorage.removeItem('routers')
            // next({path: "/login", replace: true})
            next()
        } else {
            if (store.state.auth.navList.length <= 0) {
                initRoute(router).then(() => {
                    let isPermission = false
                    console.log("进入权限判断")
                    // console.log(permissionList)
                    permissionList.forEach((v) => {
                        // 判断跳转的页面是否在权限列表中
                        // console.log(v)
                        // console.log(to.fullPath)
                        if (v.path == to.fullPath) {
                            isPermission = true
                        }
                    })
                    // 没有权限时跳转到401页面
                    if (!isPermission) {
                        next({path: "/error/401", replace: true})
                    } else {
                        next()
                    }
                })
            }
            next()
        }
    } else {
        if (whiteList.indexOf(to.path) >= 0) {
            console.log('该页面无需登录即可访问')
            next()
        } else {
            next({path: "/login", replace: true})
        }
    }
})

export default router
