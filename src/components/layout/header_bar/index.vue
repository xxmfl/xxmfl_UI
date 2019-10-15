<template>
    <div class="sys-header">
        <nav class="navbar">
            <div class="navbar-header">
                <div class="navbar-brand">
                    <span class="logo-desc"><span class="span1">N4Helper</span></span>
                </div>
            </div>
            <div class="navbar-container">
                <ul class="navbar-toolbar navbar-right">
                    <li class="nav-item userInfo">
                        <a class="navbar-minimalize logout" @click="logout"><i class="el-icon-switch-button"></i>退出</a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    data() {
        return {
            username:'',
            miniBar:true,
            dialog: {
                editPaw: {
                    show: false
                }
            },
        }
    },
    computed: {

    },
    methods: {
        ...mapActions({
            sysLogout: 'auth/logout',
            loadLang: 'loadLang'
        }),
        userOperation(command){
            switch(command){
                case 'logout': 
                    this.logout()
                    break
            }
        },
        logout() {
            this.sysLogout().then(() => {
                this.$router.push('/login')
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.sys-header {
    .navbar {
       position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        height: 4.3em;
        border: none;
        z-index: 2000;
        margin-bottom: 0px;
        border-radius: 0px;
        padding-left: 220px;
        .navbar-header {
            width: 15.7em;
            float: left;
            &::before,
            &::after {
                display: table;
                content: " ";
            }
            .navbar-brand {
                float: left;
                padding: 0em 1em;
                line-height: 40px;
                color: #acb4d4;
                font-size: 20px;
            }
        }
    }
    .navbar-minimalize {
        i {
            font-size: 1.3em;
        }
    }
    .navbar-container {
        padding: 0px;
        .navbar-toolbar {
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            padding-left: 0;
            li {
                position: relative;
                display: inline-block;
                a {
                    color: #acb4d4;
                    cursor: pointer;
                    position: relative;
                    display: block;
                    padding: 1.6em 1em;
                    height: 4.3em;
                    font-size: 1em;
                    &:hover{
                        background: #acb4d4;
                        color: white;
                    }
                }
            }
        }
    }
    .avatar {
        width: 3em;
        vertical-align: middle;
        display: inline-block;
        margin: 0 .5em 0 1em;
        img {
            width: 100%;
            max-width: 100%;
            height: auto;
            border: 0;
            border-radius: 1000px;
        }
    }
    .user {
        //color: #000;
    }
    .username {
        display: inline-block;
        vertical-align: middle;
        line-height: 60px;
    }
    .message {
        padding: 1.4em 1em;
        display: inline-block;
        position: relative;
        i {
            font-size: 1.5em;
            color: white;
        }
        .label {
            line-height: 12px;
            padding: 1px 5px;
            position: absolute;
            right: 6px;
            top: 12px;
        }
    }
}

.message-drop {
    width: 300px;
    color: #777;
    a {
        color: #777;
        font-size: 12px;
    }
}

.nav-tabs>li.active>a,
.nav-tabs>li.active>a:focus,
.nav-tabs>li.active>a:hover,
.navbar li>a:focus,
.navbar li>a:hover {
    background-color: rgba(0, 0, 0, .1);
    color: #fff;
    border-color: transparent;
}

</style>
