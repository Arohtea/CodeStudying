<template>
  <div>
    <TopHeader></TopHeader>
    <div class="user-profile">
      <el-card class="user-info">
        <div slot="header" class="clearfix">
          <el-avatar :size="100" :src="avatar"></el-avatar>
          <el-upload action="http://localhost:8080/upload" :show-file-list="false" :on-success="handleAvatarSuccess"
            class="avatar-uploader" accept="image/*" :before-upload="beforeAvatarUpload" :multiple="false">
            <el-button size="small">更换头像</el-button>
          </el-upload>
        </div>
        <div class="info-content">
          <el-form ref="userInfoForm" :model="user" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-if="isEditingUsername" v-model="tempUsername" @blur="saveEditedUsername"
                placeholder="请输入用户名"></el-input>
              <span v-else @click="startEditUsername">{{ username }}</span>
            </el-form-item>
            <el-form-item label="账号">
              <span>{{ userId }}</span>
            </el-form-item>
            <el-form-item label="个性签名">
              <el-input v-model="signaturee" placeholder="请输入个性签名"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="updateSignature">保存签名</el-button>
        </div>
      </el-card>
    </div>
    <FrontFooter></FrontFooter>
  </div>
</template>

<script>
import instance from '@/instance/instance';
import { mapState } from 'vuex';
import TopHeader from '@/components/TopHeader.vue';
import FrontFooter from '@/components/FrontFooter.vue';
export default {
  components: {
    TopHeader,
    FrontFooter
  },
  data() {
    return {
      signaturee: '',
      currentIndex: 0,
      isEditingUsername: false, 
      tempUsername: '',
    };
  },
  computed: {
    ...mapState(['userId', 'logincode', 'avatar', 'username',  'signature']),
  },

  methods: {
    startEditUsername() {
      this.isEditingUsername = true;
      this.tempUsername = this.user.username;
      this.$nextTick(() => {
        const inputElement = document.querySelector('.user-info .el-input__inner');
        if (inputElement) {
          inputElement.focus(); 
          inputElement.style.animation = 'shake 0.5s ease-in-out';
          setTimeout(() => {
            inputElement.style.animation = '';
          }, 500);
        }
      });
    },
    saveEditedUsername() {
      this.tempUsername = this.tempUsername.trim();
      if (!this.tempUsername) {
        this.isEditingUsername = false;
        this.$message.error('用户名不能为空！');
        return;
      }
      const data = {
        nickName: this.tempUsername,
        signature: this.signature,
        avatar: this.avatar
      };
      instance.post('/user/info', data)
        .then(() => {
          this.$message.closeAll();
          this.$message.success('用户名更新成功！');
          this.isEditingUsername = false;
          this.$store.commit('setUsername', this.tempUsername);
        })
        .catch((error) => {
          this.$message.closeAll();
          console.error(error);
          this.$message.error('更新用户名时出错！');
        });
    },
    beforeAvatarUpload(file) {
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGorPNG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPGorPNG && isLt2M;
    },
    async handleAvatarSuccess(response) {
      this.$store.commit('setAvatar', response.data);
      const data = {
        newName: this.username,
        signature: this.signature,
        avatar: response.data
      };
      const respon=await instance.post('/user/info', data);
      if(respon.data.code===0){
        this.$message.success('头像上传成功！');
      }else if(respon.data.code===1){
        this.$message.error('头像上传失败！');
      }
    },

    updateSignature() {
      const data = {
        newName: this.username,
        signature: this.signaturee,
        avatar: this.avatar
      };
      instance.post('/user/info', data)
        .then(respose => {
          if (respose.data.code === 1) {
            this.$message.error('个性签名保存失败！');
            return;
          }
          this.$message.success('个性签名保存成功！');
          this.$store.commit('setSignature', this.signaturee);
        })
        .catch((error) => {
          console.error(error);
          this.$message.error('保存个性签名时出错！');
        });
    },
  },
  created() {
    this.signaturee = this.signature;

  }
};
</script>

<style scoped>
.user-profile {
  margin-top: 20px;
}

.user-info {
  margin-bottom: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}
.footer {
    background-color: #333;
    color: white;
    padding: 20px;
    text-align: center;  
    position: absolute;
    width: 97%;
    bottom: 0;
}
</style>