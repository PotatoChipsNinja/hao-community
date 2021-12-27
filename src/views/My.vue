<template>
  <el-row justify="center" style="padding-top: 3rem;">
    <el-col :span="14">
      <el-tabs tab-position="left" style="height: 100%;" v-model="tab" @tab-click="load">
        <el-tab-pane label="我的请求">
          <MyRequire ref="myRequire" :username="username" :userID="userID" />
        </el-tab-pane>
        <el-tab-pane label="我的响应">
          <MyResponse ref="myResponse" :username="username" :userID="userID" />
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>

  <div id="refresh" @click="load">
    <font-awesome-icon icon="sync-alt" />
  </div>
</template>

<script>
import MyRequire from '../components/MyRequire.vue'
import MyResponse from '../components/MyResponse.vue'

export default {
  name: 'My',
  components: {
    MyRequire,
    MyResponse
  },
  props: {
    username: String,
    userID: String,
    isAdmin: Boolean
  },
  data() {
    return {
      tab: '0'
    }
  },
  methods: {
    load() {
      if (this.tab == '0') {
        this.$refs.myRequire.load()
      } else {
        this.$refs.myResponse.load()
      }
    }
  },
  mounted() {
    this.load()
  }
}
</script>

<style>
#refresh {
  position: fixed;
  bottom: 3rem;
  right: 3rem;
  height: 3.5rem;
  width: 3.5rem;
  background-color: #E65100;
  border-radius: 3rem;
  text-align: center;
  line-height: 3.5rem;
  cursor: pointer;
  color: #fff;
  font-size: 1.2rem;
}

#refresh:hover {
  background-color: #F57C00;
}
</style>
