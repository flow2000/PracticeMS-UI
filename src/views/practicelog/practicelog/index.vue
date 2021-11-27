<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="地点信息" prop="locationName">-->
<!--        <el-input-->
<!--          v-model="queryParams.locationName"-->
<!--          placeholder="请输入地点信息"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['practicelog:practicelog:add']"
        >添加实习日志</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-upload"
          size="mini"
          @click="openAppraisal"
          v-hasPermi="['practicelog:practicelog:add']"
        >上传实习鉴定</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="openSummery"
          v-hasPermi="['practicelog:practicelog:add']"
        >上传实习总结</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['practicelog:practicelog:edit']"
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
          v-hasPermi="['practicelog:practicelog:remove']"
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
          v-hasPermi="['practicelog:practicelog:export']"
        >导出</el-button>
      </el-col>


      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="practicelogList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" align="center" show-overflow-tooltip width="50px">
      </el-table-column>
<!--      <el-table-column label="日志ID" align="center" prop="logId" />-->
      <el-table-column label="学号" align="center" prop="userName" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.userName">
            <el-popover
              v-if="scope.row.userName.length > 12"
              placement="top"
              trigger="hover"
            >
              <span>{{scope.row.userName}}</span>
              <span slot="reference" style="curosr:pointer">{{scope.row.userName.slice(0,12)+"..."}}</span>
            </el-popover>
            <div v-else>{{scope.row.userName}}</div>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="user.nickName"width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.user.nickName">
            <el-popover
              v-if="scope.row.user.nickName.length > 9"
              placement="top"
              trigger="hover"
            >
              <span>{{scope.row.user.nickName}}</span>
              <span slot="reference" style="curosr:pointer">{{scope.row.user.nickName.slice(0,9)+"..."}}</span>
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
              <span slot="reference" style="curosr:pointer">{{scope.row.logContents.slice(0,40)+"..."}}</span>
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
          >日志详细</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['practicelog:practicelog:edit']"
          >编辑</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['practicelog:practicelog:remove']"-->
<!--          ></el-button>-->
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

    <!-- 添加或修改实习日志对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
<!--        <el-form-item label="用户账号" prop="userName">-->
<!--          <el-input v-model="form.userName" placeholder="请输入用户姓名" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="地点信息" prop="locationName">-->
<!--          <el-input v-model="form.locationName" placeholder="请输入地点信息" /><el-button type="primary">主要按钮</el-button>-->
<!--        </el-form-item>-->
        <el-form-item label="目前时间" prop="time">
          <el-date-picker clearable size="small"
                          v-model="selectTime"
                          disabled
                          type="date"
                          placeholder="选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="日志内容" prop="logContents">
          <el-input v-model="form.logContents"
                    type="textarea"
                    placeholder="请输入内容"
          />
        </el-form-item>
<!--        <el-form-item label="删除标志" prop="delFlag">-->
<!--          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

<!--    详细-->
    <el-dialog :title="title" :visible.sync="detailOpen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!--        <el-form-item label="用户账号" prop="userName">-->
        <!--          <el-input v-model="form.userName" placeholder="请输入用户姓名" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="地点信息" prop="locationName">-->
        <!--          <el-input v-model="form.locationName" placeholder="请输入地点信息" /><el-button type="primary">主要按钮</el-button>-->
        <!--        </el-form-item>-->
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
        <!--        <el-form-item label="删除标志" prop="delFlag">-->
        <!--          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />-->
        <!--        </el-form-item>-->
      </el-form>
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--        <el-button @click="cancel">取 消</el-button>-->
<!--      </div>-->
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
        multiple
        :file-list="upload.AppraisalFileList"
        :headers="upload.headers"
        :action="upload.AppraisalUrl"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :data="{nick_name:upload.nick_name,user_id:upload.user_id,scoreId:upload.scoreId}"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text" >将文件拖到此处,或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传PDF文件，且不超过10M</div>
      </el-upload>
      <el-button type="primary" style="margin-left: 10%;margin-top: 5%" @click="watchAppraisal">查看上传的实习鉴定</el-button>
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
        multiple
        :file-list="upload.SummaryFileList"
        :headers="upload.headers"
        :action="upload.SummaryUrl"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :data="{nick_name:upload.nick_name,user_id:upload.user_id,scoreId:upload.scoreId}"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text" >将文件拖到此处,或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传PDF文件，且不超过10M</div>
      </el-upload>
      <el-button type="primary" style="margin-left: 10%;margin-top: 5%" @click="watchSummery">查看上传的实习总结</el-button>
    </el-dialog>

  </div>
</template>

<script>
  import { listPracticelog, getPracticelog, delPracticelog, addPracticelog, updatePracticelog, exportPracticelog } from "@/api/practicelog/practicelog";
  import { listPracticeScore, getPracticeScore, delPracticeScore, addPracticeScore, updatePracticeScore, exportPracticeScore , updateScoreStatus} from "@/api/practice-score/practiceScore";
  import { getUserProfile } from '@/api/system/user';
  import { getToken , getInfo} from "@/utils/auth";

  export default {
    name: "Practicelog",
    data() {
      return {
        edit: true,
        disabledMore: true,
        //实习鉴定窗口是否可见
        appraisalVisible:false,
        //实习鉴定窗口是否可见
        summeryVisible:false,
        //用户的信息
        user:{},
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
        title: "",
        // 是否显示弹出层
        open: false,
        //是否弹出详细层
        detailOpen:false,
        // 是否禁止
        disabled:false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userName: null,
          locationName: null,
          time: null,
          logContents: null,
        },
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
          scoreId:"",
          //用户自己的实习鉴定
          userAppraisal:"",
          //自己的实习总结
          userSummery:""
        },
        selectTime:'',
        // 表单参数
        form: {
          selectTime:new Date()
        },
        // 表单校验
        rules: {
          userName: [
            { required: true, message: "用户姓名不能为空", trigger: "blur" }
          ],
          locationName: [
            { required: true, message: "地点信息不能为空", trigger: "blur" }
          ],
        }
      };
    },
    created() {
      this.getList();
      this.initData({});
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        //console.log(this.user);
        //console.log(this.roleGroup);
      });

    },

    methods: {
      async initData(data) {
        //获取当前时间
        var now   = new Date();
        var monthn = now.getMonth()+1;
        var yearn  = now.getFullYear();
        var dayn = now.getDate();
        this.selectTime = yearn+"-"+monthn+"-"+dayn;
      },
      //打开实习鉴定页面
      openAppraisal(){
        this.appraisalVisible = true;
        this.upload.AppraisalFileList = [];
        this.upload.nick_name = this.user.nickName;
        this.upload.user_id = this.user.userId;
        this.upload.scoreId = 0;
      },
      watchAppraisal(){

        listPracticeScore({userId:this.user.userId}).then(response => {

          if(response.rows[0].appraisal==""){
          }
          URL  = response.rows[0].appraisal;
          this.upload.userAppraisal = URL;
          //window.location.href=URL;
        });
        window.open(this.upload.userAppraisal,'_blank');
      },
      watchSummery(){
        listPracticeScore({userId:this.user.userId}).then(response => {
          console.log(response.rows[0].summary);
          if(response.rows[0].summary==""){
          }
          URL  = response.rows[0].summary;
          this.upload.userSummery = URL;
          //window.location.href=URL;
        });
        window.open(this.upload.userSummery,'_blank');
      },
      //打开实习总结页面
      openSummery(){
        this.summeryVisible = true;
        this.upload.AppraisalFileList = [];
        this.upload.nick_name = this.user.nickName;
        this.upload.user_id = this.user.userId;
        this.upload.scoreId = 0;
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
      /** 查询实习日志列表 */
      getList() {
        this.loading = true;
        listPracticelog(this.queryParams).then(response => {
          this.practicelogList = response.rows;
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
          logId: null,
          userName: null,
          nickName: null,
          locationId: null,
          time: null,
          logContents: null,
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
        this.ids = selection.map(item => item.logId)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.disabled=false;
        this.open = true;
        this.title = "添加实习日志";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const logId = row.logId || this.ids
        getPracticelog(logId).then(response => {
          this.form = response.data;
          this.open = true;
          this.disabled=false;
          this.title = "修改实习日志";
        });
      },
      /** 详细按钮 */
      handleDetail(row) {
        const logId = row.logId || this.ids
        getPracticelog(logId).then(response => {
          this.form = response.data;
          this.title = "详细";
          this.detailOpen = true;
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.logId != null) {
              updatePracticelog(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addPracticelog(this.form).then(response => {
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
        const logIds = row.logId || this.ids;
        this.$confirm('是否确认删除实习日志编号为"' + logIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPracticelog(logIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有实习日志数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportPracticelog(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
      }
    },


  };
</script>
<style>
.overClass{
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  width: 170px;
}
</style>
