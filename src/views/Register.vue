<template>
  <el-row justify="center" align="middle" style="height: 100%;">
    <el-col :span="8">
      <el-card>
        <el-row justify="space-between">
          <span id="title">注册</span>
          <span id="helper">已有账号？<router-link to="/login">去登录</router-link></span>
        </el-row>
        
        <el-form style="margin-top: 2rem; padding: 0 0.5rem;">
          <el-form-item :error="errMsg.username">
            <el-input v-model="form.username" placeholder="用户名" @input="clearErr"></el-input>
          </el-form-item>
          <el-form-item :error="errMsg.realname">
            <el-input v-model="form.realname" placeholder="姓名" @input="clearErr"></el-input>
          </el-form-item>
          <el-row justify="space-between">
            <el-form-item :error="errMsg.IDType" style="width: 13.5rem;">
              <el-select v-model="form.IDType" placeholder="证件类型" style="width: 100%;" @change="form.city = ''; errMsg.IDType = ''">
                <el-option label="中华人民共和国居民身份证" value="中华人民共和国居民身份证"></el-option>
                <el-option label="台湾居民往来大陆通行证" value="台湾居民往来大陆通行证"></el-option>
                <el-option label="港澳居民来往内地通行证" value="港澳居民来往内地通行证"></el-option>
                <el-option label="军人证件" value="军人证件"></el-option>
                <el-option label="护照" value="护照"></el-option>
                <el-option label="香港身份证" value="香港身份证"></el-option>
                <el-option label="澳门身份证" value="澳门身份证"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :error="errMsg.IDNum" style="width: calc(98% - 13.5rem);">
              <el-input v-model="form.IDNum" placeholder="证件号" @input="clearErr" @change="inputID"></el-input>
            </el-form-item>
          </el-row>
          <el-row justify="space-between">
            <el-form-item :error="errMsg.password" style="width: 49%;">
              <el-input v-model="form.password" placeholder="密码" show-password @input="clearErr"></el-input>
            </el-form-item>
            <el-form-item :error="errMsg.repeatPassword" style="width: 49%;">
              <el-input v-model="form.repeatPassword" placeholder="重复密码" show-password @input="clearErr"></el-input>
            </el-form-item>
          </el-row>
          <el-form-item :error="errMsg.phone">
            <el-input v-model="form.phone" placeholder="电话" type="number" @input="clearErr"></el-input>
          </el-form-item>
          <el-form-item :error="errMsg.info">
            <el-input v-model="form.info" placeholder="个人简介" :rows="2" type="textarea" @input="clearErr"></el-input>
          </el-form-item>
          <el-row justify="space-between">
            <el-form-item :error="errMsg.city" style="width: 49%;">
              <el-input v-model="form.city" placeholder="城市" @input="clearErr" :disabled="form.IDType == '中华人民共和国居民身份证'"></el-input>
            </el-form-item>
            <el-form-item :error="errMsg.community" style="width: 49%;">
              <el-input v-model="form.community" placeholder="社区" @input="clearErr"></el-input>
            </el-form-item>
          </el-row>
          <el-form-item style="margin-bottom: 0;">
            <el-button type="primary" @click="onSubmit" style="width: 100%;">注册</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { parseID } from '../parseID'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        realname: '',
        IDType: null,
        IDNum: '',
        password: '',
        repeatPassword: '',
        phone: '',
        info: '',
        city: '',
        community: ''
      },
      errMsg: {
        username: '',
        realname: '',
        IDType: '',
        IDNum: '',
        password: '',
        repeatPassword: '',
        phone: '',
        info: '',
        city: '',
        community: ''
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
      if (!this.form.username) {
        this.errMsg.username = '用户名不能为空'
      } else if (!this.form.realname) {
        this.errMsg.realname = '姓名不能为空'
      } else if (!this.form.IDType) {
        this.errMsg.IDType = '请选择证件类型'
      } else if (!this.form.IDNum) {
        this.errMsg.IDNum = '证件号不能为空'
      } else if (!this.form.password) {
        this.errMsg.password = '密码不能为空'
      } else if (this.form.password != this.form.repeatPassword) {
        this.errMsg.repeatPassword = '两次输入的密码不一致'
      } else if (!this.form.phone) {
        this.errMsg.phone = '电话不能为空'
      } else if (this.form.phone.length != 11) {
        this.errMsg.phone = '请输入11位电话号码'
      } else if (!this.form.city) {
        this.errMsg.city = '城市不能为空'
      } else if (!this.form.community) {
        this.errMsg.community = '社区不能为空'
      } else {
        this.$axios.post('/api/user/register', {
          username: this.form.username,
          name: this.form.realname,
          ID_type: this.form.IDType,
          ID: this.form.IDNum,
          password: this.form.password,
          phone: this.form.phone,
          introduction: this.form.info,
          city: this.form.city,
          community: this.form.community,
          time: this.formatDate()
        })
          .then((res) => {
            if (res.data.success) {
              this.$notify({
                title: '注册成功',
                type: 'success'
              })
              this.$router.replace('/login')
            } else {
              this.errMsg.username = '用户名已被占用'
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
      this.errMsg.realname = ''
      this.errMsg.IDType = ''
      this.errMsg.IDNum = ''
      this.errMsg.password = ''
      this.errMsg.repeatPassword = ''
      this.errMsg.phone = ''
      this.errMsg.info = ''
      this.errMsg.city = ''
      this.errMsg.community = ''
    },

    inputID() {
      if (this.form.IDType == '中华人民共和国居民身份证') {
        this.form.city = parseID(this.form.IDNum)
      }
    }
  }
}
</script>

<style>
.el-card {
  padding: 1rem;
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
