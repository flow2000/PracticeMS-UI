<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学号" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入学号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学生姓名" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入学生姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="arrangementList" @selection-change="handleSelectionChange">
      <el-table-column label="学号" align="center" prop="user.userName"/>
      <el-table-column label="学生姓名" align="center" prop="user.nickName"/>
      <el-table-column label="学生班级" align="center" prop="user.dept.deptName"/>
      <el-table-column label="学生电话" align="center" prop="user.phonenumber"/>
      <el-table-column label="实习单位" align="center" prop="info.baseInfo.companyName"/>
      <el-table-column label="实习岗位" align="center" prop="info.postName"/>
      <el-table-column label="实习单位联系电话" align="center" prop="info.baseInfo.basePhone"/>
      <el-table-column label="最后一次打卡日期" align="center" prop="punchTime"/>
      <el-table-column label="最后一次日志填写" align="center" prop="logTime"/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
  import { stuInfoList } from '@/api/arrangement/arrangement'
  import { getUserProfile } from '../../../api/system/user'
  import { listPunch, getPunch, delPunch, addPunch, updatePunch, exportPunch } from "@/api/punch/punch";
  import { listPracticelog, getPracticelog, delPracticelog, addPracticelog, updatePracticelog, exportPracticelog } from "@/api/practicelog/practicelog";

  export default {
    name: 'Arrangement',
    data() {
      return {
        user: {},
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
        // 实习安排表格数据
        arrangementList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          stuId: null,
          info: null,
          infoId: null,
          notes: null,
          stuOption: null,
          status: null,
          postName: null,
          nickName: null,
          teacherId: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          stuId: [
            { required: true, message: '实习学生ID不能为空', trigger: 'blur' }
          ],
          infoId: [
            { required: true, message: '实习信息ID不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      // 获取当前用户信息
      getUserProfile().then(response => {
        this.user = response.data
        //加载信息表
        this.getList()
      })
    },
    methods: {
      /** 查询实习安排列表 */
      getList() {
        this.loading = true
        this.queryParams.teacherId = this.user.userId
        stuInfoList(this.queryParams).then(response => {
          this.arrangementList = response.rows
          this.total = response.total
          this.loading = false
          console.log(this.arrangementList);
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
          arrangementId: null,
          stuId: null,
          infoId: null,
          notes: null,
          stuOption: null,
          status: '0',
          delFlag: null,
          nickName: null,
          postName: null,
          userName: null
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.arrangementId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      }
    }
  }
</script>
