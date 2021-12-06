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


        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入院校名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>

      <!--用户数据-->
      <el-col :span="this.hamburgerParam.mainW" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <transition>
            <el-button v-on:click="foldContoller()" class="foldBt" :class="this.foldOpen?'el-icon-s-fold' : 'el-icon-s-unfold'"></el-button>
          </transition>
          <el-form-item label="学号" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入学号"
              clearable
              size="small"
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="姓名" prop="nickName">
            <el-input
              v-model="queryParams.nickName"
              placeholder="请输入姓名"
              clearable
              size="small"
              style="width: 120px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 150px"
              @keyup.enter.native="handleQuery"
            />
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
              v-hasPermi="['system:user:export']"
            >导出
            </el-button>
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" border>
          <el-table-column label="学号" align="center" key="userName" prop="userName" v-if="columns[1].visible"
                           :show-overflow-tooltip="true"/>
          <el-table-column label="姓名" align="center" key="nickName" prop="nickName" v-if="columns[2].visible"
                           :show-overflow-tooltip="true"/>
          <el-table-column label="院系班级" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible"
                           :show-overflow-tooltip="true"/>
          <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible"
                           :show-overflow-tooltip="true"/>

        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import {
    archivedList,
    getUser,
    delUser,
    addUser,
    updateUser,
    exportUser,
    exportArchivedUser,
    resetUserPwd,
    changeUserStatus,
    importTemplate,
    dataArchive
  } from '@/api/system/user'
  import { getToken } from '@/utils/auth'
  import { treeselect } from '@/api/system/dept'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'User',
    components: { Treeselect },
    data() {
      return {
        //数据归档年份
        archiveTime: '',
        // 遮罩层
        loading: true,
        //折叠状态
        foldOpen : false,
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
        // 用户表格数据
        userList: null,
        // 弹出层标题
        title: '',
        // 院校树选项
        deptOptions: undefined,
        // 是否显示弹出层
        open: false,
        // 院校名称
        deptName: undefined,
        // 默认密码
        initPassword: undefined,
        // 日期范围
        dateRange: [],
        // 状态数据字典
        statusOptions: [],
        // 性别状态字典
        sexOptions: [],
        // 岗位选项
        postOptions: [],
        // 角色选项
        roleOptions: [],
        // 归档数据年份选项
        archivedYears: [],
        // 表单参数
        form: {},
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        hamburgerParam : {
          academyW : 0,
          mainW : 24
        },
        // 用户导入参数
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: '',
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: 'Bearer ' + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + '/system/user/importData'
        },
        // 数据归档参数
        archive: {
          // 是否显示弹出层（数据归档）
          open: false,
          // 弹出层标题（数据归档）
          title: '',
          // 请求地址
          url: process.env.VUE_APP_BASE_API + '/system/user/archived'
        },
        // 导出归档数据参数
        export_archive: {
          // 是否显示弹出层（导出归档数据）
          open: false,
          // 弹出层标题（数据归档）
          title: '',
          // 请求地址
          url: process.env.VUE_APP_BASE_API + '/system/user/exportArchived'
        },
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userName: undefined,
          phonenumber: undefined,
          status: undefined,
          deptId: undefined,
          role: '实习学生',
          year: ''
        },
        // 列信息
        columns: [
          { key: 0, label: `用户编号`, visible: true },
          { key: 1, label: `学号`, visible: true },
          { key: 2, label: `姓名`, visible: true },
          { key: 3, label: `专业`, visible: true },
          { key: 4, label: `手机号码`, visible: true },
          { key: 5, label: `账号状态`, visible: true },
          { key: 6, label: `创建时间`, visible: true }
        ],
        // 表单校验
        rules: {
          userName: [
            { required: true, message: '学号不能为空', trigger: 'blur' }
          ],
          nickName: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          deptId: [
            { required: true, message: '归属院系不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 5, max: 20, message: '密码长度必须介于 5 和 20 之间', trigger: 'blur' }
          ],
          email: [
            {
              type: 'email',
              message: '\'请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          phonenumber: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    watch: {
      // 根据名称筛选院校树
      deptName(val) {
        this.$refs.tree.filter(val)
      }
    },
    created() {
      // this.getList()
      this.getTreeselect()
      this.getDicts('sys_normal_disable').then(response => {
        this.statusOptions = response.data
      })
      this.getDicts('sys_user_sex').then(response => {
        this.sexOptions = response.data
      })

      this.getDicts('sys_user_roles').then(response => {
        this.roleOptions = response.data
      })

      this.getDicts('sys_archived_year').then(response => {
        this.archivedYears = response.data
        this.queryParams.year = response.data[0].dictValue
        this.getList()
      })

      this.getConfigKey('sys.user.initPassword').then(response => {
        this.initPassword = response.msg
      })
    },
    methods: {
      /** 查询用户列表 */
      getList() {
        this.loading = true
        archivedList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.userList = response.rows
            this.total = response.total
            this.loading = false
          }
        )
      },
      /** 查询院校下拉树结构 */
      getTreeselect() {
        treeselect().then(response => {
          this.deptOptions = response.data
        })
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.queryParams.deptId = data.id
        this.getList()
      },
      foldContoller(){
        this.foldOpen = !this.foldOpen
        if(this.foldOpen == true){
          this.hamburgerParam.academyW = 4
          this.hamburgerParam.mainW = 20
        }else{
          this.hamburgerParam.academyW = 0
          this.hamburgerParam.mainW = 24
        }
      },
      // 年份单击事件
      handleYearClick(data) {
        this.queryParams.year = data
        this.getList()
      },
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      // 用户状态修改
      handleStatusChange(row) {
        let text = row.status === '0' ? '启用' : '停用'
        this.$confirm('确认要"' + text + '""' + row.userName + '"账号吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return changeUserStatus(row.userId, row.status)
        }).then(() => {
          this.msgSuccess(text + '成功')
        }).catch(function() {
          row.status = row.status === '0' ? '1' : '0'
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          userId: undefined,
          deptId: undefined,
          userName: undefined,
          nickName: undefined,
          password: undefined,
          phonenumber: undefined,
          email: undefined,
          sex: undefined,
          status: '0',
          remark: undefined,
          postIds: [],
          roleIds: []
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
        this.dateRange = []
        this.resetForm('queryForm')
        this.handleQuery()
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出用户数据?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.exportLoading = true
          return exportArchivedUser(queryParams)
        }).then(response => {
          this.download(response.msg)
          this.exportLoading = false
        }).catch(() => {
        })
      },

    }
  }
</script>
