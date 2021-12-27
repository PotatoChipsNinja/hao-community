<template>
  <el-row justify="center" style="padding-top: 3rem;">
    <el-col :span="18">
      <el-tabs tab-position="left" style="height: 100%;">
        <el-tab-pane label="用户列表">
          <el-table :data="userList" style="width: 100%">
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="ID_type" label="证件类型" />
            <el-table-column prop="ID" label="证件号" />
            <el-table-column prop="phone" label="电话号码" />
            <el-table-column prop="introduction" label="用户简介" />
            <el-table-column prop="city" label="城市" />
            <el-table-column prop="community" label="社区" />
            <el-table-column prop="time" label="注册时间" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="中介费查询">
          <h3 style="margin: 0.5rem;">累计中介费：{{ totalFee }} 元</h3>
          <el-row style="margin: 0.5rem;">
            <el-select v-model="filter.type" style="width: 10rem;">
              <el-option label="全部类型" value="全部类型"></el-option>
              <el-option label="小时工" value="小时工"></el-option>
              <el-option label="搬重物" value="搬重物"></el-option>
              <el-option label="上下班搭车" value="上下班搭车"></el-option>
              <el-option label="社区服务自愿者" value="社区服务自愿者"></el-option>
            </el-select>

            <el-input v-model="filter.city" placeholder="城市" style="width: 6rem; margin-left: 0.5rem;"></el-input>
            <el-input v-model="filter.community" placeholder="社区" style="width: 6rem; margin-left: 0.5rem;"></el-input>
            <el-date-picker
              v-model="filter.range"
              type="datetimerange"
              range-separator="至"
              start-placeholder="起始时间"
              end-placeholder="截止时间"
              style="width: 22.5rem; margin-left: 0.5rem;"
            >
            </el-date-picker>

            <el-button type="primary" style="margin-left: 0.5rem;" @click="queryFee">查询</el-button>
          </el-row>

          <div ref="chart" style="width: 50rem; height: 30rem;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Statistic',
  props: {
    username: String,
    userID: String,
    isAdmin: Boolean
  },
  data() {
    return {
      chart: null,
      filter: {
        type: '全部类型',
        city: '',
        community: '',
        range: null
      },
      userList: [
        {
          'username': 'dwdw',
          'name': 'dw',
          'ID-type': 'www',
          'ID': 'e2',
          'phone': 123,
          'introduction': 'dwdw',
          'city': 'wef',
          'community': 'ddd',
          'time': '23-3-3'
        },
        {
          'username': 'aaa',
          'name': 'dw',
          'ID-type': 'www',
          'ID': 'e2',
          'phone': 123,
          'introduction': 'dwdw',
          'city': 'wef',
          'community': 'ddd',
          'time': '23-3-3'
        }
      ],
      fee: [
        {
          'time': '2020-01',
          'money': 12
        },
        {
          'time': '2020-02',
          'money': 23
        },
        {
          'time': '2020-03',
          'money': 13
        },
        {
          'time': '2020-04',
          'money': 14
        }
      ],
      totalFee: 0
    }
  },
  methods: {
    formatDate(date) {
      let yyyy = date.getFullYear().toString()
      let MM = (date.getMonth() + 1).toString()
      let dd = date.getDate().toString()
      return yyyy + '-' + MM + '-' + dd
    },
    loadUserList() {
      this.$axios.get('/api/admin/check/user', {
        params: {
          admin_ID: this.userID
        }
      })
        .then((res) => {
          this.userList = res.data
        })
        .catch(() => {
          this.$notify({
            title: '连接至服务器失败',
            type: 'error'
          })
        })
    },
    loadTotalFee() {
      this.$axios.get('/api/admin/cost', {
        params: {
          admin_ID: this.userID
        }
      })
        .then((res) => {
          this.totalFee = res.data.money
        })
        .catch(() => {
          this.$notify({
            title: '连接至服务器失败',
            type: 'error'
          })
        })
    },
    queryFee() {
      this.$axios.get('/api/statistics', {
        params: {
          start: this.formatDate(this.filter.range[0]),
          end: this.formatDate(this.filter.range[1]),
          city: this.filter.city,
          community: this.filter.community,
          type: this.filter.type == '全部类型' ? '' : this.filter.type
        }
      })
        .then((res) => {
          this.fee = res.data
          this.chart.setOption({
            xAxis: {
              type: 'category',
              data: this.fee.map(item => item.time)
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: this.fee.map(item => item.money),
                type: 'line'
              }
            ]
          })
        })
        .catch((e) => {
          console.log(e)
          this.$notify({
            title: '连接至服务器失败',
            type: 'error'
          })
        })
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.loadUserList()
    this.loadTotalFee()
  }
}
</script>

<style>
</style>
