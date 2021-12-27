<template>
  <el-container style="height: 100%;">
    <el-header style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);">
      <el-row justify="space-between" style="margin: 0 1rem;">
        <span style="font-size: 1.5rem;">
          <router-link to="/" style="color: unset; text-decoration: unset;">
            <font-awesome-icon icon="comments" style="margin-right: 0.5rem;" />
            好社区
          </router-link>
          <span id="nav" v-if="username">
            <div :class="{ active: isActive('/explore') }" style="left: 14rem;">
              <router-link to="/explore">探索</router-link>
            </div>
            <div :class="{ active: isActive('/my') }" style="left: 20rem;">
              <router-link to="/my">我的</router-link>
            </div>
            <div :class="{ active: isActive('/account') }" style="left: 26rem;">
              <router-link to="/account">账户信息</router-link>
            </div>
            <div :class="{ active: isActive('/stat') }" style="left: 32rem;" v-if="isAdmin">
              <router-link to="/stat">统计信息</router-link>
            </div>
          </span>
        </span>
        <span v-if="username">
          <span style="cursor: default; margin-right: 1rem;">{{ username }}</span>
          <font-awesome-icon icon="sign-out-alt" @click="logOut" style="cursor: pointer;" />
        </span>
      </el-row>
    </el-header>
    <el-main>
      <router-view v-model:username="username" v-model:userID="userID" v-model:isAdmin="isAdmin"></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      username: null,
      userID: null,
      isAdmin: null
    }
  },
  mounted() {
    this.username = sessionStorage.getItem('username')
    this.userID = sessionStorage.getItem('userID')
    this.isAdmin = JSON.parse(sessionStorage.getItem('isAdmin'))
  },
  methods: {
    logOut() {
      sessionStorage.removeItem('username')
      sessionStorage.removeItem('userID')
      sessionStorage.removeItem('isAdmin')
      this.$notify({
        title: '登出成功',
        type: 'success'
      })
      this.username = null
      this.userID = null
      this.isAdmin = null
      this.$router.replace('/login')
    },

    isActive(path) {
      return this.$route.path == path
    }
  }
}
</script>

<style>
html {
  height: 100%;
}

body {
  margin: 0;
  background-color: #e9eef3;
  height: 100%;
}

#app {
  height: 100%;
}

.el-header {
  background-color: #303F9F;
  color: #FFFFFF;
  height: 3.5rem;
  line-height: 3.5rem;
  position: fixed;
  top: 0;
  width: 100%;
}

.el-main {
  margin-top: 3.5rem;
  padding: 0;
}

.el-notification {
  margin-top: 3.5rem;
}

#nav {
  font-size: 1.1rem;
  margin-left: 4rem;
}

#nav div {
  display: inline-block;
  height: 3.5rem;
  width: 6rem;
  text-align: center;
  position: fixed;
  top: 0;
}

#nav a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: unset;
}

#nav .active {
  background-color: rgba(0, 0, 0, 0.2);
  border-bottom: solid #ffa726;
  box-sizing: border-box;
}

#nav .active a {
  color: rgba(255, 255, 255, 1);
}
</style>
