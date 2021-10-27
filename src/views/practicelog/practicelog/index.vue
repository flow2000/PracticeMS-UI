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
          v-hasPermi="['practicelog:practicelog:export']"
        >上传实习鉴定</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleExport"
          v-hasPermi="['practicelog:practicelog:export']"
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
      <el-table-column label="学号" align="center" prop="userName" width="150"/>
      <el-table-column label="姓名" align="center" prop="user.nickName"width="80"/>
<!--      <el-table-column label="地点信息" align="center" prop="locationName" />-->
      <el-table-column label="创建时间" align="center" prop="time" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志内容" align="center" prop="logContents"/>
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
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text" >将文件拖到此处,或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传PDF文件，且不超过10M</div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
  import { listPracticelog, getPracticelog, delPracticelog, addPracticelog, updatePracticelog, exportPracticelog } from "@/api/practicelog/practicelog";

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

      openAppraisal(){
        this.appraisalVisible = true;
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

</style>
