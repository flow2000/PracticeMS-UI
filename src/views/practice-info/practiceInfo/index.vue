<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="实习地点" prop="locationName">
        <el-input
          v-model="queryParams.locationName"
          placeholder="请输入地点名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="岗位名称" prop="postName">
        <el-input
          v-model="queryParams.postName"
          placeholder="请输入岗位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实习人数" prop="number">
        <el-input
          v-model="queryParams.number"
          placeholder="请输入实习人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
	  <el-form-item label="指导老师" prop="teacherName">
	    <el-input
	      v-model="queryParams.teacherName"
	      placeholder="请输入指导老师姓名"
	      clearable
	      size="small"
	      @keyup.enter.native="handleQuery"
	    />
	  </el-form-item>
      <el-form-item label="进点时间" prop="entryTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.entryTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择进点时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="启用" value="0" />
		  <el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['practice-info:practiceInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['practice-info:practiceInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['practice-info:practiceInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
		  :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['practice-info:practiceInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="practiceInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="25" align="center" />
      <el-table-column label="实习信息ID" align="center" prop="infoId" v-if="1 == 2"/>
      <el-table-column label="实习地点" align="center" prop="baseInfo.baseName" />
      <el-table-column label="岗位名称" align="center" prop="postName" />
      <el-table-column label="实习人数" align="center" prop="number" />
	    <el-table-column label="岗位余量" align="center" prop="surplus" />
      <el-table-column label="起始时间" align="center" prop="entryTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.entryTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endingTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endingTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="60">
        <template scope="scope" >
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"

            @change="changeStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="指导老师" align="center" prop="teacher.nickName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-grid"
            @click="handleAllocation(scope.row)"
          >分配</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <!-- 添加或修改实习信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="实习基地" prop="locationId">
          <el-select v-model="form.locationId" filterable placeholder="请选择">
            <el-option
              v-for="baseInfo in baseInfos"
              :key="parseInt(baseInfo.value)"
              :label="baseInfo.label"
              :value="parseInt(baseInfo.value)">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="实习学生" prop="studentIds" v-if="this.title =='实习分配'">
          <el-input v-if="this.studentIds != null" :value="'已选择 ' + this.studentIds.length + ' 名学生'" placeholder="请输入实习学生" />
          <el-input v-else :value="'未选择学生'" placeholder="请输入实习学生" />
          <el-button type="text" @click="openStudentSelect()">选择实习学生</el-button>
          <el-dialog
              title="选择实习学生"
              :visible.sync="dialogVisible"
              v-if="dialogVisible"
              width="80%"
              height="80%"
              :append-to-body='true'
              style="height:100%"
              :before-close="handleClose">
            <div class="app-container">
              <el-row :gutter="20">
                <!--院校数据-->
                <el-col :span="4" :xs="24">
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
                <el-col :span="20" :xs="24">
                  <el-form :model="queryParams" ref="studentQueryForm" :inline="true" v-show="showSearch" label-width="68px">
                    <el-form-item label="用户名称" prop="userName">
                      <el-input
                        v-model="queryParams.userName"
                        placeholder="请输入用户名称"
                        clearable
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phonenumber">
                      <el-input
                        v-model="queryParams.phonenumber"
                        placeholder="请输入手机号码"
                        clearable
                        size="small"
                        style="width: 240px"
                        @keyup.enter.native="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="创建时间" prop="createTime">
                      <el-date-picker
                        v-model="dateRange"
                        size="small"
                        style="width: 240px"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleUserQuery">搜索</el-button>
                      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                  </el-form>

                  <el-table ref="table" v-loading="loading" :row-key="getRowKey" :data="userList" @selection-change="handleUserSelectionChange">
                    <el-table-column type="selection" width="50" align="center" :reserve-selection="true" />
                    <el-table-column label="序号" type="index" width="50"></el-table-column>
                    <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
                    <el-table-column label="学号" align="center" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
                    <el-table-column label="姓名" align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" />
                    <el-table-column label="专业" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible" :show-overflow-tooltip="true" />
                    <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible" width="120" />
                    <el-table-column label="状态" align="center" prop="status" width="60" v-if="columns[5].visible" :show-overflow-tooltip="true">
                      <template scope="scope" >
                        <el-switch
                          v-model="scope.row.status"
                          active-value="0"
                          inactive-value="1"
                          @change="changeStatus(scope.row)"
                        >
                        </el-switch>
                      </template>
                    </el-table-column>
                    <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
                      <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                      </template>
                    </el-table-column>
                  </el-table>

                  <div style="padding: 10px;">已选择 {{this.studentIds.length}} 名学生</div>

                  <pagination
                    v-show="utotal>0"
                    :total="utotal"
                    :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize"
                    @pagination="getUserList"
                  />
                </el-col>
              </el-row>

            </div>
                    <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmStudent()">确 定</el-button>
          </span>
          </el-dialog>
        </el-form-item>

        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="实习人数" v-if="this.title == '实习分配'" prop="number">
          <el-input v-model="form.number" :disabled="true" placeholder="请输入实习人数" />
        </el-form-item>
		<el-form-item label="岗位余量" v-if="false" prop="surplus">
		  <el-input v-model="form.surplus" :disabled="true" />
		</el-form-item>
    <el-form-item label="起始时间" prop="entryTime" >
      <el-date-picker clearable size="small"
        v-model="form.entryTime"
        type="date"
        @blur="setEndingTime"
        value-format="yyyy-MM-dd"
        placeholder="选择起始时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="结束时间" prop="entryTime" >
      <el-date-picker clearable size="small"
        v-model="form.endingTime"
        :disabled="true"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择结束时间">
      </el-date-picker>
    </el-form-item>
		<el-form-item label="指导老师" prop="teacherId" v-if="this.title =='修改实习信息'">
		  <el-select v-model="form.teacherId" filterable placeholder="请选择">
		      <el-option
		        v-for="teacher in teachers"
		        :key="parseInt(teacher.value)"
		        :label="teacher.label"
		        :value="parseInt(teacher.value)">
		      </el-option>
		    </el-select>
		</el-form-item>

    <el-form-item label="状态" v-if="this.title =='修改实习信息'" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio label="0">启用</el-radio>
        <el-radio label="1">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="this.title == '实习分配'" type="primary" @click="submitAllocation">确 定</el-button>
        <el-button v-else type="primary" @click="submitForm">确 定</el-button>
        <el-button v-if="this.title =='修改实习信息'" @click="updateCancel">取 消</el-button>
        <el-button v-else @click="allocationCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPracticeInfo, changeStatus , getPracticeInfo, delPracticeInfo,listUserInfoByRole, addPracticeInfo, updatePracticeInfo, exportPracticeInfo } from "@/api/practice-info/practiceInfo";
import { listUser , getNoPracticeUser } from "@/api/system/user";
import { getBaseTude } from '@/api/system/baseInfo'
import { treeselect } from "@/api/system/dept";
import Treeselect from '@riophae/vue-treeselect'
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "PracticeInfo",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      //学生选中数组
      studentIds : [],
      //记录应回显的学生
      studentIds_h : [],
      //已经选择的id组成的数组
      hasSelectList:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
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
      // 院校树选项
      deptOptions: undefined,
      // 用户表格数据
      userList: null,
      // 总条数
      total: 0,
	  //指导老师数
	  ttotal : 0 ,
      //实习基地数
      btotal : 0 ,
      //实习学生数量
      utotal : 0 ,
      // 实习信息表格数据
      practiceInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 实习人数字典
      numberOptions: [],
      //指导老师
      teachers : [],
      //实习学生
      students : [],
      //实习基地
      baseInfos : [],
        value: '',
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: false },
        { key: 1, label: `学号`, visible: true },
        { key: 2, label: `姓名`, visible: true },
        { key: 3, label: `专业`, visible: false },
        { key: 4, label: `手机号码`, visible: false },
        { key: 5, label: `状态`, visible: false },
        { key: 6, label: `创建时间`, visible: false }
      ],
      // 查询参数
        queryParams: {
        pageNum: 1,
        pageSize: 10,
        locationId: null,
        postName: null,
        number: null,
		    surplus: null,
        entryTime: null,
          endingTime: null,
        status: null,
        teacherId: null,
          baseId : null ,
		    locationName : null,
		    teacherName : null
	  },
      statusChangeParams:{
        infoId:null,
        status:null
      },
	  userQueryParams : {
		  roleName : null
	  },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        locationId: [
          { required: true, message: "地点ID不能为空", trigger: "blur" }
        ],
        postName: [
          { required: true, message: "岗位名称不能为空", trigger: "blur" }
        ],
        entryTime: [
          { required: true, message: "起始时间不能为空", trigger: "blur" }
        ],
        baseId: [
          { required: true, message: "实习基地不能为空", trigger: "change" }
        ],
        studentId: [
          { required: true, message: "实习学生不能为空", trigger: "change" }
        ]
      },
      dialogVisible: false,
    }
  },
  watch: {
    // 根据名称筛选院校树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.initUser();
    this.$nextTick(function () {
      this.getTeacherList();
      this.getBaseInfos();
    })
    this.getDicts("sys_show_hide").then(response => {
      this.numberOptions = response.data;
    });
  },
  methods: {
    getList() {
      this.loading = true;
      listPracticeInfo(this.queryParams).then(response => {
        this.practiceInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询用户列表 */
    getUserList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows;
          console.log(this.userList)
          this.utotal = response.total;
          this.loading = false;
        }
      )
    },
    /** 状态改变操作 */
    changeStatus(row) {
      console.log(row)
      let that = this
      let text = row.status ==="0" ? "有效" : "无效";
      this.$confirm('是否将ID为 '+row.infoId+' 的实习信息状态改为'+text,"状态变更",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(function () {
        console.log(row)
        that.statusChangeParams.infoId = row.infoId
        that.statusChangeParams.status = row.status
        return changeStatus(that.statusChangeParams)
      }).then(()=>{
        this.msgSuccess("修改成功");
      }).catch(function () {
        row.status = row.status==="0"?"1":"0";
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    checked(){
      //首先el-table添加ref="table"引用标识
      if(this.userList == null || this.studentIds_h == null) return;
      this.userList.forEach((row) => {
        this.studentIds_h.forEach((item) => {
          if(row.userId == item){
            this.$refs.table.toggleRowSelection(row,true);
          }
        })
      });
    },
    confirmStudent(){
      this.dialogVisible = false;
      this.form.number = this.studentIds.length;
      this.studentIds_h = this.studentIds
    },
    setEndingTime(){
      let entry_date = new Date(this.form.entryTime)
      this.form.endingTime = new Date(entry_date.setDate(entry_date.getDate() + 60))
    },
    initUser(){
      this.getUserList();
      this.getTreeselect();
      this.getDicts("sys_normal_disable").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("sys_user_sex").then(response => {
        this.sexOptions = response.data;
      });
      this.getConfigKey("sys.user.initPassword").then(response => {
        this.initPassword = response.msg;
      });
    },
    openStudentSelect(){
      this.dialogVisible = true
      this.$nextTick(() => {
        this.checked()
      })
    },
    /** 查询院校下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    getRowKey (row) {
      return row.userId
    },
    getTeacherList() {
      this.loading = true;
      this.userQueryParams.roleName = 'teacher'
      listUserInfoByRole(this.userQueryParams).then(response => {
        this.teachers = response.rows;
        this.ttotal = response.total;
      var param = '[{'+'"value" : "'+response.rows[0].userId+'","label" : "' + response.rows[0].nickName + '"}'
      for(var i = 1 ; i < this.ttotal ; i++){
        param += ',{'+'"value" : "'+response.rows[i].userId+'","label" : "' + response.rows[i].nickName + '"}'
      }
      param += ']'
      var dataMap = JSON.parse(param);  //这是一个json数组 ，原数组
      var optionArr = [];  //定义一个数组用来存放
      optionArr.push(dataMap)
      this.teachers = optionArr[0]
        this.loading = false;
      });
    },
    getBaseInfos() {
      this.loading = true;
      getBaseTude().then(response => {
        this.baseInfos = response.data
        this.btotal = response.data.length
        var param = '[{'+'"value" : "'+ this.baseInfos[0].baseId+'","label" : "' + this.baseInfos[0].baseName + '"}'
        for(var i = 1 ; i < this.btotal ; i++){
          param += ',{'+'"value" : "'+this.baseInfos[i].baseId+'","label" : "' + this.baseInfos[i].baseName + '"}'
        }
        param += ']'
        var dataMap = JSON.parse(param);  //这是一个json数组 ，原数组
        var optionArr = [];  //定义一个数组用来存放
        optionArr.push(dataMap)
        this.baseInfos = optionArr[0]
        this.loading = false;
      });
    },
    getStudents() {
      this.loading = true;
      this.userQueryParams.roleName = 'student'
      listUserInfoByRole(this.userQueryParams).then(response => {
        this.teachers = response.rows;
        this.ttotal = response.total;
        var param = '[{'+'"value" : "'+response.rows[0].userId+'","label" : "' + response.rows[0].nickName + ' : '+ response.rows[0].userName + '"}'
        for(var i = 1 ; i < this.ttotal ; i++){
          param += ',{'+'"value" : "'+response.rows[i].userId+'","label" : "' + response.rows[i].nickName + ' : '+ response.rows[i].userName + '"}'
        }
        param += ']'
        var dataMap = JSON.parse(param);  //这是一个json数组 ，原数组
        var optionArr = [];  //定义一个数组用来存放
        optionArr.push(dataMap)
        this.students = optionArr[0]
        this.loading = false;
      });
    },
    // 实习人数字典翻译
    numberFormat(row, column) {
      return this.selectDictLabel(this.numberOptions, row.number);
    },
    // 取消按钮
    updateCancel() {
      this.open = false;
      this.updateReset();
    },
    // 取消按钮
    allocationCancel() {
      this.open = false;
      this.allocationReset();
    },
    // 表单重置
    updateReset() {
      this.form = {
        baseId: null,
        postName: null,
        number: null,
		    surplus: null,
        entryTime: null,
        endingTime: null,
        status: "0",
        teacherId: null
      };
      this.resetForm("form");
    },
    // 表单重置
    allocationReset() {
      this.form = {
        baseId: null,
        postName: null,
        number: null,
        surplus: null,
        entryTime: null,
        endingTime:null,
        status: "0",
        teacherId: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 用户搜索按钮操作 */
    handleUserQuery() {
      this.queryParams.pageNum = 1;
      this.getUserList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.infoId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.allocationReset();
      this.open = true;
      this.title = "添加实习信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.updateReset();
      const infoId = row.infoId || this.ids
      getPracticeInfo(infoId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改实习信息";
      });
    },
    /** 分配按钮操作 */
    handleAllocation(row) {
      this.allocationReset();
      const infoId = row.infoId || this.ids
      this.open = true;
      this.$nextTick(function () {
        getPracticeInfo(infoId).then(response => {
          this.form = response.data;
          console.log(this.form)
          this.studentIds = this.form.studentsId;
          this.studentIds_h = this.form.studentsId
          this.title = "实习分配";
          this.form.surplus = this.form.number - this.studentIds.length;
        });
      })
    },
    submitAllocation(){
      this.form.studentIds = this.studentIds
      this.form.stuStrings = this.studentIds.join(',')
      this.form.teacherId = null
      if (this.form.infoId != null) {
        updatePracticeInfo(this.form).then(response => {
          this.msgSuccess("分配成功");
          this.open = false;
          this.getList();
        });
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.infoId != null) {
            updatePracticeInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPracticeInfo(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const infoIds = row.infoId || this.ids;
      this.$confirm('是否确认删除实习信息编号为"' + infoIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPracticeInfo(infoIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getUserList();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有实习信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportPracticeInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    },
    // 多选框选中数据
    handleUserSelectionChange(selection) {
      this.studentIds = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
  }
};
</script>

