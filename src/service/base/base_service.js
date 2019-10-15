import axios from 'axios';
import { post, fetch, patch, put,formDaTaPost} from './base_http.js'

/**
 * 需求:基础业务逻辑处理工具封装
 * 作者:燕青
 * @constructor
 */
export class BaseService {
	// 自定义封装方法
	$post = post;
	$fetch = fetch;
	$patch = patch;
	$put = put;
}
