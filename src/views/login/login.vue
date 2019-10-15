<template>
	<div class="login">

		<div class="login-content" >
            <div class="login-mask"></div>
			<img class="login-bg"  src="@/assets/img/1.jpg">
            <div class="login-header">
                <!-- <img class="login-brand-logo" src="@/assets/img/logo/logo.jpg"> -->
                <div class="login-brand-logo">N4</div>
                <span class="logo-desc"><span class="span1">N4Helper</span></span>
            </div>
			<div class="form-group">

                <div class="welcom-">Hello! Administrator</div>
				<el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px">
                    <el-form-item prop="name">
                        <el-input class="log-input" v-model="loginForm.name" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input class="log-input" :type="pwdType" v-model="loginForm.password" name="password" placeholder="密码" prefix-icon="el-icon-unlock" @keyup.enter.native="onSubmitLogin('loginForm')"/>
                        <span class="show-pwd" @click="showPwd"><i class="el-icon-view"></i></span>
                    </el-form-item>
                    <el-form-item prop="seccode" class="inputbar">
                        <el-input round class="log-input" v-model="loginForm.seccode" placeholder="验证码" prefix-icon="el-icon-attract" @keydown.enter.native="onSubmitLogin('loginForm')"></el-input>
                        <span class="checkCode" @click="createCode">{{ checkCode}}<i class="el-icon-refresh" style="margin-left: 5px;"></i></span>
                    </el-form-item>
					<el-form-item class="login-btn">
						<el-button type="primary" round @click="onSubmitLogin('loginForm')" @keyup.enter="onSubmitLogin('loginForm')" element-loading-spinner="el-icon-loading" :loading="loading">
							登录
						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {LoginService} from '@/service/login/login_service'
    export default {
	name: 'login',
	data() {
		return {
			LoginService: new LoginService(),
			loading: false,
			loginForm: {
				username: '',
				password: '',
			},
			pwdType: 'password', //密码类型是否是password
			loginRules: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                seccode: [{
                    required: true,
                    message: '请输入验证码',
                    trigger: 'blur'
                }],
			},
            checkCode:'',//验证码
		}

	},
	created() {
        this.createCode();
	},
	methods: {
		...mapActions({
			login: 'auth/userLogin', //引入vuex当中的方法
		}),
        createCode() {
            let code = "";
            let codeLength = 4; //验证码的长度
            let random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //随机数
            for(let i = 0; i < codeLength; i++) { //循环操作
                let index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）
                code += random[index]; //根据索引取得随机数加到code上
            }
            this.checkCode = code; //把code值赋给验证码
        },
		//密码的显示隐藏
		showPwd() {
			if(this.pwdType === 'password') {
				this.pwdType = 'text'
			} else {
				this.pwdType = 'password'
			}
		},
		//调用登陆接口
		onSubmitLogin(formName) {
			this.$refs[formName].validate((valid) => {
				if(valid) {
                    if(this.loginForm.seccode.toLowerCase() != this.checkCode.toLowerCase()) {
                        this.$message({
                            message: "验证码错误",
                            type: "warning"
                        });
                        this.createCode();
                        return false;
                    };
                    this.loading = true;
                    
					//使用login_service里面的方法
					this.LoginService.loginAction({
                        username: this.loginForm.username,
                        password: this.loginForm.password,
                    }, this)
				} else {
					console.log('error submit!!');
					return false;
				}
			});

		},
	},
}
</script>

<style scoped lang="scss">
    .login {
        font-size: 13px;
        .show-pwd {
            position: absolute;
            right: 10px;
            top: 0;
            font-size: 16px;
            color: #ccccde;
            cursor: pointer;
            user-select: none;
        }
        .login-header{
            position: absolute;left: 30px;top: 20px;
            text-align: left;
            .login-brand-logo{
                vertical-align: middle;
                height: 50px;
                display: inline-block;
                background: rgba(42, 49, 77, 1);
                border-radius: 50%;
                text-align: center;
                line-height: 50px;
                font-size: 20px;
                width: 50px;
            }
            .logo-desc {
                vertical-align: middle;
                display: inline-block;
                text-align: left;
                margin-left: 10px;
                span{
                    display: block;
                    font-size: 20px;
                }
            }
        }
        .welcom-{
            font-size: 25px;
            font-weight: 100;
            margin-bottom: 10px;
            font-family: sans-serif;
        }

        .login-content{
            overflow: hidden;
            height: 100vh;
            position: relative;
            text-align: center;
            color: rgb(204, 204, 222);

            .login-mask{
                background: rgba(38, 45, 71, 0.5);
                position: absolute;
                width: 100%;
                height: 100%;
            }
            img.login-bg{
                min-width: 100%;
            }

            .form-group{
                width: 360px;
                margin: 0 auto;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-left: -200px;
                margin-top: -162px;
            }
            .el-form-item.login-btn{
                padding-top: 10px;
                .el-form-item__content{
                    .el-button{
                        width: 55%;
                    }
                }
            }
        }
    }
    /deep/.login-content .el-input__inner{
        background: none;
        border: none;
        border-radius: 0;
        border-bottom: 1px solid #ccc;
        color: #ccccde;
    }
    /deep/.login-content .el-input__icon{
        line-height: 32px;
        font-size: 16px;
        text-align: left;
    }
    .checkCode,
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 0;
        font-size: 16px;
        color: #889aa4;
        cursor: pointer;
        user-select: none;
    }
    .checkCode{
        color: #ccccde;
        top: 0px;
        height: 35px;
        padding: 0px 10px;
        right: -1px;
    }
</style>


