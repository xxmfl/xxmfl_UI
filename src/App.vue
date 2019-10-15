<template>
	<div id="app" class="sys-app">
		<router-view/>
	</div>
</template>

<script>
    import {AppService} from '@/service/app_service.js'
    import Cookie from 'js-cookie'

    export default {
        name: 'App',
        data: function () {
            return {
                appService: new AppService() ,
                a: 10
            }
        },
        // TODO: 全局状态加载及变更。请根据实际情况改写
        //beforeMount(){
        //    // 首次加载/刷新时判断当前是否在登录状态
        //    if (Cookie.get('isLogin')) {
        //        console.log("重新登录")
        //        this.$store.dispatch('auth/relogin')
        //    }
        //},
        created: function () {
//      this.appService.initPage(this);
            this.appService.pageInitApp(this);
        },

    }
</script>

<!--全局样式引入-->
<style lang="scss" src="@/styles/variables.scss"></style>
<style lang="scss" src="@/styles/index.scss"></style>
