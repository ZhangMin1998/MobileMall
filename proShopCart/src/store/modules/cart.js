//初始化数据
const state = {
        shopCartList: ''
    }
    //对外映射数据
const getters = {
        shopCartList: state => {
            state.shopCartList
        }
    }
    //映射事件
const actions = {
    addToVuex({ commit }, _n) { //这个_n是cart.vue里面的this.cartArr
        commit('add', _n)
    }
}

//一些逻辑操作
const mutations = {
    add(state, _n) {
        state.shopCartList = _n;
    }
}


export default {
    state,
    getters,
    actions,
    mutations
}