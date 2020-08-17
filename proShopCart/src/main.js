import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import { Button, Lazyload, Search, Swipe, SwipeItem, Pagination, Sidebar, SidebarItem, Toast, SubmitBar, Stepper, Sku, GoodsAction, GoodsActionIcon, GoodsActionButton, NavBar, Field, Dialog, Notify, Tab, Tabs, Tabbar, TabbarItem } from 'vant'

Vue.use(Button)
Vue.use(NavBar)
Vue.use(Field)
Vue.use(Dialog)
Vue.use(Notify)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(GoodsAction)
Vue.use(GoodsActionButton)
Vue.use(GoodsActionIcon)
Vue.use(Sku)
Vue.use(Stepper)
Vue.use(SubmitBar)
Vue.use(Toast)
Vue.use(Sidebar)
Vue.use(SidebarItem)
Vue.use(Pagination)
Vue.use(Search)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Lazyload)

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})