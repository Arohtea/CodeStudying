<template>
    <div>
        <TopHeader></TopHeader>
        <div id="login-container">
            <form @submit.prevent="handleRegister">
                <h1>注册新账户</h1>
                <div class="input-group">
                    <label for="username">账号ID</label>
                    <input type="text" id="username" v-model="username" required>
                </div>
                <div class="input-group">
                    <label for="username">用户名</label>
                    <input type="text" id="username" v-model="nickname" required>
                </div>
                <div class="input-group">
                    <label for="password">密码</label>
                    <input type="password" id="password" v-model="password" required>
                </div>
                <div class="input-group">
                    <label for="confirmPassword">确认密码</label>
                    <input type="password" id="confirmPassword" v-model="confirmPassword" required>
                </div>
                <div class="input-group agree">
                    <div class="input-group agree-checkbox">
                        <input type="checkbox" id="agree" v-model="agreed" required>
                    </div>
                    <span>&nbsp;</span>
                    <div class="input-group agree-checkbox-checkbox-label">
                        我已经阅读并同意 <a href="#" target="_blank">《超绝电影网站绝绝子协议》</a>
                    </div>
                </div>



                <button type="submit">注册</button>
            </form>
        </div>
        <FrontFooter></FrontFooter>
    </div>
</template>

<script>
import TopHeader from '@/components/TopHeader.vue';
import FrontFooter from '@/components/FrontFooter.vue';
import axios from 'axios'; 
import qs from 'qs'; 
import router from '@/router';

export default {
    components: {
        TopHeader,
        FrontFooter
    },
    data() {
        return {
            username: '',
            password: '',
            nickname: '',
            confirmPassword: '',
            agreed: false
        };
    },
    methods: {
        async handleRegister() {
            try {
                if (this.password !== this.confirmPassword) {
                    alert('密码和确认密码不一致！');
                    return;
                }
                if (!this.agreed) {
                    alert('请先阅读并同意《超绝电影网站绝绝子协议》');
                    return;
                }
                const data = qs.stringify({
                username: this.username,
                password: this.password,
                nickname: this.nickname
                });
                const response = await axios.post('http://localhost:8080/user/register', data, {
                 headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }
                 });

                if (response.data.code === 0) {
                    this.$message.success('注册成功！现在您可以登录了。');
                    this.username = '';
                    this.password = '';
                    this.confirmPassword = '';
                    this.agreed = false;
                    router.push('/loginpage'); 
                } else {
                    throw new Error('无效的凭据');
                }
            } catch (error) {
                // alert('注册失败，请检查您的凭据。');
                this.$message.error('注册失败，请检查您的凭据。');
                console.error(error);
            }
        }
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
.input-group.agree{
    display: flex;
} 
.input-group.agree-checkbox {
    width: 15px;
    height: 15px;
}

.inline-label {
    margin-left: 15px;
    cursor: pointer;
}
</style>