import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router'
import proShopCartDemo from '@/components/proShopCartDemo'
import register from '../components/register.vue'
import userLogin from '../components/userLogin.vue'
import goodsType from '../components/goodsType.vue'
import goodsProduct from '../components/goodsProduct.vue'
import cart from '../components/cart.vue'
import profile from '../components/profile.vue'

Vue.use(Router)

// 【添加代码】解决vue-router在3.0版本以上重复点路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    routes: [{
        path: '/',
        name: 'proShopCartDemo',
        component: proShopCartDemo
    }, {
        path: '/register',
        name: 'register',
        component: register
    }, {
        path: '/userLogin',
        name: 'userLogin',
        component: userLogin
    }, {
        path: '/goodsType',
        name: 'goodsType',
        component: goodsType
    }, {
        path: '/goodsProduct',
        name: 'goodsProduct',
        component: goodsProduct
    }, {
        path: '/cart',
        name: 'cart',
        component: cart
    }, {
        path: '/profile',
        name: 'profile',
        component: profile
    }]
})