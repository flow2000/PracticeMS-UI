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
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px"  v-hasPermi="['practice-score:practiceScore:edit']">
          <transition>
            <el-button v-on:click="foldContoller()" class="foldBt" :class="this.foldOpen?'el-icon-s-fold' : 'el-icon-s-unfold'"></el-button>
          </transition>
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
              v-hasPermi="['practice-score:practiceScore:export']"
            >导出</el-button>
          </el-col>


          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="practiceScoreList">
          <el-table-column label="学号" align="center" prop="username" />
          <el-table-column label="姓名" align="center" prop="nickname" width="80"/>
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
              <el-link type="primary" :href="scope.row.appraisal" target=_blank>{{scope.row.appraisal==null?"未上传":(scope.row.appraisal==""?"未上传":scope.row.nickname+"的实习鉴定")}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="实习总结" align="center" prop="summary" >
            <template scope="scope">
              <el-link type="primary" :href="scope.row.summary" target=_blank>{{scope.row.summary==null?"未上传":(scope.row.summary==""?"未上传":scope.row.nickname+"的实习总结")}}</el-link>
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
  import { archivedList, exportArchivedScore,calculate,listSetting,updateSetting} from "@/api/practice-score/practiceScore";
  import { getUserProfile } from "@/api/system/user";


  export default {
    name: "PracticeScore",

    data() {
      return {
        archiveTime: '',
        hamburgerParam: {
          academyW: 0,
          mainW: 24
        },
        //折叠状态
        foldOpen : false,
        user: {},
        setting:{},
        //帮助提示
        settinghelp:"总成绩=系统分数+教师分数+公司分数,系统分数=打卡分数*打卡权重+日志分数+日志权重\n",
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
        //成绩权重设定
        powerWeight:false,
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
          teacherId: null,
          year: undefined
        },
        // 归档数据年份选项
        archivedYears: [],
        // 表单参数
        form: {},
        // 表单参数
        formSetting: {},
        // 表单校验
        rules: {
          userId: [
            { required: true, message: "用户ID不能为空", trigger: "blur" }
          ],
          locationId: [
            { required: true, message: "地点ID不能为空", trigger: "blur" }
          ],
          systemWeight:[
            { required: true, message: "系统权重不能为空", trigger: "blur" }
          ],
          teacherWeight:[
            { required: true, message: "教师权重不能为空", trigger: "blur" }
          ],
          companyWeight:[
            { required: true, message: "公司权重不能为空", trigger: "blur" }
          ],
          punchWeight:[
            { required: true, message: "打卡权重不能为空", trigger: "blur" }
          ],
          logWeight:[
            { required: true, message: "日志权重不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      getUserProfile().then(response => {
        this.user = response.data
        //加载信息表
        // this.getList();

        this.getDicts('sys_archived_year').then(response => {
          this.archivedYears = response.data
          this.queryParams.year = response.data[0].dictValue
          this.getList()
        })
      })
    },
    methods: {
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
      /** 查询实习成绩列表 */
      getList() {
        this.loading = true;
        this.queryParams.teacherId = this.user.userId
        archivedList(this.queryParams).then(response => {
          this.practiceScoreList = response.rows;
          this.total = response.total;
          this.loading = false;
          console.log(this.practiceScoreList);
        });
      },
      // 年份单击事件
      handleYearClick(data) {
        this.queryParams.year = data
        this.getList()
      },
      /***/
      getSettingList(){
        listSetting().then(response =>{
          this.setting = response.rows[0];
          this.formSetting = response.rows[0];
          console.log(this.setting);
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

      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出实习成绩数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportArchivedScore(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
      },

      handleSetting(){
        this.powerWeight=true;
        this.getSettingList();
      },
      handleCalculate(row){
        const scoreIds = row.scoreId || this.ids;

        this.$confirm('是否确认计算这 ' + scoreIds.length + '条数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return calculate(scoreIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("计算完成");
        }).catch(() => {});
      },


    }
  };
</script>
