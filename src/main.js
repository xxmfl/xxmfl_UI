// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';
import '../theme/index.css'
import ElementUI from 'element-ui';


//画图工具
import './utils/raphael.js'
//拖拽
import './utils/drag.js'

//引入 font-awesome
import 'font-awesome/css/font-awesome.min.css';


Vue.config.productionTip = false
// register globally
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
