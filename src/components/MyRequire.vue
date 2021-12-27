<template>
  <el-card v-for="id in requireIDList" class="my-card" :key="id">
    <template #header>
      <div class="card-header">
        <span><el-tag style="margin-right: 0.5rem;">{{ requireDetail[id].type }}</el-tag>{{ requireDetail[id].topic }}</span>
        <span>
          <el-button type="success" round size="small" @click="loadResponse(id); this.lookResponseDialogVisible = true">查看响应</el-button>
          <el-button type="warning" round size="small" @click="edit(id)">编辑</el-button>
          <el-popconfirm title="确定删除该请求吗？" @confirm="del(id)" confirmButtonText="是" cancelButtonText="否">
            <template #reference>
              <el-button type="danger" round size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </span>
      </div>
    </template>
    <div>{{ requireDetail[id].description }}</div>
    <el-row justify="space-between" class="secondary">
      <span>状态：{{ state2str[requireDetail[id].state] }}</span>
      <span>发起时间：{{ requireDetail[id].time }}</span>
      <span>请求人数：{{ requireDetail[id].number }}</span>
    </el-row>
  </el-card>

  <el-dialog v-model="editRequireDialogVisible" title="修改请求" width="30rem">
    <el-form label-width="5rem">
      <el-form-item label="请求类型">
        <el-select v-model="editRequireForm.type" style="width: 100%;">
          <el-option label="小时工" value="小时工"></el-option>
          <el-option label="搬重物" value="搬重物"></el-option>
          <el-option label="上下班搭车" value="上下班搭车"></el-option>
          <el-option label="社区服务自愿者" value="社区服务自愿者"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主题">
        <el-input v-model="editRequireForm.topic"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="editRequireForm.description"></el-input>
      </el-form-item>
      <!-- TODO: 附件 -->
      <el-form-item label="请求人数">
        <el-input v-model="editRequireForm.number" type="number"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editRequireDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">提交修改</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="lookResponseDialogVisible" title="全部响应" width="50rem">
    <el-table :data="responseList" style="width: 100%">
      <el-table-column prop="time" label="时间" />
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="description" label="留言" />
      <el-table-column label="是否接受" align="center">
        <template #default="scope">
          <el-button style="width: 3rem; text-align: center;" size="mini" type="success" @click="procResponse(scope.row.response_ID, true)"><font-awesome-icon icon="check" /></el-button>
          <el-button style="width: 3rem; text-align: center;" size="mini" type="danger" @click="procResponse(scope.row.response_ID, false)"><font-awesome-icon icon="times" /></el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="lookResponseDialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'MyRequire',
  props: {
    username: String,
    userID: String
  },
  data() {
    return {
      editRequireDialogVisible: false,
      lookResponseDialogVisible: false,
      editRequireForm: {
        'require_ID': '',
        'type': '',
        'topic': '',
        'description': '',
        'doc': null,
        'number': 0
      },
      state2str: {
        0: '已完成',
        1: '待响应',
        2: '已取消',
        3: '到期未完成'
      },
      requireIDList: [],
      requireDetail: {},
      responseList: []
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
      this.$axios.get('/api/user/require_check', {
        params: {
          user_ID: this.userID
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
    },
    edit(require_ID) {
      this.editRequireForm.require_ID = require_ID
      this.editRequireForm.type = this.requireDetail[require_ID].type
      this.editRequireForm.topic = this.requireDetail[require_ID].topic
      this.editRequireForm.description = this.requireDetail[require_ID].description
      this.editRequireForm.doc = this.requireDetail[require_ID].doc
      this.editRequireForm.number = this.requireDetail[require_ID].number
      this.editRequireDialogVisible = true
    },
    submitEdit() {
      this.$axios.post('/api/user/require_check/require_change', {
        require_ID: this.editRequireForm.require_ID,
        type: this.editRequireForm.type,
        topic: this.editRequireForm.topic,
        description: this.editRequireForm.description,
        time: this.formatDate()
      })
        .then((res) => {
          if (res.data.success) {
            this.$notify({
              title: '编辑成功',
              type: 'success'
            })
            this.editRequireDialogVisible = false
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
    del(require_ID) {
      this.$axios.post('/api/user/require_check/require_delete', {
        require_ID: require_ID,
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
    },
    loadResponse(require_ID) {
      this.$axios.get('/api/user/require_check/response_check', {
        params: {
          require_ID: require_ID
        }
      })
        .then((res) => {
          this.responseList = res.data
        })
        .catch(() => {
          this.$notify({
            title: '连接至服务器失败',
            type: 'error'
          })
        })
    },
    procResponse(response_ID, accept) {
      this.$axios.post('/api/user/require_check/response_confirm', {
        response_ID: response_ID,
        accept: accept
      })
        .then((res) => {
          if (res.data.success) {
            this.$notify({
              title: '操作成功',
              type: 'success'
            })
          } else {
            this.$notify({
              title: '操作失败',
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
