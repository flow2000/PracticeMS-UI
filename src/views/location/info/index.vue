<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="查询字段" prop="searchKey">
        <el-select v-model="queryParams.searchKey" placeholder="请选择查询字段(默认全部)" clearable size="small">
          <el-option label="所有查询字段" value="allKeys" />
          <el-option label="单位名称" value="companyName" />
          <el-option label="详细地址" value="address" />
          <el-option label="联系人" value="contacts" />
          <el-option label="联系电话" value="phone" />
          <el-option label="单位性质" value="nature" />
          <el-option label="法定代表" value="leader" />
        </el-select>
      </el-form-item>

      <el-form-item label="查询字符" prop="searchValue">
        <el-input
          v-model="queryParams.searchValue"
          placeholder="请输入查询字符"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['location:info:add']"
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
          v-hasPermi="['location:info:edit']"
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
          v-hasPermi="['location:info:remove']"
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
          v-hasPermi="['location:info:export']"
        >导出</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单位名称" align="center" prop="companyName">
        <template slot-scope="scope">
          <div v-if="scope.row.companyName">
            <el-popover
              v-if="scope.row.companyName.length > 9"
              placement="top"
              trigger="hover"
            >
              <span>{{scope.row.companyName}}</span>
              <span slot="reference" style="curosr:pointer">{{scope.row.companyName.slice(0,9)+"..."}}</span>
            </el-popover>
            <div v-else>{{scope.row.companyName}}</div>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" align="center" prop="address" >
        <template slot-scope="scope">
          <div v-if="scope.row.address">
            <el-popover
              v-if="scope.row.address.length > 9"
              placement="top"
              trigger="hover"
            >
              <span>{{scope.row.address}}</span>
              <span slot="reference" style="curosr:pointer">{{scope.row.address.slice(0,9)+"..."}}</span>
            </el-popover>
            <div v-else>{{scope.row.address}}</div>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center" prop="contacts" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="单位性质" align="center" prop="nature" >
        <template slot-scope="scope">
          <div v-if="scope.row.nature">
            <el-popover
              v-if="scope.row.nature.length > 9"
              placement="top"
              trigger="hover"
            >
              <span>{{scope.row.nature}}</span>
              <span slot="reference" style="curosr:pointer">{{scope.row.nature.slice(0,9)+"..."}}</span>
            </el-popover>
            <div v-else>{{scope.row.nature}}</div>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="法定代表" align="center" prop="leader" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['location:info:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['location:info:remove']"
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

    <!-- 添加或修改地点信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单位名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" type="textarea" id="search" placeholder="请输入详细地址" />
          <div class="tip-box" id="searchTip" style="z-index: 999999;"></div>
          <el-amap class="amap-box" :amap-manager="amapManager" :vid="'amap-vue'" :zoom="zoom" :plugin="plugin" :center="center" :events="events">
            <el-amap-marker v-for="(marker, index) in markers" :position="marker" :key="index"></el-amap-marker>
          </el-amap>
        </el-form-item>
        <el-form-item label="经纬度" prop="tude" v-show="false">
          <el-input v-model="form.tude" id="tude" />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="单位性质" prop="nature">
          <el-input v-model="form.nature" placeholder="请输入单位性质" />
        </el-form-item>
        <el-form-item label="法定代表" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入法定代表" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<style lang="scss" scoped>
  .container {
    width:100%;
    height:600px;
  }

  .search-box {
    position: absolute;
    z-index: 5;
    width: 70%;
    left: 13%;
    top: 10px;
    height: 30px;
  }

  .search-box input {
    float: left;
    width: 59%;
    height: 100%;
    border: 1px solid #30ccc1;
    padding: 0 8px;
    outline: none;
  }

  .search-box button {
    float: left;
    width: 20%;
    height: 100%;
    background: #30ccc1;
    border: 1px solid #30ccc1;
    color: #fff;
    outline: none;
  }

  .tip-box {
    width: 100%;
    max-height: 260px;
    position: absolute;
    top: 30px;
    overflow-y: auto;
    background-color: #fff;
  }
</style>
<script>
import { listInfo, getInfo,exportArchivedLocationInfo, delInfo, addInfo, updateInfo, exportInfo } from "@/api/location/info";
import {AMapManager, lazyAMapApiLoaderInstance} from 'vue-amap'
import { Loading } from 'element-ui'
let amapManager = new AMapManager()
export default {
  name: "Info",
  data() {
    let self = this
    return {
      //数据归档年份
      archiveTime: '',
      // 归档数据年份选项
      archivedYears: [],
      // 导出归档数据参数
      export_archive: {
        // 是否显示弹出层（导出归档数据）
        open: false,
        // 弹出层标题（数据归档）
        title: '',
      },
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
      // 地点信息表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchKey: null,
        searchValue: null,
        year: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companyName: [
          { required: true, message: "单位名称不能为空", trigger: "blur" },
          { min: 2, max: 30, message: '单位名称长度必须介于 2 和 30 之间', trigger: 'blur' }
        ],
        address: [
          { required: true, message: "详细地址不能为空", trigger: "blur" },
          { min: 2, max: 120, message: '详细地址长度必须介于 2 和 120 之间', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码", trigger: "blur" }
        ],
        nature: [
          { required: true, message: "单位性质不能为空", trigger: "blur" }
        ],
        leader: [
          { required: true, message: "法定代表不能为空", trigger: "blur" }
        ],
      },
      address: null,
      searchKey: '',
      amapManager,
      markers: [[108.239658,22.849789],[108.242119,22.846575]],
      searchOption: {
        city: '全国',
        citylimit: true
      },
      center: [108.239658,22.849789],
      zoom: 17,
      lng: 0,
      lat: 0,
      loaded: false,
      markerEvent:{
        click(e){
          console.log("地址为:"+e);
        }
      },
      events: {
        init() {
          lazyAMapApiLoaderInstance.load().then(() => {
            self.initSearch()
          })
        },
        // 点击获取地址的数据
        click(e) {
          self.markers = []
          let {lng, lat} = e.lnglat
          self.lng = lng
          self.lat = lat
          self.center = [lng, lat]
          self.markers.push([lng, lat])
          // 这里通过高德 SDK 完成。
          let geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                // console.log(result.regeocode.aois[0].location.lat)
                // console.log(result.regeocode.aois[0].location.lng)
                // console.log("地址为:"+result.regeocode.formattedAddress)
                self.address = result.regeocode.formattedAddress
                self.searchKey = result.regeocode.formattedAddress
                self.$nextTick()
              }
            }
          })
        }
      },
      // 一些工具插件
      plugin: [
        {
          // 定位
          pName: 'Geolocation',
          events: {
            init(o) {
              // o是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  // 设置经度
                  self.lng = result.position.lng
                  // 设置维度
                  self.lat = result.position.lat
                  // 设置坐标
                  self.center = [self.lng, self.lat]
                  self.markers.push([self.lng, self.lat])
                  // load
                  self.loaded = true
                  // 页面渲染好后
                  self.$nextTick()
                }
              })
            },
            click(e){
              console.log(e);
            }
          }
        },
        {
          // 工具栏
          pName: 'ToolBar',
          events: {
            init(instance) {
              console.log(instance);
            }
          }
        },
        {
          // 鹰眼
          pName: 'OverView',
          events: {
            init(instance) {
              console.log(instance);
            }
          }
        },
        {
          // 地图类型
          pName: 'MapType',
          defaultType: 0,
          events: {
            init(instance) {
              console.log(instance);
            }
          }
        },
        {
          // 搜索
          pName: 'PlaceSearch',
          events: {
            init(instance) {
              console.log(instance)
            }
          }
        }
      ]
    };
  },
  created() {
    this.getList();

    this.getDicts('sys_archived_year').then(response => {
      this.archivedYears = response.data
    })
  },
  methods: {
    /** 查询地点信息列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 地点信息搜索 */
    initSearch() {
      let vm = this
      let map = this.amapManager.getMap()
      AMapUI.loadUI(['misc/PoiPicker'], function (PoiPicker) {
        var poiPicker = new PoiPicker({
          input: 'search',
          placeSearchOptions: {
            map: map,
            pageSize: 10
          },
          suggestContainer: 'searchTip',
          searchResultsContainer: 'searchTip'
        })
        vm.poiPicker = poiPicker
        // 监听poi选中信息
        poiPicker.on('poiPicked', function (poiResult) {
          // console.log(poiResult)
          let source = poiResult.source
          let poi = poiResult.item
          if (source !== 'search') {
            poiPicker.searchByKeyword(poi.name)
          } else {
            poiPicker.clearSearchResults()
            vm.markers = []
            let lng = poi.location.lng
            let lat = poi.location.lat
            let address = poi.cityname + poi.adname + poi.name
            vm.center = lng+","+lat
            vm.$set(vm.form,'address',address)
            vm.$set(vm.form,'tude',vm.center)
            vm.markers.push([lng, lat])
            vm.lng = lng
            vm.lat = lat
            vm.address = address
            vm.searchKey = address
          }
        })
      })
    },
    submitAddress(){
      consoel.log('经纬度',this.center)
      consoel.log('地址',this.address)
    },
    searchByHand() {
      if (this.searchKey !== '') {
        this.poiPicker.searchByKeyword(this.searchKey)
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        locationId: null,
        companyName: null,
        address: null,
        tude: null,
        contacts: null,
        phone: null,
        nature: null,
        leader: null,
        delFlag: "0",
        searchKey : null
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
      this.ids = selection.map(item => item.locationId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加地点信息";
    },
    /** 导出归档数据按钮操作 */
    exportArchive() {
      this.export_archive.title = '导出归档数据'
      this.export_archive.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const locationId = row.locationId || this.ids
      getInfo(locationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改地点信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.locationId != null) {
            updateInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then(response => {
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
      const locationIds = row.locationId || this.ids;
      const companyName = row.companyName;
      this.$confirm(companyName === undefined?'确认删除所选数据项？':"确认删除"+ companyName +"？", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInfo(locationIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有地点信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    },

    submitExportArchive() {
      if (this.archiveTime == '') {
        this.msgError('年份不能为空')
      } else {
        const queryParams = this.queryParams
        queryParams.year = this.archiveTime
        this.exportLoading = true
        const loadData = {
          spinner: 'el-icon-loading',
          text: '导出中...',
          background: 'rgba(0, 0, 0, 0.3)',
          lock: true
        }
        let loadingInstance = Loading.service(loadData)
        exportArchivedLocationInfo(queryParams).then(response => {
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close()
          })
          this.download(response.msg)
          this.export_archive.open = false
          this.archiveTime = ''
          this.exportLoading = false
        }).catch(() => {
          loadingInstance.close()                // 关闭遮罩层
          this.msgError('操作失败')
          this.export_archive.open = false
          this.archiveTime = ''
        })
      }
    }
  }
};
</script>

<style>
  .el-textarea__inner{
    height: 100px
  }
</style>
