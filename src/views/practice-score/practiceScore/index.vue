<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px"  v-hasPermi="['practice-score:practiceScore:edit']">
      <el-form-item label="学号" prop="userId">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入学号"
          clearable
          v-hasPermi="['practice-score:practiceScore:edit']"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="locationId">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="有效" value="1" />
          <el-option label="无效" value="0" />
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
          v-hasPermi="['practice-score:practiceScore:add']"
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
          v-hasPermi="['practice-score:practiceScore:edit']"
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
          v-hasPermi="['practice-score:practiceScore:remove']"
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
          v-hasPermi="['practice-score:practiceScore:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="practiceScoreList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="ID" align="center" prop="scoreId" width="40" />-->
<!--      <el-table-column label="用户ID" align="center" prop="userId"  width="70"/>-->
      <el-table-column label="学号" align="center" prop="username" />
      <el-table-column label="姓名" align="center" prop="nickname" width="80"/>
<!--      <el-table-column label="地点ID" align="center" prop="locationId" />-->
      <el-table-column label="开始时间" align="center" prop="startTime" width="110">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="110">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统参考成绩" align="center" prop="sysScore" />
      <el-table-column label="实习单位评定成绩" align="center" prop="companyScore" />
      <el-table-column label="指导老师评定成绩" align="center" prop="teacherScore" />
..    <el-table-column label="最终成绩" align="center" prop="finalScore" />
      <el-table-column label="实习鉴定表" align="center" prop="appraisal" >
        <template scope="scope">
          <el-link type="primary" :href="scope.row.appraisal" target=_blank>{{scope.row.appraisal==""?"未上传":scope.row.nickname+"的实习鉴定"}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="实习总结" align="center" prop="summary" >
        <template scope="scope">
          <el-link type="primary" :href="scope.row.summary" target=_blank>{{scope.row.summary==""?"未上传":scope.row.nickname+"的实习总结"}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="60">
        <template scope="scope" >
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"

            @change="changeStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="primary"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['practice-score:practiceScore:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['practice-score:practiceScore:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-upload"
            @click="openAppraisal(scope.row)"
            v-hasPermi="['practice-score:practiceScore:upload']"
          >上传实习鉴定</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-upload"
            @click="openSummery(scope.row)"
            v-hasPermi="['practice-score:practiceScore:upload']"
          >上传实习总结</el-button>
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

    <!-- 添加或修改实习成绩对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="地点ID" prop="locationId">
          <el-input v-model="form.locationId" placeholder="请输入地点ID" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable size="small"
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable size="small"
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="系统参考成绩" prop="sysScore">
          <el-input v-model="form.sysScore" placeholder="请输入系统参考成绩" />
        </el-form-item>
        <el-form-item label="单位评定成绩" prop="companyScore">
          <el-input v-model="form.companyScore" placeholder="请输入实习单位评定成绩" />
        </el-form-item>
        <el-form-item label="指导老师评定成绩" prop="teacherScore">
          <el-input v-model="form.teacherScore" placeholder="请输入实习指导老师评定成绩" />
        </el-form-item>
        <el-form-item label="最终成绩" prop="finalScore">
          <el-input v-model="form.finalScore" placeholder="请输入最终成绩" />
        </el-form-item>
        <el-form-item label="实习鉴定表PDF路径" prop="appraisal">
          <el-input v-model="form.appraisal" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="实习PDF路径" prop="summary">
          <el-input v-model="form.summary" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">有效</el-radio>
            <el-radio label="0">无效</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <el-dialog
      title="上传实习鉴定"
      :visible.sync="appraisalVisible"
      width="28%"
      style="top: 10%"
      @close="this.getList"
      >
      <el-upload
        style="margin-left: 10%"
        class="upload-demo"
        accept=".pdf"
        :limit="1"
        drag
        :file-list="upload.AppraisalFileList"
        :headers="upload.headers"
        :action="upload.AppraisalUrl"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :data="{nick_name:upload.nick_name,user_id:upload.user_id,scoreId:upload.scoreId}"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text" >将文件拖到此处,或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传PDF文件，且不超过10M</div>
      </el-upload>
    </el-dialog>

    <el-dialog
      title="上传实习总结"
      :visible.sync="summeryVisible"
      width="28%"
      style="top: 10%"
      @close="this.getList"
    >
      <el-upload
        style="margin-left: 10%"
        class="upload-demo"
        accept=".pdf"
        :limit="1"
        drag
        :file-list="upload.SummaryFileList"
        :headers="upload.headers"
        :action="upload.SummaryUrl"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :data="{nick_name:upload.nick_name,user_id:upload.user_id,scoreId:upload.scoreId}"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处,或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传PDF文件，且不超过10M</div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
import { listPracticeScore, getPracticeScore, delPracticeScore, addPracticeScore, updatePracticeScore, exportPracticeScore , updateScoreStatus} from "@/api/practice-score/practiceScore";
import { getToken , getInfo} from "@/utils/auth";
import { getUserProfile } from "@/api/system/user";

import Cookies from "js-cookie";

export default {
  name: "PracticeScore",

  data() {
    return {
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
      // 实习成绩表格数据
      practiceScoreList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      /**实习鉴定窗口是否可见*/
      permissionLis:[],
      /**实习鉴定窗口是否可见*/
      appraisalVisible:false,
      /**实习鉴定窗口是否可见*/
      summeryVisible:false,
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: {
          Authorization: "Bearer " + getToken()
        },
        // 上传的地址
        AppraisalUrl: process.env.VUE_APP_BASE_API + "/common/uploadAppraisal",
        SummaryUrl:process.env.VUE_APP_BASE_API + "/common/uploadSummary",
        // 上传的文件列表
        AppraisalFileList: [],
        SummaryFileList: [],
        //传递文件所需要用到的参数 姓名
        nick_name:"",
        // 学号
        user_id:"",
        //成绩编号
        scoreId:""
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        locationId: null,
        startTime: null,
        endTime: null,
        sysScore: null,
        companyScore: null,
        teacherScore: null,
        finalScore: null,
        appraisal: null,
        summary: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        locationId: [
          { required: true, message: "地点ID不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询实习成绩列表 */
    getList() {
      this.loading = true;
      // getUserProfile().then(PromiseValue =>{
      //     console.log(PromiseValue.data.userId);
      //     this.permissionLis = PromiseValue.data.roles;
      //     for (var i = 0;i<this.permissionLis.length;i++){
      //       if(this.permissionLis[i].roleKey=="student")
      //         this.queryParams.userId=PromiseValue.data.userId;
      //     }
      //   }
      // );
      listPracticeScore(this.queryParams).then(response => {
        this.practiceScoreList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        scoreId: null,
        userId: null,
        locationId: null,
        startTime: null,
        endTime: null,
        sysScore: null,
        companyScore: null,
        teacherScore: null,
        finalScore: null,
        appraisal: null,
        summary: null,
        status: "0",
        delFlag: null
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
      this.ids = selection.map(item => item.scoreId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },


    /** 状态改变操作 */
    changeStatus(row) {
      let text = row.status ==="1" ? "有效" : "无效";
      this.$confirm('是否将ID为 '+row.scoreId+' 的实习状态改为'+text,"状态变更",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(function () {
        return updateScoreStatus(row.scoreId,row.status)
      }).then(()=>{
        this.$message({
          message: '操作成功',
          type: 'success'
        });
      }).catch(function () {
        row.status = row.status==="0"?"1":"0";
        this.$message('取消操作');
      });
    },
    /**打开上传文件对话框*/
    openAppraisal(row){
      this.appraisalVisible = true;
      this.upload.AppraisalFileList = [];
      const scoreId = row.scoreId || this.ids;
      getPracticeScore(scoreId).then(response => {
        this.form = response.data;
        //提前确定这一行的姓名，学号，等下传递参数的时候要用到
        this.upload.nick_name = response.data.nickname;
        this.upload.user_id = response.data.username;
        this.upload.scoreId = response.data.scoreId;
        //console.log(response.data);
      });
    },
    /** 上传实习鉴定按钮操作 */
    uplaodAppraisal(row){

    },
    /**打开上传文件对话框*/
    openSummery(row){
      this.summeryVisible = true;
      this.upload.SummaryFileList = [];
      const scoreId = row.scoreId || this.ids
      getPracticeScore(scoreId).then(response => {
        this.form = response.data;
        //提前确定这一行的姓名，学号，等下传递参数的时候要用到
        this.upload.nick_name = response.data.nickname;
        this.upload.user_id = response.data.username;
        this.upload.scoreId = response.data.scoreId;
        //console.log(response.data);
      });
    },
    /** 上传实习鉴定按钮操作 */
    uplaodSummery(row){
      this.reset();

    },

    // 文件提交处理
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {

      this.upload.isUploading = false;
      this.form.filePath = response.url;
      this.msgSuccess(response.msg);

    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加实习成绩";
      this.upload.fileList = [];
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const scoreId = row.scoreId || this.ids
      getPracticeScore(scoreId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改实习成绩";
      });
      this.upload.fileList = [{ name: this.form.fileName, url: this.form.filePath }];
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.scoreId != null) {
            updatePracticeScore(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPracticeScore(this.form).then(response => {
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
      const scoreIds = row.scoreId || this.ids;
      this.$confirm('是否确认删除实习成绩编号为"' + scoreIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPracticeScore(scoreIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有实习成绩数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportPracticeScore(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
