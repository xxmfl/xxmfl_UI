<template>
    <div class="side-nav">
        <div class="left-nav-top" >
            <el-dropdown class="login-user-info" menu-trigger="hover">
                <span class="el-dropdown-link user">
                    <div class="avatar">
                        <img :src="currentAvatar?currentAvatar:defaultAvatar">
                    </div>
                    <div class="username">{{username}}<i class="el-icon-caret-bottom el-icon--right"></i></div>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><div @click="editPwdClick">修改密码</div></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <el-menu class="first-el-menu" :collapse="collapse" router ref="navbar" :default-active="defActive" menu-trigger="hover" @select="selectMenu" unique-opened>
            <nav-bar-item v-for="(item, n) in navList" :item="item" :navIndex="String(n)" :key="n"></nav-bar-item>

        </el-menu>
        <el-dialog title="修改密码" width="400px" :visible.sync="editPawShow" append-to-body>
            <el-form :model="editPaw" :rules="editPawRules" ref="editPaw" label-width="100px">
                <el-form-item label="旧密码" prop="oldPaw">
                    <el-input v-model="editPaw.oldPaw" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPaw">
                    <el-input v-model="editPaw.newPaw" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmNewPaw">
                    <el-input v-model="editPaw.confirmNewPaw" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div style="text-align:center;">
                <el-button type="primary" @click="editPawSubmit">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import navbar_item from '@/components/layout/navbar_item'
import { mapState } from 'vuex'
import axios from "axios";
import Auth from '@/utils/auth'
export default {
    components: {
        'nav-bar-item': navbar_item
    },
    props: {
        collapse: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            username:localStorage.account,
            roleName:localStorage.userAuthInfo,
            currentAvatar:localStorage.avatar,
            defaultAvatar:require('@/assets/img/man.png'),
            editPawShow:false,
            editPaw: {
                oldPaw: '',
                newPaw: '',
                confirmNewPaw: ''
            },
            editPawRules: {
                oldPaw: [{
                    required: true,
                    message: '请输入旧密码',
                    trigger: 'blur'
                }],
                newPaw: [{
                    required: true,
                    message: '请输入新密码',
                    trigger: 'blur'
                },
                    {
                        min: 8,
                        max: 20,
                        message: '长度在 8 到 20 个字符',
                        trigger: 'blur'
                    },
                    {
                        // eslint-disable-next-line
                        validator(rule, value, callback, source, options) {
                            var errors = [];
                            if (!/^[a-z0-9]+$/.test(value)) {
                                console.log("不符合输入规则")
                                errors.push("请输入字母或特殊字符")
                            }
                            callback(errors);
                        }
                    }
                ],
                confirmNewPaw: [{
                    required: true,
                    message: '请再次输入新密码',
                    trigger: 'blur'
                },
                    {
                        min: 8,
                        max: 20,
                        message: '长度在 8 到 20 个字符',
                        trigger: 'blur'
                    },
                    {
                        // eslint-disable-next-line
                        validator(rule, value, callback, source, options) {
                            var errors = [];
                            if (!/^[a-z0-9]+$/.test(value)) {
                                console.log("不符合输入规则")
                                errors.push("请输入字母或特殊字符")
                            }
                            callback(errors);
                        }
                    }
                ]
            }
        }
    },
    computed:{
        ...mapState({
            navList: state => state.auth.navList
        }),
        defActive(){
            return this.$route.path
        },
    },
    watch: {
        // 当通过TagNav来激活页面时也执行一次selectMenu
        $route(){
            let path = this.$route.path
            if (this.$refs.navbar.items[path]) {
                let indexPath = this.$refs.navbar.items[path].indexPath
                this.selectMenu(path, indexPath)
            }
        }
    },
    methods: {
        //处理navList
        init(val) {
            for (let i = 0; i < val.length; i++) {
                if (val[i].permission) {
                    val.splice(i, 1)
                } else {
                    if (val[i].child) {
                        this.init(val[i].child)
                    }
                }
            }
        },
        editPwdClick(){
            this.editPawShow=true
        },
        editPawSubmit() {
            let _this = this;
            this.$refs.editPaw.validate((valid) => {
                if (valid) {

                    let params={
                        "oaid": localStorage.oaid,//用户ID
                        "oldPassword": _this.BASE64.encode(_this.editPaw.oldPaw),//老密码
                        "newPassword": _this.BASE64.encode(_this.editPaw.newPaw)//新密码
                    };
                    axios.post('/organization/userAccount/editUserPassword', {
                        param: JSON.stringify(params),
                        access_token: Auth.hasToken()
                    }).then(res => {
                        if (res.data.code == '0') {
                            _this.$message({
                                message: res.data.message,
                                type: 'success'
                            })
                            _this.editPawShow=false;
                        }else{
                            _this.$message({
                                message: res.data.message,
                                type: 'error'
                            })
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // eslint-disable-next-line
        selectMenu(index, indexPath) {
            /**
             * 在选择父级菜单时自动关闭其下所有子菜单
             * 选择时获取点击菜单的父级index，并计算得到该index在已打开菜单中的索引值，
             * 关闭位于当前打开菜单中该索引值之后的全部菜单
             */
            let openedMenus = this.$refs.navbar.openedMenus
            let openMenuList
            // 如果点击的是二级菜单，则获取其后已经打开的菜单
            if (indexPath.length > 1) {
                let parentPath = indexPath[indexPath.length - 2]
                openMenuList = openedMenus.slice(openedMenus.indexOf(parentPath) + 1)
            } else {
                openMenuList = openedMenus
            }

            // 关闭菜单
            openMenuList = openMenuList.reverse()
            openMenuList.forEach((ele) => {
                this.$refs.navbar.closeMenu(ele)
            })
        },
    },
}
</script>
<style lang="scss" scoped>
/deep/.el-menu{
    background: rgba(42, 49, 77, 1);
    border: none;
    .el-menu-item{
        color: rgb(204, 204, 222);

    }
    .el-menu-item.is-active {
        color: rgb(204, 204, 222);
        background: #21263c;
    }
    .el-menu-item:focus,
    .el-menu-item:hover{
        background: #21263c;
    }
}
.side-nav{
    position: fixed;
    width: 15.7em;
    z-index: 2001;
    height:100vh;
    top: 0px;
    background: rgba(42, 49, 77, 1);
    -webkit-transition: all .5s;
    transition: all .5s;
    overflow-y: auto;
    overflow-x: hidden;
}
.left-nav-top{
        text-align: center;
    padding: 16px 0px;
    .login-user-info{
        color: rgb(204, 204, 222);
    }
    .avatar{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        img{
            width: 100%;
        }
    }
}
</style>

