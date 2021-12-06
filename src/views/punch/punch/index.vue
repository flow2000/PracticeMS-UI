<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="时间" prop="creatTimee">
        <el-date-picker clearable size="small"
                        v-model="queryParams.createTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="状态" prop="status">-->
<!--        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">-->
<!--          <el-option label="请选择字典生成" value="" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item style="margin-left: 50%">
        <el-image :src="qrCode" style="float: right;width: 100px; height: 100px"></el-image>
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
        >导出</el-button>
      </el-col>


      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="punchList"  border @selection-change="handleSelectionChange">
      <el-table-column label="序号" type="index" align="center"  width="50px" height="30">
      </el-table-column>
      <el-table-column label="学号" align="center" prop="userName" />
      <el-table-column label="姓名" align="center" prop="user.nickName" />
      <el-table-column label="打卡时间" align="center" prop="createTime" />
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
                >{{ scope.row.status =='0' ? "打卡成功":"打卡失败" }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
<!--      <el-table-column label="状态" align="center" prop="status" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['punch:punch:edit']"
          >修改</el-button>
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

    <!-- 添加或修改打卡签到对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学号" prop="userName">
          <el-input :disabled="true" v-model="form.userName" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="打卡状态" v-hasPermi="['punch:punch:edit']">
          <el-radio-group v-model="form.status">
            <el-radio-button
              v-hasPermi="['system:notice:edit']"
              v-for="dict in [
                  {value: '0',label:'打卡成功'},
                  {value: '1',label:'打卡失败'}]"
              :key="dict.value"
              v-model="dict.value"
              :label="dict.label"
            ></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
<!--        <el-form-item label="状态">-->
<!--          <el-radio-group v-model="form.status">-->
<!--            <el-radio label="1">请选择字典生成</el-radio>-->
<!--            <el-radio label="2">请选择字典生成</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="删除标志" prop="delFlag">-->
<!--          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import { listPunch, exportArchivedPunch,getPunch, delPunch, addPunch, updatePunch, exportPunch } from "@/api/punch/punch";
  import qr from '@/assets/images/qr.png'
  import { Loading } from 'element-ui'

export default {
  name: "Punch",
  data() {
    const self = this;
      return {
        //数据归档年份
        archiveTime: '',
        // 归档数据年份选项
        archivedYears: [],
        center: [121.59996, 31.197646],
        lng: 0,
        lat: 0,
        loaded: false,
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
          zoomToAccuracy:true,//定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          extensions:'all',
          pName: 'Geolocation',
          events: {
            init(o) {
              o.getCityInfo((status, result) => {
                console.log(result.center)
              })

              // o 是高德地图定位插件实例
              // o.getCurrentPosition((status, result) => {
              //   console.log(result)
              //   if (result && result.position) {
              //     self.lng = result.position.lng;
              //     self.lat = result.position.lat;
              //     self.center = [self.lng, self.lat];
              //     self.loaded = true;
              //     self.$nextTick();
              //   }
              // });
            }
          }
        }],


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
      title: "",
      // 是否显示弹出层
      open: false,
      address:'',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createTime: null,
        year: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户账号不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();

    this.getDicts('sys_archived_year').then(response => {
      this.archivedYears = response.data
    })
  },
  methods: {
    getLocation() {
      const self = this
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
        })

        geolocation.getCurrentPosition()
        // localStorage.address='undefined'
        // console.log("删除了addrss的local")
        AMap.event.addListener(geolocation, 'complete', onComplete);
        AMap.event.addListener(geolocation, 'error', onError);
        function onComplete(data) {
          // data是具体的定位信息
          // this.address=data.formattedAddress
          // // this.$set(this.address,data.formattedAddress)
          // console.log('函数中定位成功信息：', this.address);
          // addPunch(this.address).then((response) => {
          //   if(response.code ==200){
          //     alert("打卡成功")
          //   }
          //    console.log(response)
          //   // this.msgSuccess("打卡成功");
          //   // this.open = false;
          //   // this.getList();
          // })
          // console.log("我来了"+data.formattedAddress)
          // console.log(localStorage.address)
            localStorage.address= data.formattedAddress;
          // this.address = data.formattedAddress;
        }

        function onError(data) {
          // 定位出错
          // console.log('定位失败错误：', data);
          // 调用ip定位
          self.getLngLatLocation();
        }
      })

    },
    getLngLatLocation() {
      AMap.plugin('AMap.CitySearch', function () {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // 查询成功，result即为当前所在城市信息
            // console.log('通过ip获取当前城市：', result)
            //逆向地理编码
            AMap.plugin('AMap.Geocoder', function () {
              var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: result.adcode
              })

              var lnglat = result.rectangle.split(';')[0].split(',');
              geocoder.getAddress(lnglat, function (status, data) {
                if (status === 'complete' && data.info === 'OK') {
                  // result为对应的地理位置详细信息
                  localStorage.address= data.regeocode.formattedAddress;
                  // console.log(localStorage.address)
                }
              })
            })
          }
        })
      })
    },
    /** 查询打卡签到列表 */
    getList() {
      this.loading = true;
      listPunch(this.queryParams).then(response => {
        this.punchList = response.rows;
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
        attendanceId: null,
        userName: null,
        location: null,
        notes: null,
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
      this.ids = selection.map(item => item.attendanceId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.getLocation()
       if(localStorage.address!='undefined'){
         console.log(localStorage.address)
         addPunch(localStorage.address).then((response) => {
           console.log(localStorage.address)
           if(response.code==200){
             this.msgSuccess("打卡成功");
             this.open = false;
             this.getList();
           }else{
             this.msgSuccess("当天已打卡");
             this.open = false;
             this.getList();
           }

         })
       }

      // addPunch(this.getLocation()).then((response) => {
      //   this.msgSuccess("打卡成功");
      //   this.open = false;
      //   this.getList();
      // })
      // this.getLocation()
      // console.log("添加的地址是"+this.address)
       // if(address == 'undefined'){
       //   return;
       //   address = this.getLocation()
       // }
      // console.log(address)
      // addPunch(this.address).then((response) => {
      //   this.msgSuccess("打卡成功");
      //   this.open = false;
      //   this.getList();
      // })
      // this.$confirm('确认签到', "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // }).then(function() {
      //   getLocation()
      //   return addPunch()
      // }).then(() => {
      //   this.getList();
      //   this.msgSuccess("添加成功");
      // }).catch(() => {});
      // this.reset();
      // this.open = true;

      // this.title = "今日打卡";
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const attendanceId = row.attendanceId || this.ids
      getPunch(attendanceId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改打卡签到";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.attendanceId != null) {
            updatePunch(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPunch(this.form).then(response => {
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
      const attendanceIds = row.attendanceId || this.ids;
      this.$confirm('是否确认删除打卡签到编号为"' + attendanceIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPunch(attendanceIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有打卡签到数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportPunch(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    },


  }
};
</script>
