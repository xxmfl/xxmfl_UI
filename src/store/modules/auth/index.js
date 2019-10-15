import Auth from '@/utils/auth'
import lazyLoading from '@/utils/lazyLoading'
import navList from '@/router/navList'

const state = {
    navList: [],
}

const mutations = {
    setNavList: (state, data) => {
        state.navList = data
    },
    setToken: (state, data) => {
        if (data) {
            Auth.setToken(data)
            Auth.setLoginStatus()
        } else {
            Auth.removeToken()
            Auth.removeLoginStatus()
        }
        state.token = data
    }
}

const actions = {
    // 获取该用户的菜单列表
    getNavList({commit}) {
        return new Promise((resolve) => {
            let data = navList;
            localStorage.routers = JSON.stringify(data)
            resolve(data)
        })
    },
    // 将菜单列表扁平化形成权限列表
    getPermissionList({state, commit}, routers) {
        commit("setNavList", routers)
        return new Promise((resolve) => {
            let permissionList = []

            // 将菜单数据扁平化为一级
            function flatNavList(arr) {
                for (let v of arr) {
                    // console.log(v)
                    v.component = lazyLoading(v.COMPONENT)
                    if (v.children && v.children.length > 0) {
                        flatNavList(v.children)
                    } else if (v.children.length == 0) {
                        permissionList.push(v)
                    } else {
                        permissionList.push(v)
                    }

                }
            }

            flatNavList(routers)
            let map = {
                routers: routers,
                permissionList: permissionList
            }
            resolve(map)
        })
    },
    // 登录token保存
    userLogin({
                  commit
              }, token) {
        return new Promise((resolve) => {
            //      	console.log(token)
            commit('setToken', token)
            resolve(token)
        });
    },
    // 登出
    logout({ commit }) {
        return new Promise((resolve) => {
            console.log('logout')
            localStorage.clear()
            commit('setToken', '')
            commit('user/setName', '', {root: true})
            commit('tagNav/removeTagNav', '', {root: true})
            resolve()
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
