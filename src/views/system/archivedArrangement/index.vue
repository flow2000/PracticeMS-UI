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
        <!--搜索项-->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <transition>
            <el-button v-on:click="foldContoller()" class="foldBt" :class="this.foldOpen?'el-icon-s-fold' : 'el-icon-s-unfold'"></el-button>
          </transition>
          <el-form-item label="查询字段" prop="searchKey">
            <el-select v-model="queryParams.searchKey" placeholder="请选择查询字段(默认全部)" clearable size="small">
              <el-option label="所有查询字段" value="allKeys" />
              <el-option label="学号" value="userName" />
              <el-option label="姓名" value="nickName" />
              <el-option label="实习状态" value="practiceStatus" />
              <el-option label="实习类型" value="practiceType" />
            </el-select>
          </el-form-item>

          <el-form-item label="查询字符" v-if="this.queryParams.searchKey == 'practiceStatus'" prop="searchValue">
            <el-select v-model="queryParams.searchValue" placeholder="请选择实习状态" clearable size="small">
              <el-option label="审核中" value="1" />
              <el-option label="实习中" value="2" />
              <el-option label="未实习" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="查询字符" v-else-if="this.queryParams.searchKey == 'practiceType'" prop="searchValue">
            <el-select v-model="queryParams.searchValue" placeholder="请选择实习类型" clearable size="small">
              <el-option label="集中实习" value="1" />
              <el-option label="分散实习" value="2" />
              <el-option label="无" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="查询字符" v-else prop="searchValue">
            <el-input
              v-model="queryParams.searchValue"
              placeholder="请输入查询字符"
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

        <el-row :gutter="10" class="mb8">

          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              :loading="exportLoading"
              @click="handleExport"
              v-hasPermi="['arrangement:arrangement:export']"
            >导出</el-button>
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="arrangementList" @selection-change="handleSelectionChange">
          <el-table-column label="实习安排ID" align="center" prop="arrangementId" v-if="false"/>
          <el-table-column label="实习安排ID" align="center" prop="applyId" v-if="false"/>
          <el-table-column label="学号" align="center" >
            <template slot-scope="scope">
              <span v-if="scope.row.user != null">{{ scope.row.user.userName }}</span>
              <span v-if="scope.row.student != null">{{ scope.row.student.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="学生姓名" align="center" prop="user.nickName" >
            <template slot-scope="scope">
              <span v-if="scope.row.user != null">{{ scope.row.user.nickName }}</span>
              <span v-if="scope.row.student != null">{{ scope.row.student.nickName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实习类型" align="center" >
            <template slot-scope="scope">
              <span v-if="scope.row.info != null">集中实习</span>
              <span v-if="scope.row.location != null">分散实习</span>
            </template>
          </el-table-column>
          <el-table-column label="实习状态" align="center" prop="user.nickName" >
            <template slot-scope="scope">
              <span v-if="scope.row.user != null && scope.row.user.status == 0">实习中</span>
              <span v-if="scope.row.user != null && scope.row.user.status != 0">未实习</span>
              <span v-if="scope.row.student != null && (scope.row.student.status == 0 || scope.row.student.status == 3)">未实习</span>
              <span v-if="scope.row.student != null && scope.row.student.status == 1">审核中</span>
              <span v-if="scope.row.student != null && scope.row.student.status == 2">实习中</span>
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
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import { archivedList, selectAllPractice , exportArchivedArrangement,getArrangement, delArrangement, addArrangement, updateArrangement, exportArrangement } from "@/api/arrangement/arrangement";
  import { Loading } from 'element-ui'

  export default {
    name: "Arrangement",
    data() {
      return {
        //数据归档年份
        archiveTime: '',
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
        // 归档数据年份选项
        archivedYears: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //折叠状态
        foldOpen : false,
        hamburgerParam: {
          academyW: 0,
          mainW: 24
        },
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          stuId: null,
          info : null,
          infoId: null,
          notes: null,
          stuOption: null,
          status: null,
          postName : null,
          nickName : null,
          practiceStatus: null ,
          practiceType : null,
          year: undefined
        },
        // 导出归档数据参数
        export_archive: {
          // 是否显示弹出层（导出归档数据）
          open: false,
          // 弹出层标题（数据归档）
          title: '',
        },
        statusChangeParams:{
          arrangementId:null,
          status:null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          stuId: [
            { required: true, message: "实习学生ID不能为空", trigger: "blur" }
          ],
          infoId: [
            { required: true, message: "实习信息ID不能为空", trigger: "blur" }
          ],
        }
      };
    },
    created() {
      // this.getList();

      this.getDicts('sys_archived_year').then(response => {
        this.archivedYears = response.data
        this.queryParams.year = response.data[0].dictValue
        this.getList()
      })
    },
    watch: {
      searchKey(val , oldVal) {
        console.log(val)
      }
    },
    methods: {
      /** 查询实习安排列表 */
      getList() {
        this.loading = true;
        archivedList(this.queryParams).then(response => {
          this.arrangementList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
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
      // 年份单击事件
      handleYearClick(data) {
        this.queryParams.year = data
        this.getList()
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          arrangementId: null,
          stuId: null,
          infoId: null,
          notes: null,
          stuOption: null,
          status: "0",
          delFlag: null,
          nickName : null,
          postName : null ,
          userName : null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.arrangementId)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加实习安排";
      },
      /** 导出归档数据按钮操作 */
      exportArchive() {
        this.export_archive.title = '导出归档数据'
        this.export_archive.open = true
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const arrangementId = row.arrangementId || this.ids
        getArrangement(arrangementId).then(response => {
          this.form = response.data;
          console.log(this.form)
          this.form.nickName = this.form.user.nickName
          this.form.postName = this.form.info.postName
          this.form.userName = this.form.user.userName
          this.open = true;
          this.title = "修改实习安排";
        });
      },
      /** 状态改变操作 */
      changeStatus(row) {
        let that = this
        let text = row.status ==="0" ? "有效" : "无效";
        this.$confirm('是否将ID为 '+row.infoId+' 的实习信息状态改为'+text,"状态变更",{
          confirmButtonText:"确定",
          cancelButtonText:"取消",
          type:"warning"
        }).then(function () {
          that.statusChangeParams.arrangementId = row.arrangementId
          that.statusChangeParams.status = row.status
          return updateArrangement(that.statusChangeParams)
        }).then(()=>{
          this.msgSuccess("修改成功");
        }).catch(function () {
          row.status = row.status==="0"?"1":"0";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.arrangementId != null) {
              updateArrangement(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addArrangement(this.form).then(response => {
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
        const arrangementIds = row.arrangementId || this.ids;
        let userName = null;
        let nickName = null;
        if(row.student != null){
          userName = row.student.userName
          nickName = row.student.nickName
        }else if(row.user != null){
          userName = row.user.userName
          nickName = row.user.nickName
        }
        this.$confirm('是否要取消' + userName + nickName + '的实习?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delArrangement(arrangementIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有实习安排数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportArchivedArrangement(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
      },


    }
  };
</script>
