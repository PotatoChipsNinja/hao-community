<template>
  <el-row justify="center" style="padding-top: 3rem;">
    <el-col :span="14">
      <el-tabs tab-position="left" style="height: 100%;">
        <el-tab-pane label="修改基本信息">
          <el-form label-width="5rem" style="width: 80%; text-align: center;">
            <el-form-item label="用户名">
              <el-input v-model="form.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="form.realname" disabled></el-input>
            </el-form-item>
            <el-form-item label="证件号">
              <el-input v-model="form.IDNum" disabled></el-input>
            </el-form-item>
            <el-form-item label="电话号码">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input v-model="form.info" :rows="2" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="城市">
              <el-input v-model="form.city" disabled></el-input>
            </el-form-item>
            <el-form-item label="社区">
              <el-input v-model="form.community" disabled></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">确认修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改密码">
          <el-form label-width="5rem" style="width: 80%; text-align: center;">
            <el-form-item label="原密码">
              <el-input v-model="form.oldPassword" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="form.newPassword" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmitPasswd">确认修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Account',
  props: {
    username: String,
    userID: String,
    isAdmin: Boolean
  },
  data() {
    return {
      form: {
        username: '',
        realname: '',
        IDNum: '',
        phone: '',
        info: '',
        city: '',
        community: '',
        oldPassword: '',
        newPassword: ''
      }
    }
  },
  methods: {
    formatDate() {
      let date = new Date()
      let yyyy = date.getFullYear().toString()
      let MM = (date.getMonth() + 1).toString()
      let dd = date.getDate().toString()
      return yyyy + '-' + MM + '-' + dd
    },
    onSubmit() {
      this.$axios.post('/api/user/change', {
        user_ID: this.userID,
        phone: this.form.phone,
        introduction: this.form.info,
        time: this.formatDate()
      })
        .then((res) => {
          if (res.data.success) {
            this.$notify({
              title: '修改成功',
              type: 'success'
            })
          } else {
            this.$notify({
              title: '修改失败',
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '连接至服务器失败',
            type: 'error'
          })
        })
    },
    onSubmitPasswd() {
      this.$axios.post('/api/user/login', {
        username: this.username,
        password: this.form.oldPassword
      })
        .then((res) => {
          if (res.data.success) {
            this.$axios.post('/api/user/change', {
              user_ID: this.userID,
              password: this.form.newPassword,
              time: this.formatDate()
            })
              .then((res) => {
                if (res.data.success) {
                  this.$notify({
                    title: '修改成功',
                    type: 'success'
                  })
                } else {
                  this.$notify({
                    title: '修改失败',
                    type: 'error'
                  })
                }
              })
              .catch(() => {
                this.$notify({
                  title: '连接至服务器失败',
                  type: 'error'
                })
              })
          } else {
            this.$notify({
              title: '原密码错误',
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '连接至服务器失败',
            type: 'error'
          })
        })
    },
    getInfo() {
      this.$axios.get('/api/user/check', {
        params: {
          user_ID: this.userID
        }
      })
        .then((res) => {
          this.form.username = res.data.username
          this.form.realname = res.data.name
          this.form.IDNum = res.data.ID
          this.form.phone = res.data.phone
          this.form.info = res.data.introduction
          this.form.city = res.data.city
          this.form.community = res.data.community
        })
        .catch(() => {
          this.$notify({
            title: '连接至服务器失败',
            type: 'error'
          })
        })
    }
  },
  mounted() {
    this.getInfo()
  }
}
</script>