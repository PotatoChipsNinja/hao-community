<template>
  <el-card v-for="id in responseIDList" class="my-card" :key="id">
    <template #header>
      <div class="card-header">
        <span><el-tag style="margin-right: 0.5rem;">{{ responseDetail[id].require_ID in requireDetail ? requireDetail[responseDetail[id].require_ID].type : '' }}</el-tag>{{ responseDetail[id].require_ID in requireDetail ? requireDetail[responseDetail[id].require_ID].topic : '' }}</span>
        <span v-if="responseDetail[id].state == 0">
          <el-button type="warning" round size="small" @click="edit(id)">编辑</el-button>
          <el-popconfirm title="确定删除该响应吗？" @confirm="del(id)" confirmButtonText="是" cancelButtonText="否">
            <template #reference>
              <el-button type="danger" round size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </span>
      </div>
    </template>
    <div>{{ responseDetail[id].require_ID in requireDetail ? requireDetail[responseDetail[id].require_ID].description : '' }}</div>
    <el-divider border-style="dashed" content-position="center">我的留言</el-divider>
    <div>{{ responseDetail[id].description }}</div>
    <el-row justify="space-between" class="secondary">
      <span>状态：{{ state2str[responseDetail[id].state] }}</span>
      <span>响应时间：{{ responseDetail[id].time }}</span>
    </el-row>
  </el-card>

  <el-dialog v-model="editResponseDialogVisible" title="编辑留言" width="30rem">
    <el-input v-model="editResponseForm.description" placeholder="留言" :rows="2" type="textarea"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editResponseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'MyResponse',
  props: {
    username: String,
    userID: String
  },
  data() {
    return {
      editResponseDialogVisible: false,
      editResponseForm: {
        'response_ID': '',
        'description': ''
      },
      state2str: {
        0: '待接受',
        1: '接受',
        2: '拒绝',
        3: '取消'
      },
      responseIDList: [],
      responseDetail: {},
      requireDetail: {}
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
    load() {
      this.$axios.get('/api/user/response_check', {
        params: {
          user_ID: this.userID
        }
      })
        .then((res) => {
          this.responseIDList = res.data
          this.responseDetail = {}
          this.responseIDList.forEach(responseID => {
            this.responseDetail[responseID] = {
              'require_ID': '',
              'description': '',
              'time': '',
              'state': 0
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
    },
    loadDetail() {
      this.responseIDList.forEach(responseID => {
        this.$axios.get('/api/user/response_check/details', {
          params: {
            response_ID: responseID
          }
        })
          .then((res) => {
            this.responseDetail[responseID] = {
              'require_ID': res.data.require_ID,
              'description': res.data.description,
              'time': res.data.time,
              'state': res.data.state
            }
            let require_ID = res.data.require_ID
            this.$axios.get('/api/user/require_check/details', {
              params: {
                require_ID: require_ID
              }
            })
              .then((res) => {
                this.requireDetail[require_ID] = {
                  'type': res.data.type,
                  'topic': res.data.topic,
                  'description': res.data.description,
                  'number': res.data.number,
                  'time': res.data.time,
                  'state': res.data.state
                }
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
      })
    },
    edit(response_ID) {
      this.editResponseForm.response_ID = response_ID
      this.editResponseForm.description = this.responseDetail[response_ID].description
      this.editResponseDialogVisible = true
    },
    submitEdit() {
      this.$axios.post('/api/user/response_change', {
        response_ID: this.editResponseForm.response_ID,
        description: this.editResponseForm.description,
        time: this.formatDate()
      })
        .then((res) => {
          if (res.data.success) {
            this.$notify({
              title: '编辑成功',
              type: 'success'
            })
            this.editResponseDialogVisible = false
            this.load()
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
    del(response_ID) {
      this.$axios.post('/api/user/response_delete', {
        response_ID: response_ID,
      })
        .then((res) => {
          if (res.data.success) {
            this.$notify({
              title: '删除成功',
              type: 'success'
            })
            this.load()
          } else {
            this.$notify({
              title: '删除失败',
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
  }
}
</script>

<style>
.my-card {
  display: block;
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

.secondary {
  color: #757575;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
