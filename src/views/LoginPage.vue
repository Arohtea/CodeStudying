<template>
    <div>
    <TopHeader></TopHeader>
    <div id="login-container">
        <form @submit.prevent="handleLogin">
            <h1>登录</h1>
            <div class="input-group">
                <label for="username">账号</label>
                <input type="text" id="username" v-model="username" required>
            </div>
            <div class="input-group">
                <label for="password">密码</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <p class="register-link"><router-link to="/regpage">新用户注册</router-link></p>
            <button type="submit">登录</button>
        </form>
    </div>
    <FrontFooter></FrontFooter>
</div>
</template>
<script>
import TopHeader from '@/components/TopHeader.vue';
import FrontFooter from '@/components/FrontFooter.vue';
import router from '@/router';
import qs from 'qs'; 
import axios from 'axios';
import instance from '@/instance/instance';
import { mapState } from 'vuex';
export default {
    router,
    components: {
        TopHeader,
        FrontFooter
    },
    data() {
        return {
            username: '',
            password: '',
            userinfo: {}
        };
    },
    methods: {
        async handleLogin() {
        try {
            const data = qs.stringify({
            username: this.username,
            password: this.password,
            });
            const response = await axios.post('http://localhost:8080/user/login', data, {
             headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (response.data.code === 0) {
                console.log('11231231');
                const token = response.data.data;
                console.log(token);
                localStorage.setItem('jwt-token',JSON.stringify(token));
                instance.get('/user/search').then(response => {
                    if (response.data.code === 0){
                        console.log('inforight')
                        this.$store.commit('setUserInfo', this.username);
                        this.$store.commit('setAvatar', response.data.data.avatar);
                        this.$store.commit('setLogincode', 1);
                        this.username = '';
                        this.password = '';
                        this.$store.commit('setUsername', response.data.data.nickname);
                        this.$store.commit('setSignature', response.data.data.signature);
                    }else{
                        console.log('infowrong')
                        this.$message.error('拉取个人信息出错。');
                    }
                });
                router.push('/'); 
            } else {
                throw new Error('无效的凭据');
            }
        } catch (error) {
            this.$message.error('登录失败，请检查您的凭据。');
            console.error(error);
        }
    }
    },
    computed: {
        ...mapState(['userId', 'logincode']),
    }
};
</script>
<style scoped>
#login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f8f9fa;
    font-family: Arial, sans-serif;
}

form {
    background-color: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 350px;
    transition: all 0.3s ease;
}

h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #343a40;
}

.input-group {
    margin-bottom: 1rem;
}

input {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #dee2e6;
    border-radius: 5px;
    outline: none;
}

input:focus {
    border-color: #007bff;
}

button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    border: none;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}

.forgot-password,
.register-link {
    text-align: center;
    margin-top: 10px;
}

.forgot-password a,
.register-link a {
    color: #007BFF;
    text-decoration: none;
}

.forgot-password a:hover,
.register-link a:hover {
    text-decoration: underline;
}
</style>