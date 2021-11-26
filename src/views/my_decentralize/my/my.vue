<template>
  <div class="app-container">

    <el-steps v-if="(practiceInfo.info == null  && practiceInfo.status == 0)  || (practiceInfo.location == null && (practiceInfo.status == 1 || practiceInfo.status == 2) ) ||  practiceInfo.status == 3" :active="practiceInfo.status" finish-status="success" simple style="margin-top: 20px">
      <el-step title="已提交" ></el-step>
      <el-step title="审核中" ></el-step>
      <el-step v-if="practiceInfo.status != 3" title="已通过" ></el-step>
      <el-step v-if="practiceInfo.status == 3" title="已拒绝" ></el-step>
    </el-steps>

  <el-descriptions v-if="(practiceInfo.info != null || practiceInfo.location != null) &&  practiceInfo.status != 3" class="margin-top" title="实习基本信息" :column="3" :size="size" border>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        姓名
      </template>
      <span v-if="practiceInfo.user != null">{{ practiceInfo.user.nickName }}</span>
      <span v-if="practiceInfo.student != null">{{ practiceInfo.student.nickName }}</span>
      <span v-if="practiceInfo == null">暂无</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        手机号
      </template>
      <span v-if="practiceInfo.user != null">{{ practiceInfo.user.phonenumber }}</span>
      <span v-if="practiceInfo.student != null">{{ practiceInfo.student.phonenumber }}</span>
      <span v-if="practiceInfo == null ">暂无</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-location-outline"></i>
        指导老师
      </template>
      <span v-if="practiceInfo.info != null && practiceInfo.info.teacher != null">{{ practiceInfo.info.teacher.nickName }}</span>
      <span v-if="practiceInfo.info != null && practiceInfo.info.teacher == null">暂无</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-office-building"></i>
        实习单位
      </template>
      <span v-if="practiceInfo.info != null">{{ practiceInfo.info.baseInfo.baseName }}</span>
      <span v-if="practiceInfo.location != null">{{ practiceInfo.location.companyName }}</span>
      <span v-if="practiceInfo.info == null && practiceInfo.location == null">暂无</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-tickets"></i>
        实习岗位
      </template>
      <span v-if="practiceInfo.info != null">{{ practiceInfo.info.postName }}</span>
      <span v-if="practiceInfo.info == null && practiceInfo.location == null">暂无</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-office-building"></i>
        实习详细地点
      </template>
      <span v-if="practiceInfo.info != null">{{ practiceInfo.info.baseInfo.baseAddress }}</span>
      <span v-if="practiceInfo.location != null">{{ practiceInfo.location.address }}</span>
      <span v-if="practiceInfo.info == null && practiceInfo.location == null">暂无</span>
    </el-descriptions-item>
  </el-descriptions>

    <div v-if="practiceInfo.info == null && practiceInfo.location == null && this.prePracticeInfo.length == 0"><span>您还未进行实习，<el-button type="text" @click="dialogVisible = true">点击此处</el-button>申请分散实习</span></div>
    <div v-if="practiceInfo.status == 3"><span>您的申请被拒绝，拒绝理由：{{practiceInfo.notes}}，<el-button type="text" @click="dialogVisible = true">点击此处</el-button>重新申请分散实习</span></div>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px" v-if="(practiceInfo.info == null && practiceInfo.location == null && this.prePracticeInfo.length == 0) || practiceInfo.status == 3">
        <el-form-item label="学生编号" prop="userId" v-show="false">
          <el-input v-model="this.practiceInfo.student.userId" placeholder="请输入实习学生编号" :disabled="true" />
        </el-form-item>
        <el-form-item label="学号" prop="userName" >
          <el-input v-model="practiceInfo.student.userName" placeholder="请输入实习学生学号" :disabled="true" />
        </el-form-item>
        <el-form-item label="姓名" prop="nickName" >
          <el-input v-model="practiceInfo.student.nickName" placeholder="请输入实习姓名" :disabled="true" />
        </el-form-item>
        <el-form-item label="单位名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item label="所属地区" prop="province">
          <el-col :span="12" style="width: 100%;">
              <el-cascader v-model="form.province" style="width: 100%;" placeholder="可搜索" :options="citys" filterable clearable @change="handleChangeArea">
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
          </el-col>
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
        <el-form-item label="实习单位联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入实习单位联系人" />
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
        <el-form-item label="经营范围" prop="businessScope">
          <el-input v-model="form.businessScope" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="实习证明" prop="acceptanceCertificate">
          <!--    上传分散实习证明      -->
          <el-upload
            v-if="practiceInfo.info == null"
            class="upload-demo"
            ref="upload"
            accept=".pdf"
            :file-list="upload.SummaryFileList"
            :headers="upload.headers"
            :action="upload.CertificateUrl"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :show-file-list="true"
            :auto-upload="false"
            :data="{companyName:form.companyName,address:form.address,
            tude:form.tude,contacts:form.contacts,phone:form.phone,
            nature:form.nature,leader:form.leader,flag:remark,
            businessScope:form.businessScope,stuId:practiceInfo.student.userId,nickName:practiceInfo.student.nickName}"
            multiple
          >
            <i class="el-icon-upload"></i>
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传PDF文件，且不超过10M</div>
          </el-upload>

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
import { getStudentPracticeInfo } from "@/api/decentralize/decentralize";
import { getToken} from "@/utils/auth";
import { regionData, CodeToText } from 'element-china-area-data'
import {AMapManager, lazyAMapApiLoaderInstance} from 'vue-amap'
let amapManager = new AMapManager()

export default {
  data() {
    let self = this
    return {
      size: '',
      practiceInfo : [],
      prePracticeInfo : [],
      dialogVisible: false,
      remark : null,
      form : {
        businessScope:''
      },
      title: "",
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: {
          Authorization: "Bearer " + getToken()
        },
        // 上传的地址
        CertificateUrl: process.env.VUE_APP_BASE_API + "/decentralize/decentralize/uploadCertificate",
        // 上传的文件列表
        AppraisalFileList: [],
        SummaryFileList: [],
        //传递文件所需要用到的参数 姓名
        nick_name:"",
        // 学号
        user_id:"",
        //成绩编号
        scoreId:""
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
      ],
      kuaidi: {
        name: '',
        departmentName: '',
        attribute: '',
        destinationCity: '',
        addressee: '',
        consigneeAddress: '',
        expressCompany: '',
        courierNumber: '',
      },
      rules: {
        attribute: [
          { required: true, message: '请选择快递属性', trigger: 'change' }
        ],
        destinationCity: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        addressee: [
          { required: true, message: '请输入收件单位', trigger: 'blur' }
        ],
        consigneeAddress: [
          { required: true, message: '请输入收件地址', trigger: 'blur' }
        ],
        expressCompany: [
          { required: true, message: '请输入快递公司', trigger: 'blur' }
        ],
        courierNumber: [
          { required: true, message: '请输入快递单号', trigger: 'blur' }
        ],
      },
      attributeList: ['客户', '供应商', '其他'],
      citys: regionData,
    }
  },
  created() {
    this.getStudentPracticeInfo()
  },
  methods: {
    /** 查询学生实习信息 */
    getStudentPracticeInfo() {
      this.loading = true;
      getStudentPracticeInfo().then(response => {
        this.practiceInfo = response.data;
        console.log(this.practiceInfo)
        if(this.practiceInfo.location != null) this.practiceInfo.status = parseInt(this.practiceInfo.status)
        if(response.data.status == '1'){
          this.prePracticeInfo = response.data;
          this.practiceInfo.info = null
          this.practiceInfo.location = null
        }
        if(response.data.status == '3'){
          this.remark = "reset";
        }
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
    // 取消按钮
    cancel() {
      this.dialogVisible = false;
      this.getStudentPracticeInfo();
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
    searchByHand() {
      if (this.searchKey !== '') {
        this.poiPicker.searchByKeyword(this.searchKey)
      }
    },
    /** 提交上传按钮 */
    submitForm() {
      this.form.address = this.kuaidi.destinationCity + this.form.address;
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$refs.upload.submit();
        }
      });
      this.cancel();
    },
    handleChangeArea(value) {
      let cityNames = []
      value.forEach(e => {
        cityNames.push(CodeToText[e])
      });
      this.kuaidi.destinationCity = cityNames.join('')
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.isUploading = false;
      this.form.filePath = response.url;
      this.msgSuccess(response.msg);
    },
  }
}

</script>
