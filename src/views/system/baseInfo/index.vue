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
      <!--联系电话-->
      <!--<el-form-item label="联系电话" prop="basePhone">
        <el-input
          v-model="queryParams.basePhone"
          placeholder="请输入联系电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
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
      <!--基地状态-->
      <!--<el-form-item label="基地状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择基地状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>-->
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
      <!--<el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入</el-button>
      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!--展示列-->
    <el-table v-loading="loading" :data="baseInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />

      <!--<el-table-column label="基地ID" align="center" key="baseId" prop="baseId" />-->
      <el-table-column label="基地名称" align="center" prop="baseName" />
      <el-table-column label="基地单位性质" align="center" prop="baseNature" />
      <el-table-column label="基地联系人" align="center" prop="baseContacts" />
      <el-table-column label="基地联系电话" align="center" prop="basePhone" />
      <el-table-column label="学校基地负责人" align="center" prop="schoolLeader" />
      <el-table-column label="学校基地联系电话" align="center" prop="schoolPhone" />

      <el-table-column label="启用/停用" align="center" key="status" >
        <template slot-scope="scope" style="min-width: 100px">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"

          ></el-switch>
          <div v-if="scope.row.status==='0'" le="height: 60px">
            已启用
          </div>
          <div v-else >
            已停用
          </div>
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
          <el-button
            size="mini"
            type="text"
            icon=""
            @click="handleCheckPdf(scope.row)"
          >查看申请表</el-button>
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
          <el-input v-model="form.baseAddress" type="textarea" id="search" placeholder="请输入基地单位地址" />
          <div class="tip-box" id="searchTip" style="z-index: 999999;"></div>
          <el-amap class="amap-box" :amap-manager="amapManager" :vid="'amap-vue'" :zoom="zoom" :plugin="plugin" :center="center" :events="events">
            <el-amap-marker v-for="(marker, index) in markers" :position="marker" :key="index"></el-amap-marker>
          </el-amap>
        </el-form-item>

        <!--<el-form-item label="基地单位地址" prop="baseAddress">
          <el-input v-model="form.baseAddress" type="textarea" placeholder="请输入内容" />
        </el-form-item>-->
        <el-form-item label="地点经纬度" prop="tude">
          <el-input v-model="form.tude" placeholder="请输入地点经纬度" />
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
        <el-form-item label="上传基地申请表">
          <el-upload ref="upload"
                     :file-list="upload.fileList"
                     :action="upload.formUrl"
                     :headers="upload.headers"
                     :limit="1"
                     :on-progress="handleFileUploadProgress"
                     :on-success="handleFileSuccess"
                     accept=".pdf"
                     data="{}"
          >
            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传不超过 50MB 的.pdf文件</div>
          </el-upload>
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
    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="500px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- pdf申请表查看 -->
    <el-dialog :title="pdf.title" :visible.sync="pdf.open" width="1000px" append-to-body>
      <pdf
        ref="pdf"
        :src="pdf.pdfUrl">
      </pdf>

    </el-dialog>

  </div>
</template>

<script>
  import { listBaseInfo, getBaseInfo, delBaseInfo, addBaseInfo, updateBaseInfo, exportBaseInfo,changeBaseStatus } from "@/api/system/baseInfo";
  import { getToken } from "@/utils/auth";
  import { importTemplate } from "@/api/system/user";
  import pdf from 'vue-pdf';
  import {AMapManager, lazyAMapApiLoaderInstance} from 'vue-amap'
  let amapManager = new AMapManager()
  export default {
    name: "BaseInfo",
    components:{
      pdf
    },
    data() {
      let self = this
      return {
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          formUrl: process.env.VUE_APP_BASE_API + "/system/baseInfo/appliForms",
          tableUrl: process.env.VUE_APP_BASE_API + "/system/baseInfo/importData",
          // 上传的文件列表
          fileList: []
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
        // 基地信息管理表格数据
        baseInfoList: [],
        // pdf页面
        pdf:{
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          pdfUrl:""
        },
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
          tude:null,
          baseEmail: null,
          schoolLeader: null,
          schoolPhone: null,
          status: null,
          appliForm:null,
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
          baseAddress: [
            { required: true, message: "基地单位地址不能为空", trigger: "blur" }
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
          console.log(this.baseInfoList)
          this.total = response.total;
          console.log(this.total)
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
              vm.$set(vm.form,'baseAddress',address)
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
          tude:null,
          baseEmail: null,
          schoolLeader: null,
          schoolPhone: null,
          baseIntroduction: null,
          practiceEnvironment: null,
          status: "0",
          appliForm:null,
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
        this.upload.fileList = [];
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const baseId = row.baseId || this.ids
        getBaseInfo(baseId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改基地信息管理";
          if(this.form.appliForm!==""&&this.form.appliForm!==null){
            let arr=this.form.appliForm.split("/");
            this.upload.fileList = [{name:arr[arr.length-1],url:this.form.appliForm }];
          }
          else this.upload.fileList = [];
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
      /** 查看pdf申请表操作 */
      handleCheckPdf(row){
        const baseId = row.baseId || this.ids
        getBaseInfo(baseId).then(response => {
          console.log(response.data.appliForm)
          if (response.data.appliForm!==""&&response.data.appliForm!==null)
          {
            this.pdf.pdfUrl=response.data.appliForm
            this.pdf.open=true
          }
          else this.msgError("没有找到该申请表")
        });
      },
      // 文件提交处理
      submitUpload(file) {
        let isRightSize = file.size / 1024 / 1024 < 50
        if (!isRightSize) {
          this.$message.error('文件大小超过 50MB')
        }
        let isAccept = new RegExp('.pdf').test(file.type)
        if (!isAccept) {
          this.$message.error('应该选择.pdf类型的文件')
        }
        if(isRightSize && isAccept) this.$refs.upload.submit();
        else return false;
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.form.appliForm = process.env.VUE_APP_BASE_API + "/system/baseInfo/appliForms/"+file.name;
        this.msgSuccess(response.msg);
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
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
      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = "基地信息导入";
        this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
        importTemplate().then(response => {
          this.download(response.msg);
        });
      },

    }
  };

</script>
