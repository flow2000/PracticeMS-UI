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
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <transition>
          <el-button v-on:click="foldContoller()" class="foldBt"
                     :class="this.foldOpen?'el-icon-s-fold' : 'el-icon-s-unfold'"></el-button>
        </transition>
        <el-form-item label="学号" prop="userName">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入学号"
            clearable
            size="small"
            style="width: 150px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="时间" prop="creatTimee">
          <el-date-picker clearable size="small"
                          v-model="queryParams.creatTimee"
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
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="handleExport"
            v-hasPermi="['punch:punch:export']"
          >导出
          </el-button>
        </el-col>


        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="punchList" border>

        <el-table-column label="学号" align="center" prop="userName"/>
        <el-table-column label="姓名" align="center" prop="user.nickName"/>
        <el-table-column label="打卡时间" align="center" prop="createTime"/>
        <el-table-column
          align="center"
          label="打卡结果"
          width="140">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>标识: {{ scope.row.attendanceId }}</p>
              <p>姓名: {{ scope.row.user.nickName }}</p>
              <p>打卡地点: {{ scope.row.location }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag
                  :type="scope.row.status === '0' ? 'success' : 'danger'"
                >{{ scope.row.status =='0' ? '打卡成功':'打卡失败' }}
                </el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <!--      <el-table-column label="状态" align="center" prop="status" />-->

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
  import {
    listPunch,
    exportArchivedPunch,
    archivedList
  } from '@/api/punch/punch'
  import qr from '@/assets/images/qr.png'
  import { Loading } from 'element-ui'

  export default {
    name: 'Punch',
    data() {
      const self = this
      return {
        //数据归档年份
        archiveTime: '',
        // 归档数据年份选项
        archivedYears: [],
        center: [121.59996, 31.197646],
        lng: 0,
        lat: 0,
        loaded: false,
        hamburgerParam: {
          academyW: 0,
          mainW: 24
        },
        plugin: [{
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 100,          //超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           //定位结果缓存0毫秒，默认：0
          convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true,        //显示定位按钮，默认：true
          buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
          showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true,//定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          extensions: 'all',
          pName: 'Geolocation',
          events: {
            init(o) {
              o.getCityInfo((status, result) => {
                console.log(result.center)
              })

            }
          }
        }],
        //折叠状态
        foldOpen : false,
        // 遮罩层
        loading: true,
        //二维码
        qrCode: qr,
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
        // 打卡签到表格数据
        punchList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        address: '',
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userName: undefined,
          createTime: undefined,
          year: ''
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          userName: [
            { required: true, message: '用户账号不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      // this.getList();

      this.getDicts('sys_archived_year').then(response => {
        this.archivedYears = response.data
        this.queryParams.year = response.data[0].dictValue
        this.getList()
      })
    },
    methods: {
      /** 查询打卡签到列表 */
      getList() {
        this.loading = true
        archivedList(this.queryParams).then(response => {
          this.punchList = response.rows
          this.total = response.total
          this.loading = false
        })
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
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          attendanceId: null,
          userName: null,
          location: null,
          notes: null,
          status: '0',
          delFlag: null
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },

      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      //年份选择
      handleYearClick(data) {
        this.queryParams.year = data
        this.getList()
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有打卡签到数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.exportLoading = true
          return exportArchivedPunch(queryParams)
        }).then(response => {
          this.download(response.msg)
          this.exportLoading = false
        }).catch(() => {
        })
      }

    }
  }
</script>
