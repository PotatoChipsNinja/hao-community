<template>
  <el-row justify="center" style="padding-top: 1rem;">
    <el-col :span="20">
      <el-row style="margin: 0.5rem;">
        <el-select v-model="filter.type" style="width: 10rem;">
          <el-option label="全部类型" value="全部类型"></el-option>
          <el-option label="小时工" value="小时工"></el-option>
          <el-option label="搬重物" value="搬重物"></el-option>
          <el-option label="上下班搭车" value="上下班搭车"></el-option>
          <el-option label="社区服务自愿者" value="社区服务自愿者"></el-option>
        </el-select>

        <el-input v-model="filter.keyword" placeholder="主题搜索" style="width: 20rem; margin-left: 1rem;">
          <template #prefix>
            <font-awesome-icon icon="search" style="height: 100%; margin-left: 0.3rem" />
          </template>
        </el-input>
      </el-row>

      <el-card v-for="item in filtered" class="explore-card" :key="item.require_ID">
        <template #header>
          <div class="card-header">
            <span><el-tag style="margin-right: 0.5rem;">{{ item.type }}</el-tag>{{ item.topic }}</span>
            <el-button type="warning" round size="small" @click="responseInfo.require_ID = item.require_ID; responseDialogVisible = true">我可以</el-button>
          </div>
        </template>
        <div>{{ item.description }}</div>
        <el-row justify="space-between" class="secondary">
          <span>修改时间：{{ item.time }}</span>
          <span>请求人数：{{ item.number }}</span>
        </el-row>
      </el-card>
    </el-col>
  </el-row>

  <el-dialog v-model="postDialogVisible" title="发布请求" width="30rem">
    <el-form label-width="5rem">
      <el-form-item label="请求类型">
        <el-select v-model="form.type" style="width: 100%;">
          <el-option label="小时工" value="小时工"></el-option>
          <el-option label="搬重物" value="搬重物"></el-option>
          <el-option label="上下班搭车" value="上下班搭车"></el-option>
          <el-option label="社区服务自愿者" value="社区服务自愿者"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主题">
        <el-input v-model="form.topic"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <!-- TODO: 附件 -->
      <el-form-item label="请求人数">
        <el-input v-model="form.number" type="number"></el-input>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="form.end_time" type="datetime" style="width: 100%;">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="postDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="post">发布</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="responseDialogVisible" title="响应请求" width="30rem">
    <el-input v-model="responseInfo.response" placeholder="留言" :rows="2" type="textarea"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="responseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="response">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <div id="refresh" @click="load">
    <font-awesome-icon icon="sync-alt" />
  </div>
  <div id="post" @click="postDialogVisible = true">
    <font-awesome-icon icon="plus" />
  </div>
</template>

<script>
export default {
  name: 'Explore',
  props: {
    username: String,
    userID: String,
    isAdmin: Boolean
  },
  data() {
    return {
      postDialogVisible: false,
      responseDialogVisible: false,
      responseInfo: {
        require_ID: '',
        response: ''
      },
      filter: {
        type: '全部类型',
        keyword: ''
      },
      form: {
        type: '小时工',
        topic: '',
        description: '',
        doc: null,
        number: 1,
        end_time: null
      },
      requireIDList: [],
      requireDetail: {}
    }
  },
  computed: {
    data() {
      let ans = []
      for (let index = 0; index < this.requireIDList.length; index++) {
        ans.push({
          'require_ID': this.requireIDList[index],
          'type': this.requireDetail[this.requireIDList[index]].type,
          'topic': this.requireDetail[this.requireIDList[index]].topic,
          'description': this.requireDetail[this.requireIDList[index]].description,
          'number': this.requireDetail[this.requireIDList[index]].number,
          'time': this.requireDetail[this.requireIDList[index]].time
        })
      }
      return ans
    },
    filtered() {
      return this.data.filter(item => ((this.filter.type == '全部类型' || item.type == this.filter.type) && item.topic.search(this.filter.keyword) != -1))
    }
  },
  methods: {
    formatDate(date) {
      let yyyy = date.getFullYear().toString()
      let MM = (date.getMonth() + 1).toString()
      let dd = date.getDate().toString()
      return yyyy + '-' + MM + '-' + dd
    },
    load() {
      this.$axios.get('/api/user/check', {
        params: {
          user_ID: this.userID
        }
      })
        .then((res) => {
          let community = res.data.community
          this.$axios.get('/api/user/require', {
            params: {
              community: community
            }
          })
            .then((res) => {
              this.requireIDList = res.data
              this.requireDetail = {}
              this.requireIDList.forEach(requireID => {
                this.requireDetail[requireID] = {
                  'type': '',
                  'topic': '',
                  'description': '',
                  'number': 0,
                  'time': ''
                }
              })
              this.loadDetail()
            })
            .catch(() => {
              this.$notify({
                title: '连接至服务器失败',
                type: 'error'
              })
            })
        })
        .catch(() => {
          this.$notify({
            title: '连接至服务器失败',
            type: 'error'
          })
        })
    },
    loadDetail() {
      this.requireIDList.forEach(requireID => {
        this.$axios.get('/api/user/require_check/details', {
          params: {
            require_ID: requireID
          }
        })
          .then((res) => {
            this.requireDetail[requireID] = {
              'type': res.data.type,
              'topic': res.data.topic,
              'description': res.data.description,
              'number': res.data.number,
              'time': res.data.time
            }
          })
          .catch(() => {
            this.$notify({
              title: '连接至服务器失败',
              type: 'error'
            })
          })
      })
    },
    post() {
      this.$axios.post('/api/user/require', {
        user_ID: this.userID,
        type: this.form.type,
        topic: this.form.topic,
        description: this.form.description,
        number: this.form.number,
        end_time: this.formatDate(this.form.end_time),
        time: this.formatDate(new Date())
      })
        .then((res) => {
          if (res.data.success) {
            this.$notify({
              title: '发布成功',
              type: 'success'
            })
            this.postDialogVisible = false
            this.load()
          } else {
            this.$notify({
              title: '发布失败',
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
    response() {
      this.$axios.post('/api/user/response', {
        user_ID: this.userID,
        require_ID: this.responseInfo.require_ID,
        description: this.responseInfo.response,
        time: this.formatDate(new Date())
      })
        .then((res) => {
          if (res.data.success) {
            this.responseDialogVisible = false
            this.load()
          } else {
            this.$notify({
              title: '发布失败',
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
    }
  },
  mounted() {
    this.load()
  }
}
</script>

<style>
.explore-card {
  display: inline-block;
  width: 30rem;
  margin: 0.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.el-card__header {
  padding: 0 1rem;
}

.el-card__body {
  padding-bottom: 0.6rem;
}

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

#post {
  position: fixed;
  bottom: 7.2rem;
  right: 3rem;
  height: 3.5rem;
  width: 3.5rem;
  background-color: #1B5E20;
  border-radius: 3rem;
  text-align: center;
  line-height: 3.5rem;
  cursor: pointer;
  color: #fff;
  font-size: 1.2rem;
}

#post:hover {
  background-color: #388E3C;
}

.secondary {
  color: #757575;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
