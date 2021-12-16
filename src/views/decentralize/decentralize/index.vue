<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="实习地点" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入实习地点名称"
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

    <el-table v-loading="loading" :data="decentralizeList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="实习地点"  align="center" prop="companyName" />
      <el-table-column label="审核进度"  align="center" prop="companyName" >
        <template slot-scope="scope">
          <span v-show="scope.row.awaitingApprovalNum == scope.row.totalNum" style="color : #67C23A">{{scope.row.awaitingApprovalNum}}/{{scope.row.totalNum}}</span>
          <span v-show="scope.row.awaitingApprovalNum != scope.row.totalNum" style="color : #F56C6C">{{scope.row.awaitingApprovalNum}}/{{scope.row.totalNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['decentralize:decentralize:edit']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['decentralize:decentralize:remove']"
          >删除</el-button>
          <el-dropdown v-if="scope.row.status == 1" size="mini" @command="(command) => handleCommand(command, scope.row)">
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="consentApply" icon="el-icon-key"
                                v-hasPermi="['decentralize:decentralize:edit']" >同意申请
              </el-dropdown-item>
              <el-dropdown-item command="refuseApply" icon="el-icon-circle-check"
              v-hasPermi="['decentralize:decentralize:edit']">拒绝申请
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

    <el-dialog :title="title" :visible.sync="open" width="1200px" :append-to-body="true">
      <el-table ref="table" v-loading="loading" :row-key="getRowKey" :data="form" @selection-change="practiceHandleSelectionChange">
        <el-table-column :selectable="selectable" type="selection" width="55" align="center" />
        <el-table-column label="分散实习申请编号" align="center" prop="applyId" v-if="false"/>
        <el-table-column label="学生姓名" align="center" prop="student.nickName" />
        <el-table-column label="经营范围" align="center" prop="businessScope" />
        <el-table-column v-if="auditor != null" label="审核人姓名" align="center" prop="auditor.nickName" >
          <template slot-scope="scope">
            <div v-if="scope.row.auditor.nickName">
              <el-popover
                v-if="scope.row.auditor.nickName.length > 9"
                placement="top"
                trigger="hover"
              >
                <span>{{scope.row.auditor.nickName}}</span>
                <span slot="reference" style="curosr:pointer">{{scope.row.auditor.nickName.slice(0,9)+"..."}}</span>
              </el-popover>
              <div v-else>{{scope.row.auditor.nickName}}</div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column v-else label="审核人姓名" align="center" >
            <div>--</div>
        </el-table-column>
        <el-table-column label="实习地点" align="center" prop="location.companyName" >
          <template slot-scope="scope">
            <div v-if="scope.row.location.companyName">
              <el-popover
                v-if="scope.row.location.companyName.length > 9"
                placement="top"
                trigger="hover"
              >
                <span>{{scope.row.location.companyName}}</span>
                <span slot="reference" style="curosr:pointer">{{scope.row.location.companyName.slice(0,9)+"..."}}</span>
              </el-popover>
              <div v-else>{{scope.row.location.companyName}}</div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.auditTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="notes" >
          <template slot-scope="scope">
            <div v-if="scope.row.notes">
              <el-popover
                v-if="scope.row.notes.length > 9"
                placement="top"
                trigger="hover"
              >
                <span>{{scope.row.notes}}</span>
                <span slot="reference" style="curosr:pointer">{{scope.row.notes.slice(0,9)+"..."}}</span>
              </el-popover>
              <div v-else>{{scope.row.notes}}</div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="status" >
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">未审核</span>
            <span v-if="scope.row.status == 2">已通过</span>
            <span v-if="scope.row.status == 3">未通过</span>
          </template>
        </el-table-column>
        <el-table-column label="实习证明" align="center" prop="acceptanceCertificate" >
          <template scope="scope">
            <el-link type="primary" v-show="scope.row.acceptanceCertificate != ''" :href="scope.row.acceptanceCertificate" target=_blank>查看</el-link>
            <span type="primary" v-show="scope.row.acceptanceCertificate == ''" target=_blank>未上传</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-dropdown v-if="scope.row.status == 1" size="mini" @command="(command) => handleCommand(command, scope.row)">
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="consentApply" icon="el-icon-check"
                                  v-hasPermi="['decentralize:decentralize:edit']" >同意申请
                </el-dropdown-item>
                <el-dropdown-item command="refuseApply" icon="el-icon-close"
                                  v-hasPermi="['decentralize:decentralize:edit']">拒绝申请
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="utotal>0"
        :total="utotal"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getDecentralizeInfo"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="consentApplys">一键通过</el-button>
        <el-button type="primary" @click="refuseApplys">一键拒绝</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getDecentralizeByLocation , updateDecentralizes ,getDecentralizeInfo , listDecentralize, getDecentralize, delDecentralize, addDecentralize, updateDecentralize, exportDecentralize } from "@/api/decentralize/decentralize";
export default {
  name: "Decentralize",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 选中数组
      selectionIds: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      //实习学生总条数
      utotal : 0,
      // 分散实习申请表格数据
      decentralizeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stuId: null,
        businessScope: null,
        acceptanceCertificate: null,
        notes: null,
        auditorId: null,
        auditTime: null,
        status: null,
        locationId: null,
        companyName : null
      },
      approvalParams:{
        applyId : null,
        status : null,
        auditTime : null ,
        auditorId : null,
        notes : null,
        applyIds : []
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stuId: [
          { required: true, message: "实习学生ID不能为空", trigger: "blur" }
        ],
        auditorId: [
          { required: true, message: "审核人ID不能为空", trigger: "blur" }
        ],
        locationId: [
          { required: true, message: "实习地点ID不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.$nextTick(function () {
      this.getList();
    })
  },
  methods: {
    /** 查询分散实习申请列表 */
    getList() {
      this.loading = true;
      this.$nextTick(function () {
        getDecentralizeByLocation(this.queryParams).then(response => {
          this.decentralizeList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        applyId: null,
        stuId: null,
        businessScope: null,
        acceptanceCertificate: null,
        notes: null,
        auditorId: null,
        auditTime: null,
        status: "0",
        delFlag: null,
        locationId: null,
        companyName : null
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
      this.ids = selection.map(item => item.applyId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    // 多选框选中数据
    practiceHandleSelectionChange(selection) {
      this.selectionIds = selection.map(item => item.applyId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'consentApply':
          this.consentApply(row)
          break
        case 'refuseApply':
          this.refuseApply(row)
          break
        default:
          break
      }
    },
    selectable(row,index){
      if(row.status== '1'){
        return 1;
      }else{
        return 0;
      }
    },
    getRowKey (row) {
      return row.userId
    },
    /** 同意申请按钮操作 */
    consentApply(row) {
      this.$confirm('此操作将同意该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.approvalParams.applyId = row.applyId
        this.approvalParams.status = '2'
        updateDecentralize(this.approvalParams).then(response => {
          this.$message({
            type: 'success',
            message: '已同意!'
          });
          this.getDecentralizeInfo(row.locationId)
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    /** 批量同意申请按钮操作 */
    consentApplys(row) {
      if(this.selectionIds.length == 0){
        this.$message({
          type: 'info',
          message: '还未选中学生'
        });
        return;
      }
      this.$confirm('此操作将同意该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.approvalParams.status = '2'
        this.approvalParams.applyIds = this.selectionIds
        updateDecentralizes(this.approvalParams).then(response => {
          this.$message({
            type: 'success',
            message: '已同意!'
          });
          this.getDecentralizeInfo(row.locationId)
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    /** 批量拒绝申请按钮操作 */
    refuseApplys(row) {
      if(this.selectionIds.length == 0){
        this.$message({
          type: 'info',
          message: '还未选中学生'
        });
        return;
      }
      this.$prompt('拒绝理由', '拒绝申请', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator(value){
          if (value == undefined) {
            return '拒绝理由不能为空'
          } else if (value.length == 0) {
            return '拒绝理由不能为空'
          } else if (value.length > 50) {
            return '请输入20个字符以内的分组名称'
          }
        },
        inputErrorMessage: '不支持特殊字符'
      }).then(({ value }) => {
        this.approvalParams.applyIds = this.selectionIds
        this.approvalParams.status = '3'
        this.approvalParams.notes = value
        updateDecentralizes(this.approvalParams).then(response => {
          this.$message({
            type: 'success',
            message: '已拒绝!'
          });
          this.getDecentralizeInfo(row.locationId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });
      });
    },
    /** 拒绝申请按钮操作 */
    refuseApply(row) {
      console.log(this.selectionIds)
      this.$prompt('拒绝理由', '拒绝申请', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator(value){
          if (value == undefined) {
            return '拒绝理由不能为空'
          } else if (value.length == 0) {
            return '拒绝理由不能为空'
          } else if (value.length > 50) {
            return '请输入20个字符以内的分组名称'
          }
        },
        inputErrorMessage: '不支持特殊字符'
      }).then(({ value }) => {
          this.approvalParams.applyId = row.applyId
          this.approvalParams.status = '3'
          this.approvalParams.notes = value
          updateDecentralize(this.approvalParams).then(response => {
            this.$message({
              type: 'success',
              message: '已拒绝!'
            });
            this.getDecentralizeInfo(row.locationId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        });
      });
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const locationId = row.locationId
      this.$nextTick(function () {
        this.getDecentralizeInfo(locationId);
      })
    },
    getDecentralizeInfo(locationId){
      getDecentralizeInfo(locationId).then(response => {
        this.form = response.data;
        this.utotal = response.data.length
        this.open = true
        this.title = "详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.applyId != null) {
            updateDecentralize(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getDecentralizeInfo(this.form.locationId)
            });
          } else {
            addDecentralize(this.form).then(response => {
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
      const applyIds = row.applyId || this.ids;
      this.$confirm('是否确认删除分散实习申请编号为"' + applyIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDecentralize(applyIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有分散实习申请数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportDecentralize(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
