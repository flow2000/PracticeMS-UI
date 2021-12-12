<template>
  <div id="magicalDragScene" class="mc-root mc-ui-absolute-pane"
       style="height: 900px;min-width: 1500px;
              background-image:linear-gradient(rgba(3,99,194,0.97),rgba(1,20,56,0.95) )" >
    <div id="main-panle" class="mc-ui-grid-pane" style="height: 850px; width: auto;margin:0.5%;margin-top:0;min-width: 1500px">
      <!--公告详细信息-->
      <el-dialog
        title="系统通知"
        :visible.sync="noticeDetail.visible"
        width="35%"
      >
        <p style="text-align: center;font-size: 20px;margin-top: 0">{{noticeDetail.title}}</p>
        <div style="font-size: 15px;color: #717171;
        width: 50%;float: left;
        text-align: left;padding-left: 5%">
          发布者：{{noticeDetail.publisher}}
        </div>
        <div style="font-size: 15px;color: #717171;
        width: 50%;float: right;
        text-align: right;;padding-right: 5%">
          发布时间：{{noticeDetail.updateTime}}
        </div>
        <br />
        <div style="font-size: 16px;padding: 5% 10%" v-html="noticeDetail.content"></div>
      </el-dialog>
      <!--所有公告一览-->
      <el-drawer
        title="系统通知"
        :visible.sync="allNotice.visible"
      >
        <el-collapse class="allNotice" accordion>
          <el-collapse-item v-for="item in noticeList" :title="'['+[(item.updateTime.split(' '))[0]]+'] '+item.noticeTitle">

            <div style="font-size: 12px;color: #717171;
        width: 50%;float: left;
        text-align: left;">
              发布者：{{item.nickname}}
            </div>
            <div style="font-size: 12px;color: #717171;
        width: 50%;float: right;
        text-align: right;">
              发布时间：{{item.updateTime}}
            </div>
            <br/>
            <div style="font-size: 12px;padding: 0% 2%" v-html="item.noticeContent"></div>
          </el-collapse-item>
        </el-collapse>
      </el-drawer>

      <!--实习学生人数情况-->
      <div class="mc-ui-grid-item left-top">

        <div class="stuCounts">
          <div class="image-border image-border1"></div>
          <div class="image-border image-border2"></div>
          <div class="image-border image-border3"></div>
          <div class="image-border image-border4"></div>
          <div class="countsItem">
            <p class="title1">实习学生总人数：</p>
            <!--<p class="text1" v-if="this.roleGroup==='指导老师'">{{this.stuCount}}</p>
            <p class="text1" v-else>{{this.userTotal}}</p>-->
            <p class="text1">354</p>
            <span class="title1" style="width: 20px;">人</span>
          </div>
          <div class="countsItem">
            <p class="title1">应实习学生人数：</p>
            <!--<p class="text1" v-if="this.roleGroup==='指导老师'">{{this.stuCount}}</p>
            <p class="text1" v-else>{{this.userTotal}}</p>-->
            <p class="text1">350</p>
            <span class="title1" style="width: 20px;">人</span>
          </div>
          <div class="countsItem">
            <p class="title1">已安排学生人数：</p>
            <!--<p class="text1" v-if="this.roleGroup==='指导老师'">{{this.stuCount}}</p>
            <p class="text1" v-else>{{this.userTotal}}</p>-->
            <p class="text1">342</p>
            <span class="title1" style="width: 20px;">人</span>
          </div>
          <div class="countsItem" >
            <p class="title1">待安排学生人数：</p>
            <!--<p class="text1" v-if="this.roleGroup==='指导老师'">{{this.stuCount}}</p>
            <p class="text1" v-else>{{this.userTotal}}</p>-->
            <p class="text1">8</p>
            <span class="title1" style="width: 20px;">人</span>
          </div>
        </div>
        <div class="todayCounts">
          <div class="image-border image-border1"></div>
          <div class="image-border image-border2"></div>
          <div class="image-border image-border3"></div>
          <div class="image-border image-border4"></div>
          <p class="title2">今日实习在岗人数：</p>
          <!--<p class="text2">{{this.todayPunchCounts}}</p>-->
          <p class="text2">340</p>
          <p class="tip1">比昨日：
            <i class="el-icon-caret-top" id="icon1"/>
            增加<span style="color:rgb(253,49,31);font-weight:bold"> 2 </span>人
          </p>

        </div>
        <div class="todayLogs">
          <div class="image-border image-border1"></div>
          <div class="image-border image-border2"></div>
          <div class="image-border image-border3"></div>
          <div class="image-border image-border4"></div>
          <p class="title2">今日完成日志人数：</p>
          <!--<p class="text2">{{this.todayPracLogCounts}}</p>-->
          <p class="text2">340</p>
          <p class="tip1">比昨日：
            <i class="el-icon-caret-bottom" id="icon2"/>
            减少<span style="color: rgb(7,184,134);;font-weight:bold"> 2 </span>人
          </p>
        </div>
      </div>

      <!--地图-->
      <div class="mc-ui-grid-item mid-top">
        <!--<div id="my_container"></div>-->
      </div>

      <!--实习学生考勤统计-->
      <div class="mc-ui-grid-item right-top">
        <div class="image-border image-border1"></div>
        <div class="image-border image-border2"></div>
        <div class="image-border image-border3"></div>
        <div class="image-border image-border4"></div>
        <p class="title1" style="width: 300px;margin-left: 3%;font-size: 20px">本周实习学生考勤统计</p>
        <div id="chart3" style="
        width: 110%;height: 100%;
        z-index: 2;
        margin-top: 10%;
        ">
        </div>
      </div>

      <!--底部图表-->
      <div class="mc-ui-grid-item bottom" >
        <!--饼状图-->
        <div class="chart2">
          <div class="image-border image-border1"></div>
          <div class="image-border image-border2"></div>
          <div class="image-border image-border3"></div>
          <div class="image-border image-border4"></div>
          <div id="chart2" style="width: 100%;height: 100%" ></div>
        </div>

        <div class="chart1">
          <div class="image-border image-border1"></div>
          <div class="image-border image-border2"></div>
          <div class="image-border image-border3"></div>
          <div class="image-border image-border4"></div>

          <div id="chart1" style="width: 100%;height: 100%" ></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

  import { getUserProfile,listUser } from '../api/system/user'
  import * as echarts from 'echarts'
  import ScrollPane from '../layout/components/TagsView/ScrollPane'
  import { getTude } from '@/api/location/info'
  import { getBaseTude } from '@/api/system/baseInfo'
  import  location from '@/assets/images/location.png'
  import  locationRed from '@/assets/images/location-red.png'
  import bus from '../bus.js'
  import {getTodayPunchList,selectNowWeekAttendanceList} from '../api/punch/punch'
  import {getTodayPracLogList} from '../api/practicelog/practicelog'
  import {stuInfoList,getScreenData,getLocationStudentNum} from '../api/arrangement/arrangement'

  export default {
    name: "index",
    components: { ScrollPane },
    data() {
      return {
        // 版本号
        version: "3.6.0",
        // 用户信息
        user: {},
        roleGroup: {},
        //通知列表
        noticeList: [],
        noticeSlims:[],
        //通知条数
        noticetotal:0,
        //通知详细窗口
        noticeDetail:{
          visible:false,
          title:null,
          content:null,
          updateTime:null,
          publisher:null,
        },
        //查看所有通知窗口
        allNotice:{
          visible:false
        },
        // 通知查询参数
        noticeParams: {
          pageNum: 1,
          pageSize: 5,
          status: '1',
        },
        // 地图数据
        ruleForm: {
          name: '',
          phone: '',
          addr: '',
          long: '',
          lat: '',
          start_work_time: '',
          end_work_time: ''
        },
        // 管理用户人数
        userTotal:null,
        // 管理用户人数列表
        userList:[],
        // 查询管理用户列表参数
        queryParams: {
          pageNum: undefined,
          pageSize: undefined,
          userName: undefined,
          phonenumber: undefined,
          status: undefined,
          deptId: undefined,
          role: '实习学生'
        },
        // 今日打卡成功人数
        todayPunchCounts:null,
        // 今日日志提交份数
        todayPracLogCounts:null,
        // 指导老师查询实习学生参数
        stuParams: {
          pageNum: 1,
          pageSize: 10,
          stuId: null,
          info: null,
          infoId: null,
          notes: null,
          stuOption: null,
          status: null,
          postName: null,
          nickName: null,
          teacherId: null
        },
        // 指导老师查询实习学生总数
        stuCount:null,
        // 查询管理用户实习信息参数
        arrParams: {
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
        // 管理用户实习信息的人数（分散/集中/其他）
        screenData : {
          //分散实习人数
          scatteredPracticeNum : 0,
          //集中实习人数
          focusPracticeNum : 0,
          //实习基地-实习学生分布情况
          baseStuData:{
            baseName : [],
            count : []
          },
        },
        // 最近一周考勤记录
        weekPunch : [],
        // 图表
        charts:{
          chart1:null,
          chart2:null,
          chart3:null
        }
      };
    },
    created() {
      // 获取当前用户信息
      this.getUser();
    },

    mounted(){
      // 创建图表实例
      this.initCharts();

      // 获取大屏数据
      this.getScreenData();


      // 地图初始化
      //var that = this
      //this.init(that)

      // 接收详细公告信息
      bus.$on('sendNoticeDetail',(detail)=>{
        this.noticeDetail=detail;
        this.noticeDetail.visible=true;
      });
      //接收全部公告信息
      bus.$on('sendAllNotice',list=>{
        this.noticeList=list;
        this.allNotice.visible=true;
      })

    },
    methods: {

      goTarget(href) {
        window.open(href, "_blank");
      },

      /* 获取大屏数据 */
      getScreenData(){
        console.log("获取大屏数据")
        this.getTodayPracLogList();
        this.getTodayPunchList();
        this.getUserList();
        this.getStuCount();
        this.getWeekPunch();
        this.getArrList();
        this.getBaseStuData()
      },

      /* 获取当前用户信息 */
      getUser() {
        getUserProfile().then(response => {
          //console.log(response.data)
          //console.log(response.roleGroup)
          this.user = response.data;
          this.roleGroup = response.roleGroup;
          if(this.roleGroup==="实习学生"){
            this.$router.replace({ path: "/index_stu" }).catch(()=>{});
          }else if(this.roleGroup==="指导老师"){
            this.stuParams.teacherId=this.user.userId;
            //console.log(this.stuParams.teacherId)
            //获取管理学生数量
            this.getStuCount();
          }else {
            //获取管理用户列表
            this.getUserList()
          }
        });
      },

      /* 获取今天打卡成功人数 */
      getTodayPunchList(){
        getTodayPunchList().then(response=>{
          if(response.data.punchCount!==null)
            this.todayPunchCounts=response.data.punchCount;
          else this.todayPunchCounts=0;
        })
      },

      /* 获取今天完成日志人数 */
      getTodayPracLogList(){
        getTodayPracLogList().then(response=>{
          if(response.data.PracLogCount!==null){
            this.todayPracLogCounts=response.data.PracLogCount
          }
          else this.todayPracLogCounts=0;
        })
      },

      /* 获取管理用户列表 */
      getUserList(){
        listUser(this.queryParams).then(response=>{
          if(response.total!==null)
            this.userTotal=response.total;
          else this.userTotal=0;
          this.userList=response.row;
          //console.log(response.row)
        })
      },

      /* 获取管理实习学生实习信息 */
      getArrList(){
        getScreenData().then(response=>{
          //分散实习人数
          this.screenData.scatteredPracticeNum = response.data.scatteredPracticeNum
          //集中实习人数
          this.screenData.focusPracticeNum = response.data.focusPracticeNum
          this.charts.chart2.hideLoading();
          this.drawChart(2)
        })
      },

      /* 获取实习基地-学生人数数据 */
      getBaseStuData(){
        getLocationStudentNum().then(response=>{
          console.log(response)
          this.screenData.baseStuData.count = response.data[0]
          this.screenData.baseStuData.baseName = response.data[1]
          this.charts.chart1.hideLoading();
          this.drawChart(1)
        })
      },

      /* 指导老师获取实习学生总数 */
      getStuCount(){
        stuInfoList(this.stuParams).then(response=>{
          //console.log(response)
          this.stuCount=response.total;
        })
      },

      /* 获取一周考勤记录 */
      getWeekPunch(){
        selectNowWeekAttendanceList().then(response=>{
          this.weekPunch = response.data
          //console.log(this.weekPunch)
          this.charts.chart3.hideLoading();
          this.drawChart(3)
        })
      },

      /* 创建图表实例 */
      initCharts(){
        // 基于准备好的dom，初始化echarts实例
        console.log("创建图表")
        this.charts.chart1 = echarts.init(document.getElementById('chart1'))
        this.charts.chart1.showLoading()
        this.charts.chart2 = echarts.init(document.getElementById('chart2'))
        this.charts.chart2.showLoading()
        this.charts.chart3 = echarts.init(document.getElementById('chart3'))
        this.charts.chart3.showLoading()
        //console.log(this.charts.chart1)
      },

      /* 绘图 */
      drawChart(id){
        switch (id) {
          case id=1:{
            this.charts.chart1.setOption({
              textStyle:{
                color:"rgba(255,255,255,0.9)",
              },
              title: {
                text: '实习基地-学生人数分布情况',
                left: 'center',
                top:'3%',
                textStyle:{
                  color: "rgb(101, 238, 250)",
                  textShadowColor: 'rgb(3, 170, 253)',
                  textShadowBlur:2,
                  fontFamily:'微软雅黑',
                  fontWeight:'lighter',
                  fontSize:22,
                }
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
              },
              yAxis: {
                type: 'category',
                data:this.screenData.baseStuData.baseName /*['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']*/
              },
              series: [
                {
                  name: '人数',
                  type: 'bar',
                  data: this.screenData.baseStuData.count/*[18203, 23489, 29034, 104970, 131744, 630230]*/,
                  label: {
                    show: true,
                    fontSize:15
                  },
                  itemStyle:{
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                      offset: 0,
                      color: '#05d7fc'
                    }, {
                      offset: 1,
                      color: '#6f6afd'
                    }]),
                  }
                }
              ]
            });
          }break;
          case id=2:{
            this.charts.chart2.setOption({
              title: {
                text: '实习类型情况',
                left: 'center',
                top:'3%',
                textStyle:{
                  color: "rgb(101, 238, 250)",
                  textShadowColor: 'rgb(3, 170, 253)',
                  textShadowBlur:2,
                  fontFamily:'微软雅黑',
                  fontWeight:'lighter',
                  fontSize:22,
                }
              },
              tooltip: {
                trigger: 'item',
              },
              legend: {
                orient: 'vertical',
                left: '2%',
                top:'30%',
                textStyle:{
                  color: "rgb(254,255,255)",
                  textShadowColor: 'rgb(3, 170, 253)',
                  textShadowBlur:2,
                  fontFamily:'微软雅黑',
                  fontWeight:'lighter',
                  fontSize:13
                }
              },
              series: [
                {
                  name: '人数',
                  type: 'pie',
                  radius: '50%',
                  data: [
                    {
                      value: parseInt(this.screenData.scatteredPracticeNum),
                      name: '分散实习',
                      itemStyle:{
                        color:'rgb(3,167,255)'
                      }
                    },
                    {
                      value: parseInt(this.screenData.focusPracticeNum),
                      name: '集中实习',
                      itemStyle:{
                        color:'rgba(3,252,216,0.92)'
                      }
                    }
                  ],
                  label: {
                    show:true,
                    formatter: '{b}：{c}',
                    color: "rgb(254,255,255)",
                    textShadowColor: 'rgb(3, 170, 253)',
                    textShadowBlur:2,
                    fontFamily:'微软雅黑',
                    fontWeight:'lighter',
                    fontSize:16,
                    /*position:'inside'*/
                  },
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0,0,0,0.5)'
                    }
                  }
                }
              ]
            });
          }break;
          case id=3:{
            this.charts.chart3.setOption({
              textStyle:{
                color:"rgba(255,255,255,0.9)",

              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              xAxis: [
                {
                  type: 'category',
                  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  data: /*this.weekPunch*/[100,59,254,356,156,15,61],
                  type: 'bar',
                  label: {
                    show: true,
                    color:"rgb(255,255,255)",
                    fontSize:15
                  },
                  itemStyle:{
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#05a6fc'
                    }, {
                      offset: 1,
                      color: '#0147c6'
                    }]),
                  }
                }
              ],

            });
          }break;
        }
      },

      /* 地图 */
      init(that) {
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
        initLocation(that);
        initMarkerClusterer();

        function initBaseInfo(that){
          getTude().then(response => {
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
            //console.log(companyNames)
            //console.log(lonlats)

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
//             imageIcon=require("../../../assets/images/location.png")
            function customMark(longit, lat, title) {
              // let lonlat = [108.365386,22.843292];
              // 创建 AMap.Icon 实例：
              let icon = new AMap.Icon({
                size: new AMap.Size(58, 70),    // 图标尺寸
                image: location,  // Icon的图像
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

              var markerContent =`<div class="description">
              <span class="title">${title}</span>
              <br />
              <div class="mt-3 detail">
                <a href="#">今日在岗学生：0名</a> <br />
                <a href="#">今日离岗学生：0名</a> <br />
                <a href="#">今日共有学生：3名</a>
              </div>
            </div>`

              marker.on('mouseover', function(e) {
                marker.setTop(true)
              })

              marker.on('mouseout', function() {
                //  鼠标离开标注地点事件
                marker.setTop(false)
              })

              marker.on("click", function (e) {
                //  点击标注地点事件
              });
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
            this.addMarkerClusterer = function() {
              // let lonlat = [Math.random() + 113, Math.random() + 23]
              // console.log(lonlat)
              // 创建 AMap.Icon 实例：
              let icon = new AMap.Icon({
                size: new AMap.Size(58, 70),    // 图标尺寸
                image: 'https://chuyinweilai.store/apk/index_calen.png',  // Icon的图像
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
          })
        }

        function initLocation(that){
          var lonlats = []
          var companyNames = []
          getBaseTude().then(response => {
            var i = 0

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
            // console.log(companyNames)
            // console.log(lonlats)


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
            // cluster.setMaxZoom(15);
// 添加自定义标记
            function customMark(longit, lat, title) {
              // let lonlat = [108.365386,22.843292];
              // 创建 AMap.Icon 实例：
              var icon = new AMap.Icon({
                size: new AMap.Size(58, 70),    // 图标尺寸
                image: locationRed,  // Icon的图像
                imageSize: new AMap.Size(28, 30)   // 根据所设置的大小拉伸或压缩图片
              })

              // 将 Icon 实例添加到 marker 上:
              var marker = new AMap.Marker({
                position: new AMap.LngLat(longit, lat),
                offset: new AMap.Pixel(-10, -10),
                icon: icon, // 添加 Icon 实例
                title: '基地  ：'+title,
                zoom: 13
              })
              var msg_label = '<span>' + title + '</span>'

              marker.setLabel({
                offset: new AMap.Pixel(20, -10), //显示位置
                content: msg_label //显示内容
              })

              var markerContent =`<div class="description">
              <span class="title">${title}</span>
              <br />
              <div class="mt-3 detail">
                <a href="#">今日在岗学生：0名</a> <br />
                <a href="#">今日离岗学生：0名</a> <br />
                <a href="#">今日共有学生：3名</a>
              </div>
            </div>`

              marker.on('mouseover', function(e) {
                marker.setTop(true)
              })
              marker.on('mouseout', function() {
                marker.setTop(false)
              })

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
                var cluster = AMap.MarkerClusterer(
                  map,     // 地图实例
                  markers)
                cluster.setMaxZoom(12)
              })
            }
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

<style scoped lang="scss">
  .home {
    blockquote {
      padding: 10px 20px;
      margin: 0 0 20px;
      font-size: 17.5px;
      border-left: 5px solid #eee;
    }
    hr {
      margin-top: 20px;
      margin-bottom: 20px;
      border: 0;
      border-top: 1px solid #eee;
    }
    .col-item {
      margin-bottom: 20px;
    }

    ul {
      padding: 0;
      margin: 0;
    }

    font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 13px;
    color: #676a6c;
    overflow-x: hidden;

    ul {
      list-style-type: none;
    }

    h4 {
      margin-top: 0px;
    }

    h2 {
      margin-top: 10px;
      font-size: 26px;
      font-weight: 100;
    }

    p {
      margin-top: 10px;

      b {
        font-weight: 700;
      }
    }

    .update-log {
      ol {
        display: block;
        list-style-type: decimal;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0;
        margin-inline-end: 0;
        padding-inline-start: 40px;
      }
    }
  }
  #my_container {
    width:100%;
    height: 100%;
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

<!--首页元素布局-->
<style scoped type="text/css">
  #main-panle{
    display: grid;
    grid-template-columns: 0.4fr 0.6fr 0.4fr;
    grid-template-rows:0.9fr 0.8fr;
    gap: 0.5% 0.5%;
    grid-template-areas:
      "left-top mid-top right-top "
      "bottom bottom bottom"
  ;

  }

  .left-top {
    grid-area: left-top;
    margin-top: 1%;
    /*padding: 2%;*/
    /*border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);*/
  }

  .mid-top {
    grid-area: mid-top;
    padding: 0.2%;
    /*border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);*/

  }

  .right-top {
    grid-area: right-top;
    padding: 2%;
    margin-top: 1%;
    margin-bottom: 1%;
    position: relative;
    background-color: rgba(11, 74, 175, 0.43);
    border: 1px solid #33a8f5;
    box-shadow: inset 0 0 15px rgba(66, 198, 250, 0.98);
    /*background-color: rgba(3, 194, 155, 0.17);*/

  }

  .bottom{
    grid-area: bottom;
    /*border: 1px solid #e0e0e0;*/
    /*border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
    margin-bottom: 0.5%;
    min-width: 500px;*/
  }

  .title1{
    font-family: "微软雅黑 Light";
    width: 200px;
    font-size: 25px;
    margin-top: 2.5%;
    margin-bottom: 0;
    margin-left: 10%;
    position: relative;
    float: left;
    color: rgb(101, 238, 250);
    text-shadow: 0 0 1px rgb(3, 170, 253);
  }
  .title2{
    font-family: "微软雅黑 Light";
    width: 180px;
    font-size: 18px;
    margin-top: 6%;
    margin-bottom: 0;
    margin-left: 6%;
    position: relative;
    color: rgb(101, 238, 250);
    text-shadow: 0 0 1px rgb(3, 170, 253);
  }
  .tip1 {
    font-family: "微软雅黑 Light";
    width: 180px;
    font-size: 16px;
    margin-left: 6%;
    position: relative;
    color: rgb(101, 238, 250);
    text-shadow: 0 0 1px rgb(3, 170, 253);
  }
  #icon1{
    font-size: 18px;
    position: relative;
    color: rgb(255, 23, 2);

  }
  #icon2{
    font-size: 18px;
    position: relative;
    color: rgba(3, 253, 136, 0.83);
  }
  .text1{
    width: 60px;
    font-size: 35px;
    position: relative;
    margin-top: 1.8%;
    margin-bottom: 0;
    margin-left: 3%;
    float: left;
    text-align: right;
    color: rgba(44, 252, 228, 1);
    text-shadow: 0 0 1px rgb(75, 192, 250);
  }
  .text2{
    font-size: 45px;
    position: relative;
    margin-top: 13%;
    margin-bottom: 15%;
    text-align: center;
    color: rgba(44, 252, 228, 1);
    text-shadow: 0 0 1px rgb(75, 192, 250);
  }


  .allNotice{
    padding: 5%;
  }

  .image-border {
    position: absolute;
    width: 15px;
    height: 15px;
    z-index: 99;

  }

  .image-border1 {
    top: 0;
    left: 0;
    border-left: 3px solid #4fe6fa;
    border-top: 3px solid #4fe6fa;
  }

  .image-border2 {
    top: 0;
    right: -2px;
    border-right: 3px solid #4fe6fa;
    border-top: 3px solid #4fe6fa;
  }

  .image-border3 {
    bottom: 0;
    left: 0;
    border-bottom: 3px solid #4fe6fa;
    border-left: 3px solid #4fe6fa;
  }

  .image-border4 {
    bottom: 0;
    right: -2px;
    border-right: 3px solid #4fe6fa;
    border-bottom: 3px solid #4fe6fa;
  }

  .stuCounts{
    padding-top: 2%;
    height: 55%;
    margin-bottom: 5%;
    position: relative;
    background-color: rgba(6, 72, 175, 0.56);
    border: 1px solid #33a8f5;
    box-shadow: inset 0 0 15px rgba(66, 198, 250, 0.98);

  }
  .countsItem{
    position: relative;
    height: 21.5%;
    margin-bottom: 2%;
    margin-left: 1%;
    margin-right: 1%;
    text-align: left;
    font-size:15px;
    background-color: rgba(21, 201, 201, 0.22);
    border: 1px solid #33a8f5;
    box-shadow: inset 0 0 15px rgba(66, 198, 250, 0.98);
  }
  .todayCounts {
    height: 39%;
    width: 48%;
    margin-right: 2%;
    float: left;
    position: relative;
    background-color: rgba(13, 88, 206, 0.56);
    border: 1px solid #33a8f5;
    box-shadow: inset 0 0 15px rgba(66, 198, 250, 0.98);
  }
  .todayLogs{
    height: 39%;
    width: 48%;
    margin-left: 2%;
    float: left;
    position: relative;;
    background-color: rgba(13, 88, 206, 0.56);
    border: 1px solid #33a8f5;
    box-shadow: inset 0 0 15px rgba(66, 198, 250, 0.98);
  }

  .chart1{
    width: 59%;
    height: 100%;
    margin-left: 1%;
    position: relative;
    float: left;
    background-color: rgba(27, 100, 215, 0.43);
    border: 1px solid #33a8f5;
    box-shadow: inset 0 0 15px rgba(66, 198, 250, 0.98);
  }
  .chart2{
    width: 39%;
    height: 100%;
    margin-right: 1%;
    position: relative;
    float: left;
    background-color: rgba(27, 100, 215, 0.43);
    border: 1px solid #33a8f5;
    box-shadow: inset 0 0 15px rgba(66, 198, 250, 0.98);
  }

</style>
