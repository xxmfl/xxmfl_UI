/**
 * 需求:封装基础的axios请求数据的方法
 */
import axios from 'axios';
import qs from 'qs'
import Auth from '@/utils/auth'
import { Loading, Message } from 'element-ui'

axios.defaults.timeout = 2*5000 ; // 设置请求的超时时间
axios.defaults.baseURL =process.env.BASE_URL; // 自动配置的后台的请求的地址
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
/**
 * 需求:自定义请求拦截器
 */
axios.interceptors.request.use(
	config => {
		if(config.method === 'post') {
			config.data = qs.stringify(config.data)
		}
		return config;
	},
	error => {
		console.log(error)
		return Promise.reject(error);
	}
)

/**
 * 需求:自定义响应拦截去
 */
axios.interceptors.response.use(
	response => {
		// console.log(response)
		// if(response.data.errCode ==2){
		//     router.push({
		//         path:"",
		//         query:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
		//     })
		// }
		return response;
	},
	error => {
		console.log(error.response)
		if(error.response.status == 401) {
			Message({
				message: 'token过期',
				type: 'error',
			})
		}
		return Promise.reject(error)
	}
)

/**
 * 需求:封装的GET请求的方法
 * @param url
 * @param params
 * @returns {Promise<any>}
 */
export function fetch(url, params = {}) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
				params: params
			})
			.then(response => {
				resolve(response.data);
			})
			.catch(err => {
				reject(err)
			})
	})
}

/**
 * 需求:封装一般的POST请求的方法
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
export function post(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.post(url, data).then(res => {
			resolve(res.data);
		}).catch(error => {
			reject(error);
		})
	})
}

/**
 * 需求:封装patch请求的方法
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
export function patch(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.patch(url, data)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err)
			})
	})
}

/**
 * 需求:封装put请求的方法
 * @param url
 * @param data
 * @returns {Promise<any>}
 */
export function put(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.put(url, data)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err)
			})
	})
}
