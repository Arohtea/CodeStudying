import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userId: 0,
        logincode: 0,
        avatar: 'https://movie-web12321.oss-cn-beijing.aliyuncs.com/a1c640be-26bd-4117-9e12-49e3f436f5c7.jpg',
        username: '未登录',
        signature: '' 
    },

    mutations: {
        setUserInfo(state, userId) {
            state.userId = userId
        },
        setLogincode(state, logincode) {
            state.logincode = logincode
        },
        setAvatar(state, avatar) {
            state.avatar = avatar
        },
        setUsername(state, username) {
            state.username = username
        },
        setSignature(state, signature) {
            state.signature = signature
        }
},
})

export default store