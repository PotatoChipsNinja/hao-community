<template>
  <el-row justify="center" align="middle" style="height: 100%;">
    <el-col :span="8">
      <el-card>
        <el-row justify="space-between">
          <span id="title">登录</span>
          <span id="helper">没有账号？<router-link to="/register">去注册</router-link></span>
        </el-row>
        
        <el-form style="margin-top: 2rem; padding: 0 0.5rem;">
          <el-form-item :error="errMsg.username">
            <el-input v-model="form.username" placeholder="用户名" @input="clearErr"></el-input>
          </el-form-item>
          <el-form-item :error="errMsg.password">
            <el-input v-model="form.password" placeholder="密码" show-password @input="clearErr"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 0;">
            <el-button type="primary" @click="onSubmit" style="width: 100%;">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Login',
  props: {
    username: String,
    userID: String,
    isAdmin: Boolean
  },
  emits: ['update:username', 'update:userID', 'update:isAdmin'],
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      errMsg: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit() {
      if (!this.form.username) {
        this.errMsg.username = '用户名不能为空'
      }
      
      if (!this.form.password) {
        this.errMsg.password = '密码不能为空'
      }

      if (this.form.username && this.form.password) {
        this.$axios.post('/api/user/login', {
          username: this.form.username,
          password: this.form.password
        })
          .then((res) => {
            if (res.data.success) {
              let userID = res.data.user_ID
              let isAdmin = res.data.isAdmin
              sessionStorage.setItem('username', this.form.username)
              sessionStorage.setItem('userID', userID)
              sessionStorage.setItem('isAdmin', isAdmin)
              this.$notify({
                title: '登录成功',
                type: 'success'
              })
              this.$emit('update:username', this.form.username)
              this.$emit('update:userID', userID)
              this.$emit('update:isAdmin', isAdmin)
              this.$router.replace('/')
            } else {
              this.errMsg.username = '用户名或密码错误'
              this.errMsg.password = '用户名或密码错误'
            }
          })
          .catch(() => {
            this.$notify({
              title: '连接至服务器失败',
              type: 'error'
            })
          })
      }
    },

    clearErr() {
      this.errMsg.username = ''
      this.errMsg.password = ''
    }
  }
}
</script>

<style>
.el-card {
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
}

#title {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 2rem;
}

#helper {
  color: #aeaeae;
  font-size: 0.9rem;
  line-height: 2rem;
}

#helper a {
  color: #5c5cff;
  text-decoration: unset;
}
</style>
