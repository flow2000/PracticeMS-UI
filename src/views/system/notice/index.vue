<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input
          v-model="queryParams.noticeTitle"
          placeholder="请输入公告标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员用户名" prop="createBy" label-width="130px">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入操作人员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="noticeType">
        <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          v-hasPermi="['system:notice:add']"
        >发布公告</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:notice:edit']"
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
          v-hasPermi="['system:notice:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"  v-if="operationColumnVisable"/>
      <el-table-column label="序号" align="center" prop="noticeId" width="100"  />
      <el-table-column
        label="公告标题"
        prop="noticeTitle"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.noticeTitle">
            <el-popover
              v-if="scope.row.noticeTitle.length > 12"
              placement="top"
              trigger="hover"
            >
              <span>{{scope.row.noticeTitle}}</span>
              <span slot="reference" style="curosr:pointer">{{scope.row.noticeTitle.slice(0,12)+"..."}}</span>
            </el-popover>
            <div v-else>{{scope.row.noticeTitle}}</div>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>


      <el-table-column label="创建人用户名" align="center" prop="createBy"  />
      <el-table-column label="创建人姓名" align="center" prop="nickname"  />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="公告类型"
        align="center"
        prop="noticeType"
        :formatter="typeFormat"
        width="180"
      />
      <el-table-column
        label="审核状态"
        align="center"
        prop="status"
        :formatter="statusFormat"
        width="100"
      >

        <template scope="scope">
          <p v-if="scope.row.status=='0'" style="color:#f47920">待审核</p>
          <p v-if="scope.row.status=='1'" style="color:#45b97c">审核通过</p>
          <p v-if="scope.row.status=='-1'" style="color:#d71345">审核不通过</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  v-if="operationColumnVisable">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleExamine(scope.row)"
            v-hasPermi="['system:notice:examine']"
          >审核</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['system:notice:edit']"-->
<!--          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:notice:remove']"
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

    <!--审核公告对话框-->
    <el-dialog title="审核" :visible.sync="examineOpen" :title="title" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" disabled />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="审核状态" v-hasPermi="['system:notice:edit']">
              <el-radio-group v-model="noticeStatus" @change="noticeStatusChange">
                <el-radio-button
                  v-hasPermi="['system:notice:edit']"
                  v-for="dict in [
                  {value: '1',label:'审核通过'},
                  {value: '2',label:'审核不通过'}]"
                  :key="dict.value"
                  v-model="dict.value"
                  :label="dict.label"
                ></el-radio-button>
              </el-radio-group>
              <el-form-item prop="refuseReason" >
                <el-input style="margin-top: 20px" v-if="refuseReasonOpen" v-model="refuseReason" placeholder="请输入不通过的理由"/>
              </el-form-item>
            </el-form-item>

          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" >
              <span style="font-size: medium" v-html="'<div style='+'position: absolute'+'>'+form.noticeContent+'</div>'"></span>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="examineOpen=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model="form.noticeType" placeholder="请选择">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审核状态" v-hasPermi="['system:notice:edit']">
              <el-radio-group v-model="noticeStatus" >
                <el-radio-button
                  v-hasPermi="['system:notice:edit']"
                  v-for="dict in [
                  {value: '1',label:'审核通过'},
                  {value: '2',label:'审核不通过'}]"
                  :key="dict.value"
                  v-model="dict.value"
                  :label="dict.label"
                ></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              <div v-on:blur.lazy="">
              <editor v-model="form.noticeContent" :aria-disabled="true" :min-height="192"/>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listNotice, getNotice, delNotice, addNotice, updateNotice } from "@/api/system/notice";
  import { getUserProfile } from '@/api/system/user';
  export default {
    name: "Notice",
    data() {
      return {
        user:{},
        roleGroup:{},
        operationColumnVisable:true,
        // 遮罩层
        loading: true,
        //拒绝理由
        refuseReason:"",
        refuseReasonOpen:false,
        //审核的对话框
        examineOpen:false,
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
        // 公告表格数据
        noticeList: [],
        // 弹出层标题
        title: "",
        // 对应某个通知的状态
        noticeStatus: '待审核',
        //通知类型
        noticeType:"",
        // 是否显示弹出层
        open: false,
        // 类型数据字典
        statusOptions: [],
        // 状态数据字典
        typeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          noticeTitle: undefined,
          noticeType:undefined,
          createBy: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          noticeTitle: [
            { required: true, message: "公告标题不能为空", trigger: "blur" }
          ],
          noticeType: [
            { required: true, message: "公告类型不能为空", trigger: "change" }
          ],
          // refuseReason:[
          //   { required: true, message: "不通过的理由不能为空", trigger: "change" }
          // ]
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("sys_notice_status").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("sys_notice_type").then(response => {
        this.typeOptions = response.data;
      });

      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        console.log(this.roleGroup);
        if(this.roleGroup.indexOf("系主任")!= -1 || this.roleGroup.indexOf("教学秘书")!= -1 || this.roleGroup.indexOf("系统管理员")!= -1)
        {
          this.operationColumnVisable = true;
        }else {
          //this.operationColumnVisable = false;
        }
      });
    },
    methods: {
      /**权限的显示*/
      operationColumn(){

        return false;
      },
      /** 查询公告列表 */
      getList() {
        this.loading = true;
        listNotice(this.queryParams).then(response => {
          this.noticeList = response.rows;
          this.total = response.total;
          this.loading = false;

        });
      },
      // 公告状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },
      // 公告状态字典翻译
      typeFormat(row, column) {
        return this.selectDictLabel(this.typeOptions, row.noticeType);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          noticeId: undefined,
          noticeTitle: undefined,
          noticeType: undefined,
          noticeContent: undefined,
          status: "0"
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
        this.ids = selection.map(item => item.noticeId)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加公告";
      },
      /**审核公告状态改变*/
      noticeStatusChange(val){
        if (val=='审核不通过')
          this.refuseReasonOpen=true;
        else
          this.refuseReasonOpen=false;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.refuseReason="";
        const noticeId = row.noticeId || this.ids
        getNotice(noticeId).then(response => {
          this.form = response.data;
          if(this.form.status=='0')
            this.noticeStatus ='待审核';
          else if(this.form.status=='1')
            this.noticeStatus ='审核通过'
          else this.noticeStatus ='审核不通过'
          this.open = true;
          this.title = "修改公告";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.refuseReason=this.refuseReason;
            if (this.form.noticeId != undefined) {
              if(this.noticeStatus=='待审核')
                this.form.status='0'
              if(this.noticeStatus=='审核通过')
                this.form.status='1'
              if(this.noticeStatus=='审核不通过')
                this.form.status='-1'
              updateNotice(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addNotice(this.form).then(response => {
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
        const noticeIds = row.noticeId || this.ids
        this.$confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNotice(noticeIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /**打开审核页面*/
      handleExamine(row){
        this.reset();
        const noticeId = row.noticeId || this.ids;
        getNotice(noticeId).then(response => {
          this.form = response.data;
          if(this.form.status=='0')
            this.noticeStatus ='待审核';
          else if(this.form.status=='1')
          {
            this.refuseReasonOpen=false;
            this.noticeStatus ='审核通过';
          }
          else {
            this.noticeStatus ='审核不通过';
            this.refuseReasonOpen=true;
          }
          this.title = "审核公告";
          this.examineOpen=true;
        })
      }
    }
  };
</script>
