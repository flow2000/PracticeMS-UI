<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="实习地点" prop="locationName">
        <el-input
          v-model="queryParams.locationName"
          placeholder="请输入地点名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="岗位名称" prop="postName">
        <el-input
          v-model="queryParams.postName"
          placeholder="请输入岗位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实习人数" prop="number">
        <el-input
          v-model="queryParams.number"
          placeholder="请输入实习人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
	  <el-form-item label="指导老师" prop="teacherName">
	    <el-input
	      v-model="queryParams.teacherName"
	      placeholder="请输入指导老师姓名"
	      clearable
	      size="small"
	      @keyup.enter.native="handleQuery"
	    />
	  </el-form-item>
      <el-form-item label="进点时间" prop="entryTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.entryTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择进点时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="启用" value="0" />
		  <el-option label="停用" value="1" />
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
          v-hasPermi="['practice-info:practiceInfo:add']"
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
          v-hasPermi="['practice-info:practiceInfo:edit']"
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
          v-hasPermi="['practice-info:practiceInfo:remove']"
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
          v-hasPermi="['practice-info:practiceInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="practiceInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="25" align="center" />
      <el-table-column label="实习信息ID" align="center" prop="infoId" />
      <el-table-column label="实习地点" align="center" prop="baseInfo.baseName" />
      <el-table-column label="岗位名称" align="center" prop="postName" />
      <el-table-column label="实习人数" align="center" prop="number" />
	  <el-table-column label="岗位余量" align="center" prop="surplus" />
      <el-table-column label="进点时间" align="center" prop="entryTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.entryTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
		  <template slot-scope="scope">
		    <span v-show="scope.row.status == 0">启用</span>
			<span v-show="scope.row.status == 1">禁用</span>
		  </template>
	  </el-table-column>
      <el-table-column label="指导老师" align="center" prop="teacher.nickName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['practice-info:practiceInfo:edit']"
          >修改</el-button>
		  <el-button
		    size="mini"
		    type="text"
		    icon="el-icon-s-grid"
		    @click="handleDelete(scope.row)"
		  >分配</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['practice-info:practiceInfo:remove']"
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

    <!-- 添加或修改实习信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="地点ID" prop="locationId">
          <el-input v-model="form.locationId" placeholder="请输入地点ID" />
          <el-button type="text" @click="openMap()">获取实习基地信息</el-button>
          <el-dialog
            title="地址选择"
            :visible.sync="dialogVisible"
            width="80%"
            :append-to-body='true'
            :before-close="handleClose">
            <div id="my_container"></div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
          </el-dialog>
        </el-form-item>

        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="实习人数" prop="number">
          <el-input v-model="form.number" placeholder="请输入实习人数" />
        </el-form-item>
		<el-form-item label="岗位余量" v-if="this.title =='添加实习信息' ">
		  <el-input v-model="form.number" :disabled="true" />
		</el-form-item>
		<el-form-item label="岗位余量" v-if="this.title =='修改实习信息' ">
		  <el-input v-model="form.surplus" :disabled="true" />
		</el-form-item>
        <el-form-item label="进点时间" prop="entryTime">
          <el-date-picker clearable size="small"
            v-model="form.entryTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择进点时间">
          </el-date-picker>
        </el-form-item>
		<el-form-item label="指导老师" prop="teacherId">
		  <el-select v-model="form.teacherId" filterable placeholder="请选择">
		      <el-option
		        v-for="item in teachers"
		        :key="item.value"
		        :label="item.label"
		        :value="item.value">
		      </el-option>
		    </el-select>
		</el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="0">启用</el-radio>
			<el-radio label="1">禁用</el-radio>
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

<style scoped>
#my_container {
  height: 500px;
}

/**
* 信息窗口主体
*/
.infoWindow {
  position: relative !important;
  box-shadow: none;
  bottom: 0;
  left: 0;
  width: 15.75rem;
  height: 13.5rem;
  padding: 0;
  color: #fff;
  font-size: 12px;
}

/**
* 信息窗口外壳
*/
.amap-info-contentContainer .amap-info-sharp {
  border-top: 8px solid rgba(0, 44, 71, .5);
}

/**
* 信息窗口箭头
*/
.amap-info-content {
  background-color: rgba(0, 44, 71, .5);
}

/**
* 关闭按钮
*/
.amap-info-close {
  right: 10px;
  color: #fff;
}

#my_container .amap-marker-label {
  border: 0 none;
  background-color: #fff;
  white-space: nowrap;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, .3);
  border-radius: 5px;
}

#my_container .amap-marker-label:after {
  position: absolute;
  border: 5px solid transparent;
  border-top-color: #fff;
  top: 19px;
  left: 43%;
  content: '';
  width: 0;
  height: 0;
}

.icon-s {
  display: block;
  margin: 0 auto;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 40px;
  border-top-color: red;
  border-right-color: blue;
  border-bottom-color: yellow;
  border-left-color: black;
}

</style>

<script>
import { listPracticeInfo, getPracticeInfo, delPracticeInfo,listTeacherInfo, addPracticeInfo, updatePracticeInfo, exportPracticeInfo } from "@/api/practice-info/practiceInfo";
import { getBaseTude } from '@/api/system/baseInfo'
export default {
  name: "PracticeInfo",
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
	  //指导老师数
	  ttotal : 0 ,
      // 实习信息表格数据
      practiceInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 实习人数字典
      numberOptions: [],
	  //指导老师
	  teachers : [],
        value: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        locationId: null,
        postName: null,
        number: null,
		surplus: null,
        entryTime: null,
        status: null,
        teacherId: null,
		locationName : null,
		teacherName : null
	  },
	  userQueryParams : {
		  roleName : null
	  },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        locationId: [
          { required: true, message: "地点ID不能为空", trigger: "blur" }
        ],
        postName: [
          { required: true, message: "岗位名称不能为空", trigger: "blur" }
        ],
        number: [
          { required: true, message: "实习人数不能为空", trigger: "blur" }
        ],
        entryTime: [
          { required: true, message: "进点时间不能为空", trigger: "blur" }
        ],
        teacherId: [
          { required: true, message: "指导老师不能为空", trigger: "change" }
        ]
      },
      dialogVisible: false,
      ruleForm: {
        name: '',
        phone: '',
        addr: '',
        long: '',
        lat: '',
        start_work_time: '',
        end_work_time: ''
      }
    }
  },
  created() {
    this.getList();
	  this.getTeacherList();
    this.getDicts("sys_show_hide").then(response => {
      this.numberOptions = response.data;
    });
  },
  methods: {
    /** 查询实习信息列表 */
    openMap(){
      this.dialogVisible = true
      var that = this
      this.$nextTick(function () {
        this.initMap(that)
      })
    },
    getList() {
      this.loading = true;
      listPracticeInfo(this.queryParams).then(response => {
        this.practiceInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
	getTeacherList() {
	  this.loading = true;
	  this.userQueryParams.roleName = 'teacher'
	  listTeacherInfo(this.userQueryParams).then(response => {
	    this.teachers = response.rows;
	    this.ttotal = response.total;
		var param = '[{'+'"value" : "'+response.rows[0].userId+'","label" : "' + response.rows[0].nickName + '"}'
		for(var i = 1 ; i < this.ttotal ; i++){
			param += ',{'+'"value" : "'+response.rows[i].userId+'","label" : "' + response.rows[i].nickName + '"}'
		}
		param += ']'
		console.log(param)
		var dataMap = JSON.parse(param);  //这是一个json数组 ，原数组
		var optionArr = [];  //定义一个数组用来存放
	　　/* dataMap.map((item,index)=>{    //  把原数组循环一下
	　　　　 optionArr.push(
	　　　　　　Object.assign(item,{value:response.rows[index].userId , label:response.rows[index].nickName })     //  数组的每一行添加一个 disabled:'true'  属性
	　　　　)
		}); */
		optionArr.push(dataMap)
		console.log(optionArr[0])
		this.teachers = optionArr[0]
	    this.loading = false;
	  });
	},
	dataFilter(val){
		this.value=val
		if(val){
			this.options=this.optionsCopy.filter((item=>{
				if (!!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
					return true
				}
			}))
		}else{
			this.options=this.optionsCopy
		}
	},
    // 实习人数字典翻译
    numberFormat(row, column) {
      return this.selectDictLabel(this.numberOptions, row.number);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        infoId: null,
        locationId: null,
        postName: null,
        number: null,
		surplus: null,
        entryTime: null,
        status: "0",
        delFlag: null,
        teacherId: null
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
      this.ids = selection.map(item => item.infoId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加实习信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const infoId = row.infoId || this.ids
      getPracticeInfo(infoId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改实习信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.infoId != null) {
            updatePracticeInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPracticeInfo(this.form).then(response => {
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
      const infoIds = row.infoId || this.ids;
      this.$confirm('是否确认删除实习信息编号为"' + infoIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPracticeInfo(infoIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有实习信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportPracticeInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    },
    initMap(that) {
      let markers = [] // 点聚合数组
      // console.log(that.companyNames)
      var map = new AMap.Map('my_container', {
        resizeEnable: true,
        zoom: 8,
        center: [108.365386, 22.843292] // 中心点坐标,广西民族大学
      })
      AMap.plugin('AMap.Geolocation', function() { //异步加载插件
        var geolocation = new AMap.Geolocation()
        map.addControl(geolocation)
      })

      initBaseInfo(that);
      initMarkerClusterer();
      function initBaseInfo(that){
        getBaseTude().then(response => {
          var i = 0
          var lonlats = []
          var companyNames = []
          for (; i < response.data.length; i++) {
            var str = response.data[i].tude.split(',')
            // var strComs = response.data[i].companyName.split(',')
            //产生经纬度数组
            var tude = [];
            var name = [];
            var longit = parseFloat(str[0])
            var lat = parseFloat(str[1])
            tude.push(longit)
            tude.push(lat)
            lonlats.push(tude)
            companyNames.push(response.data[i].companyName)
          }
          console.log(companyNames)
          console.log(lonlats)

          // let lonlat = [[108.365386, 22.843292], [108.238089, 22.848063], [108.244248, 22.852298]]
          for (let i = 0; i < lonlats.length; i++) {
            //获得地点信息
            var geocoder = new AMap.Geocoder({
              /// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
              radius: 10
            })
            geocoder.getAddress(lonlats[i], function(status, result) {
              // console.log(status,result)
              if (status === 'complete' && result.info === 'OK') {
                // result为对应的地理位置详细信息
                //             console.log(result.regeocode.formattedAddress)
                customMark(lonlats[i][0], lonlats[i][1], companyNames[i])
                // console.log(address)
                // this.addresses = address
              }
            })
            // console.log(this.addresses)
            //添加标记
            // customMark(lonlat[i][0],lonlat[i][1],address)
          }
          // initMarkerClusterer()
          // cluster.setMaxZoom(15);
// 添加自定义标记
          function customMark(longit, lat, title) {
            // let lonlat = [108.365386,22.843292];
            // 创建 AMap.Icon 实例：
            let icon = new AMap.Icon({
              size: new AMap.Size(58, 70),    // 图标尺寸
              image: 'http://chuyinweilai.store/apk/location.png',  // Icon的图像
              imageSize: new AMap.Size(28, 30)   // 根据所设置的大小拉伸或压缩图片
            })

            // 将 Icon 实例添加到 marker 上:
            let marker = new AMap.Marker({
              position: new AMap.LngLat(longit, lat),
              offset: new AMap.Pixel(-10, -10),
              icon: icon, // 添加 Icon 实例
              title: '实习地点：'+title,
              zoom: 13
            })
            var msg_label =
              '<div style="border-radius:200px;background: #00afff"></div><span >'+title+'</span></div>'

            marker.setLabel({
              offset: new AMap.Pixel(20, -10), //显示位置
              content: msg_label //显示内容
            })
            marker.on('mouseover', function(e) {
              marker.setTop(true)
            })
            marker.on('mouseout', function() {
              marker.setTop(false)
            })

            // var lonlat=longit+","+lat
            // markerEvent(marker,lonlat)
            map.add(marker)

            markers.push(marker)
          }

          // markerEvent在创建点标记后调用，这里不写了
          function markerEvent(marker, lonlats) {
            // AMap.event.addListener(marker, 'click', function () {
            //   openInfo(marker, lonlat);
            // })
          }

// 初始化点聚合k
          function initMarkerClusterer() {
            //添加聚合组件
            map.plugin(['AMap.MarkerClusterer'], function() {
              var cluster = new AMap.MarkerClusterer(
                map,     // 地图实例
                markers)
              cluster.setMaxZoom(12)
            })
          }

// 添加点标记至点聚合中
          function addMarkerClusterer() {
            // let lonlat = [Math.random() + 113, Math.random() + 23]
            // console.log(lonlat)
            // 创建 AMap.Icon 实例：
            let icon = new AMap.Icon({
              size: new AMap.Size(58, 70),    // 图标尺寸
              image: 'http://chuyinweilai.store/apk/index_calen.png',  // Icon的图像
              imageSize: new AMap.Size(58, 70)   // 根据所设置的大小拉伸或压缩图片
            })

            // 将 Icon 实例添加到 marker 上:
            let marker = new AMap.Marker({
              position: new AMap.LngLat(lonlats[0], lonlats[1]),
              offset: new AMap.Pixel(-10, -10),
              icon: icon, // 添加 Icon 实例
              title: "111",
              zoom: 13
            })
            markerEvent(marker, lonlats)
            cluster.addMarker(marker)
          }

          var geocoder, marker
          // function regeocoder(lnglatXY,that) {
          //   AMap.plugin('AMap.Geocoder',function(){
          //     var geocoder = new AMap.Geocoder({
          //       radius: 1000,
          //       extensions: "all"
          //     });
          //     var address;
          //     geocoder.getAddress(lnglatXY, function(status, result) {
          //       if (status === 'complete' && result.info === 'OK') {
          //         address = result.regeocode.formattedAddress;
          //         console.log("address"+address)
          //         that.ruleForm.addr = address
          //       }
          //     });
          //     if(!marker){
          //       var marker = new AMap.Marker({
          //         position: new AMap.LngLat(113.397428, 23.2,112.397428, 23.2),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          //         title: '默认图标'
          //       });
          //       var msg_label = '<span>'+ "测试"+'</span>';
          //       marker.setLabel({
          //         offset: new AMap.Pixel(20, -10), //显示位置
          //         content: msg_label //显示内容
          //       });
          //       var msg_title = '测试使用的title';
          //       marker.setTitle(msg_title);
          //       marker.on("mouseover", function(e) {
          //         marker.setTop(true);
          //       });
          //       marker.on("mouseout", function() {
          //         marker.setTop(false);
          //       });
          //       map.add(marker);
          //     }
          //     // marker.setMap(mapObj);
          //     marker.setPosition(lnglatXY);
          //   })
          // }
          // var that = this
          // map.on('click', function(e) {
          //   var lnglatXY = [e.lnglat.getLng(),e.lnglat.getLat()];
          //   regeocoder(lnglatXY,that)
          //   that.ruleForm.long = e.lnglat.getLng()
          //   that.ruleForm.lat = e.lnglat.getLat()
          // });
        })
      }

      function initMarkerClusterer() {
        //添加聚合组件
        map.plugin(['AMap.MarkerClusterer'], function() {
          var cluster = AMap.MarkerClusterer(
            map,     // 地图实例
            markers)
          cluster.setMaxZoom(12)
        })
      }

    }
  }
};
</script>

