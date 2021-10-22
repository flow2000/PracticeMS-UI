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
      <el-form-item label="实习岗位" prop="postName">
        <el-input
          v-model="queryParams.postName"
          placeholder="请输入实习岗位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="启用" value="0" />
          <el-option label="禁用" value="1" />
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
          v-hasPermi="['arrangement:arrangement:add']"
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
          v-hasPermi="['arrangement:arrangement:edit']"
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
          v-hasPermi="['arrangement:arrangement:remove']"
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
          v-hasPermi="['arrangement:arrangement:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="arrangementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="实习安排ID" align="center" prop="arrangementId" />
      <el-table-column label="学号" align="center" prop="user.userName" />
	  <el-table-column label="学生姓名" align="center" prop="user.nickName" />
      <el-table-column label="实习岗位" align="center" prop="info.postName" />
      <el-table-column label="备注" align="center" prop="notes" />
      <el-table-column label="状态" align="center" prop="status" >
		  <template slot-scope="scope">
			<span v-show="scope.row.status == 0+''">启用</span>
			<span v-show="scope.row.status == 1+''">禁用</span>
		  </template>
	  </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['arrangement:arrangement:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['arrangement:arrangement:remove']"
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

    <!-- 添加或修改实习安排对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生ID" prop="stuId">
          <el-input v-model="form.stuId" placeholder="请输入实习学生ID" :disabled="true"/>
        </el-form-item>
        <el-form-item label="实习ID" prop="infoId">
          <el-input v-model="form.infoId" placeholder="请输入实习信息ID" :disabled="true"/>
        </el-form-item>
		<el-form-item label="学号" prop="userName">
		  <el-input v-model="form.userName" placeholder="请输入学号" :disabled="true" />
		</el-form-item>
		<el-form-item label="学生姓名" prop="nickName">
		  <el-input v-model="form.nickName" placeholder="请输入学生姓名" :disabled="true"/>
		</el-form-item>
		<el-form-item label="实习岗位" prop="postName">
		  <el-input v-model="form.postName" placeholder="请输入实习岗位" :disabled="true"/>
		</el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="0">启用</el-radio>
			<el-radio label="1">停用</el-radio>
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
import { listArrangement, getArrangement, delArrangement, addArrangement, updateArrangement, exportArrangement } from "@/api/arrangement/arrangement";

export default {
  name: "Arrangement",
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
      // 实习安排表格数据
      arrangementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
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
		nickName : null
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
    this.getList();
  },
  methods: {
    /** 查询实习安排列表 */
    getList() {
      this.loading = true;
      listArrangement(this.queryParams).then(response => {
        this.arrangementList = response.rows;
		console.log(this.arrangementList)
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
      this.$confirm('是否确认删除实习安排编号为"' + arrangementIds + '"的数据项?', "警告", {
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
          return exportArrangement(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
