<template>
  <div class="app-container">
    <!--搜索项-->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="基地ID" prop="baseId">
        <el-input
          v-model="queryParams.baseId"
          placeholder="请输入基地ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <!--单位名称-->
      <!--<el-form-item label="单位名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入单位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->

      <el-form-item label="基地名称" prop="baseName">
        <el-input
          v-model="queryParams.baseName"
          placeholder="请输入基地名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--基地单位性质-->
      <!--<el-form-item label="基地单位性质" prop="baseNature">
        <el-input
          v-model="queryParams.baseNature"
          placeholder="请输入基地单位性质"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->

      <!--基地法定代表-->
      <!--<el-form-item label="基地法定代表" prop="baseLeader">
        <el-input
          v-model="queryParams.baseLeader"
          placeholder="请输入基地法定代表"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!--基地联系人-->
      <!--<el-form-item label="基地联系人" prop="baseContacts">
        <el-input
          v-model="queryParams.baseContacts"
          placeholder="请输入基地联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="联系电话" prop="basePhone">
        <el-input
          v-model="queryParams.basePhone"
          placeholder="请输入联系电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--传真-->
      <!--<el-form-item label="传真" prop="baseFax">
        <el-input
          v-model="queryParams.baseFax"
          placeholder="请输入传真"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!--邮箱-->
      <!--<el-form-item label="邮箱" prop="baseEmail">
        <el-input
          v-model="queryParams.baseEmail"
          placeholder="请输入邮箱"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->

      <!--学校基地负责人-->
      <!--<el-form-item label="学校基地负责人" prop="schoolLeader">
        <el-input
          v-model="queryParams.schoolLeader"
          placeholder="请输入学校基地负责人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!--学校基地负责人电话-->
      <!--<el-form-item label="学校基地负责人电话" prop="schoolPhone">
        <el-input
          v-model="queryParams.schoolPhone"
          placeholder="请输入学校基地负责人电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->

      <el-form-item label="基地状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择基地状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!--删除标志-->
      <!--<el-form-item label="删除标志" prop="delFlag">
        <el-select v-model="queryParams.delFlag" placeholder="请选择删除标志" clearable size="small">
          <el-option
            v-for="dict in delFlagOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--表头按钮-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['baseInfo:baseInfo:add']"
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
          v-hasPermi="['baseInfo:baseInfo:edit']"
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
          v-hasPermi="['baseInfo:baseInfo:remove']"
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
          v-hasPermi="['baseInfo:baseInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>


    <el-table v-loading="loading" :data="baseInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="基地ID" align="center" key="baseId" prop="baseId" />
      <el-table-column label="基地名称" align="center" prop="baseName" />
      <el-table-column label="基地单位性质" align="center" prop="baseNature" />
      <el-table-column label="基地联系人" align="center" prop="baseContacts" />
      <el-table-column label="基地联系电话" align="center" prop="basePhone" />
      <el-table-column label="学校基地负责人" align="center" prop="schoolLeader" />
      <el-table-column label="学校基地联系电话" align="center" prop="schoolPhone" />
      <el-table-column label="状态" align="center" key="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['baseInfo:baseInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['baseInfo:baseInfo:remove']"
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

    <!-- 添加或修改基地信息管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单位名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item label="基地名称" prop="baseName">
          <el-input v-model="form.baseName" placeholder="请输入基地名称" />
        </el-form-item>
        <el-form-item label="基地单位性质" prop="baseNature">
          <el-input v-model="form.baseNature" placeholder="请输入基地单位性质" />
        </el-form-item>
        <el-form-item label="基地法定代表" prop="baseLeader">
          <el-input v-model="form.baseLeader" placeholder="请输入基地法定代表" />
        </el-form-item>
        <el-form-item label="基地联系人" prop="baseContacts">
          <el-input v-model="form.baseContacts" placeholder="请输入基地联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="basePhone">
          <el-input v-model="form.basePhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="传真" prop="baseFax">
          <el-input v-model="form.baseFax" placeholder="请输入传真" />
        </el-form-item>
        <el-form-item label="基地单位地址" prop="baseAddress">
          <el-input v-model="form.baseAddress" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="邮箱" prop="baseEmail">
          <el-input v-model="form.baseEmail" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="学校基地负责人" prop="schoolLeader">
          <el-input v-model="form.schoolLeader" placeholder="请输入学校基地负责人" />
        </el-form-item>
        <el-form-item label="学校基地负责人电话" prop="schoolPhone">
          <el-input v-model="form.schoolPhone" placeholder="请输入学校基地负责人电话" />
        </el-form-item>
        <el-form-item label="基地情况简介" prop="baseIntroduction">
          <el-input v-model="form.baseIntroduction" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="实习环境" prop="practiceEnvironment">
          <el-input v-model="form.practiceEnvironment" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="基地状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="删除标志">
          <el-radio-group v-model="form.delFlag">
            <el-radio
              v-for="dict in delFlagOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBaseInfo, getBaseInfo, delBaseInfo, addBaseInfo, updateBaseInfo, exportBaseInfo,changeBaseStatus } from "@/api/system/baseInfo";

export default {
  name: "BaseInfo",
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
      // 基地信息管理表格数据
      baseInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 基地状态字典
      statusOptions: [],
      // 删除标志字典
      delFlagOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        baseId: null,
        companyName: null,
        baseName: null,
        baseNature: null,
        baseLeader: null,
        baseContacts: null,
        basePhone: null,
        baseFax: null,
        baseAddress: null,
        baseEmail: null,
        schoolLeader: null,
        schoolPhone: null,
        status: null,
        delFlag: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        baseId: [
          { required: true, message: "基地ID不能为空", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "单位名称不能为空", trigger: "blur" }
        ],
        baseName: [
          { required: true, message: "基地名称不能为空", trigger: "blur" }
        ],
        baseNature: [
          { required: true, message: "基地单位性质不能为空", trigger: "blur" }
        ],
        baseLeader: [
          { required: true, message: "基地法定代表不能为空", trigger: "blur" }
        ],
        baseContacts: [
          { required: true, message: "基地联系人不能为空", trigger: "blur" }
        ],
        basePhone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        baseFax: [
          { required: true, message: "传真不能为空", trigger: "blur" }
        ],
        baseAddress: [
          { required: true, message: "基地单位地址不能为空", trigger: "blur" }
        ],
        baseEmail: [
          { required: true, message: "邮箱不能为空", trigger: "blur" }
        ],
        schoolLeader: [
          { required: true, message: "学校基地负责人不能为空", trigger: "blur" }
        ],
        schoolPhone: [
          { required: true, message: "学校基地负责人电话不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "基地状态不能为空", trigger: "blur" }
        ],
        delFlag: [
          { required: true, message: "删除标志不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_del_flag").then(response => {
      this.delFlagOptions = response.data;
    });
  },
  methods: {
    /** 查询基地信息管理列表 */
    getList() {
      this.loading = true;
      listBaseInfo(this.queryParams).then(response => {
        this.baseInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 基地状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 删除标志字典翻译
    delFlagFormat(row, column) {
      return this.selectDictLabel(this.delFlagOptions, row.delFlag);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        baseId: null,
        companyName: null,
        baseName: null,
        baseNature: null,
        baseLeader: null,
        baseContacts: null,
        basePhone: null,
        baseFax: null,
        baseAddress: null,
        baseEmail: null,
        schoolLeader: null,
        schoolPhone: null,
        baseIntroduction: null,
        practiceEnvironment: null,
        status: "0",
        delFlag: "0"
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
    // 基地状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要' + text + '"' + row.baseName + '"吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeBaseStatus(row.baseId, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.baseId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加基地信息管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const baseId = row.baseId || this.ids
      getBaseInfo(baseId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改基地信息管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.baseId != null) {
            updateBaseInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBaseInfo(this.form).then(response => {
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
      const baseIds = row.baseId || this.ids;
      this.$confirm('是否确认删除基地信息管理编号为"' + baseIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBaseInfo(baseIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有基地信息管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportBaseInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
