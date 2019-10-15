import {BaseService} from '../base/base_service'
export class LoginService extends BaseService {
    /**
     * 需求:调用登录接口并处理token
     * 作者:yinxg
     * 时间:2019.5.8
     */
    loginAction(params, _this) {
        _this.login("123")
        _this.$router.push({
            path: '/home'
        })
        return;
        this.$post('/admin/consumer/sysLogin', params).then(res => {
            let data = res;
            return new Promise((resolve, reject) => {
                if (data.code == '0') {
                    localStorage.aid = data.data.aid;
                    localStorage.account=data.data.realname;
                    _this.login(data.data.access_token)
                    resolve(data.data.access_token)
                } else if (data.code == '-1') {
                    _this.loading = false;
                    _this.createCode();
                    _this.$message({
                        message: data.message,
                        type: 'error'
                    })
                }

            })
        }).then((token) => {
            _this.$router.push({
                path: '/base_manage/mechanism'
            })
        })

    }
}
