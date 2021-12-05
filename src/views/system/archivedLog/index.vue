<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="this.hamburgerParam.academyW" :xs="24">
        <div class="head-container">
          <el-form>
            <el-form-item prop="role">
              <el-select
                v-model="queryParams.year"
                placeholder="归档年份"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="dict in archivedYears"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                  @click.native="handleYearClick(dict.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="this.hamburgerParam.mainW" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <transition>
            <el-button v-on:click="foldContoller()" class="foldBt" :class="this.foldOpen?'el-icon-s-fold' : 'el-icon-s-unfold'"></el-button>
          </transition>
          <el-form-item label="姓名" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入姓名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="时间" prop="time">
            <el-date-picker clearable size="small"
                            v-model="queryParams.time"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">

          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              :loading="exportLoading"
              @click="handleExport"
              v-hasPermi="['practicelog:practicelog:export']"
            >导出
            </el-button>
          </el-col>


          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="practicelogList" border>

          <el-table-column label="学号" align="center" prop="userName" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.userName">
                <el-popover
                  v-if="scope.row.userName.length > 12"
                  placement="top"
                  trigger="hover"
                >
                  <span>{{scope.row.userName}}</span>
                  <span slot="reference" style="curosr:pointer">{{scope.row.userName.slice(0,12)+'...'}}</span>
                </el-popover>
                <div v-else>{{scope.row.userName}}</div>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center" prop="user.nickName" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.user.nickName">
                <el-popover
                  v-if="scope.row.user.nickName.length > 9"
                  placement="top"
                  trigger="hover"
                >
                  <span>{{scope.row.user.nickName}}</span>
                  <span slot="reference" style="curosr:pointer">{{scope.row.user.nickName.slice(0,9)+'...'}}</span>
                </el-popover>
                <div v-else>{{scope.row.user.nickName}}</div>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="time" width="120">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="日志内容" prop="logContents" align="left">
            <template slot-scope="scope">
              <div v-if="scope.row.logContents">
                <el-popover
                  v-if="scope.row.logContents.length > 40"
                  placement="top"
                  trigger="hover"
                >
                  <span>{{scope.row.logContents}}</span>
                  <span slot="reference" style="curosr:pointer">{{scope.row.logContents.slice(0,40)+'...'}}</span>
                </el-popover>
                <div v-else>{{scope.row.logContents}}</div>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="small "
                type="primary"
                icon="el-icon-edit"
                @click="handleDetail(scope.row)"
                v-hasPermi="['practicelog:practicelog:edit']"
              >日志详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!--    详细-->
        <el-dialog :title="title" :visible.sync="detailOpen" width="500px" append-to-body>
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">

            <el-form-item label="目前时间" prop="time">
              <el-date-picker clearable size="small"
                              v-model="selectTime"
                              :disabled="true"
                              type="date"
                              placeholder="选择时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="日志内容" prop="logContents">
              <el-input v-model="form.logContents"
                        type="textarea"
                        :disabled="true"
                        placeholder="请输入内容"
                        :rows="5"
              />
            </el-form-item>

          </el-form>

        </el-dialog>


      </el-col>

    </el-row>


  </div>
</template>

<script>
  import {
    archivedList,
    exportArchivedPracticelog,
    getPracticelog,
    delPracticelog,
    addPracticelog,
    updatePracticelog,
    exportPracticelog
  } from '@/api/practicelog/practicelog'
  import {
    listPracticeScore,
  } from '@/api/practice-score/practiceScore'
  import { getUserProfile } from '@/api/system/user'
  import { getToken, getInfo } from '@/utils/auth'
  import { Loading } from 'element-ui'

  export default {
    name: 'Practicelog',
    data() {
      return {
        hamburgerParam: {
          academyW: 0,
          mainW: 24
        },
        // 归档数据年份选项
        archivedYears: [],

        edit: true,
        disabledMore: true,
        //实习鉴定窗口是否可见
        appraisalVisible: false,
        //实习鉴定窗口是否可见
        summeryVisible: false,
        //用户的信息
        user: {},
        //权限组
        roleGroup: {},
        // 遮罩层
        loading: true,
        // 导出遮罩层
        exportLoading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 实习日志表格数据
        practicelogList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        //是否弹出详细层
        detailOpen: false,
        // 是否禁止
        disabled: false,
        //折叠状态
        foldOpen : false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userName: null,
          locationName: null,
          time: null,
          logContents: null,
          year: undefined
        },
        upload: {
          // 是否禁用上传
          isUploading: false,
          // 设置上传的请求头部
          headers: {
            Authorization: 'Bearer ' + getToken()
          },
          // 上传的地址
          AppraisalUrl: process.env.VUE_APP_BASE_API + '/common/uploadAppraisal',
          SummaryUrl: process.env.VUE_APP_BASE_API + '/common/uploadSummary',
          // 上传的文件列表
          AppraisalFileList: [],
          SummaryFileList: [],
          //传递文件所需要用到的参数 姓名
          nick_name: '',
          // 学号
          user_id: '',

          //成绩编号
          scoreId: '',
          //用户自己的实习鉴定
          userAppraisal: '',
          //自己的实习总结
          userSummery: ''
        },
        selectTime: '',
        // 表单参数
        form: {
          selectTime: new Date()
        },
        // 表单校验
        rules: {
          userName: [
            { required: true, message: '用户姓名不能为空', trigger: 'blur' }
          ],
          locationName: [
            { required: true, message: '地点信息不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      // this.getList()
      this.initData({})
      this.getDicts('sys_archived_year').then(response => {
        this.archivedYears = response.data
        this.queryParams.year = response.data[0].dictValue
        this.getList()
      })
      getUserProfile().then(response => {
        this.user = response.data
        this.roleGroup = response.roleGroup
        //console.log(this.user);
        //console.log(this.roleGroup);
      })

    },

    methods: {
      async initData(data) {
        //获取当前时间
        var now = new Date()
        var monthn = now.getMonth() + 1
        var yearn = now.getFullYear()
        var dayn = now.getDate()
        this.selectTime = yearn + '-' + monthn + '-' + dayn
      },
      foldContoller() {
        this.foldOpen = !this.foldOpen
        if (this.foldOpen == true) {
          this.hamburgerParam.academyW = 2
          this.hamburgerParam.mainW = 22
        } else {
          this.hamburgerParam.academyW = 0
          this.hamburgerParam.mainW = 24
        }
      },

      /** 查询实习日志列表 */
      getList() {
        this.loading = true
        archivedList(this.queryParams).then(response => {
          this.practicelogList = response.rows
          this.total = response.total
          this.loading = false
        })
      },

      // 表单重置
      reset() {
        this.form = {
          logId: null,
          userName: null,
          nickName: null,
          locationId: null,
          time: null,
          logContents: null,
          delFlag: null
        }
        this.resetForm('form')
      },

      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },


      // 年份单击事件
      handleYearClick(data) {
        this.queryParams.year = data
        this.getList()
      },


      /** 详情按钮 */
      handleDetail(row) {
        const logId = row.logId || this.ids
        getPracticelog(logId).then(response => {
          this.form = response.data
          this.title = '详情'
          this.detailOpen = true
        })
      },

      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有实习日志数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.exportLoading = true
          return exportPracticelog(queryParams)
        }).then(response => {
          this.download(response.msg)
          this.exportLoading = false
        }).catch(() => {
        })
      },



    }
  }
</script>
<style>
  .overClass {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 170px;
  }
</style>
