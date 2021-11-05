<template>
  <div id="magicalDragScene" class="mc-root mc-ui-absolute-pane" style="height: 1300px;min-height: 1100px;min-width: 1420px" mcnetline="100">
    <div id="main-panle" class="mc-ui-grid-pane" style="height: 1300px; width: auto;margin:1%;min-height: 1100px;min-width: 1420px">

      <div class="mc-ui-grid-item top-panle">
        <div style="font-size:xx-large;color: #1c84c6;width: 30%;position: relative;float: left">
          |欢迎使用本系统！<br />
          <div style="font-size: x-large;color: #0eaa8b;">-{{roleGroup}}：{{user.nickName}}</div>
        </div>

        <!--通知栏-->
        <!--<div style="position: relative;float: left;width: 60%;padding:0 8%">
          <el-tooltip effect="dark" content="展开公告" placement="right">
            <div class="sysNoticeTitle" @click="showAllNotice()" >系统通知</div>
          </el-tooltip>
            <el-carousel height="35px" direction="vertical" :autoplay="true" indicator-position="none">
              <el-carousel-item v-for="item in noticeList">
                <p class="noticeSlim" @click="showNoticeDetail(item.noticeId)">
                  [{{(item.updateTime.split(" "))[0]}}]&nbsp;{{item.noticeTitle}}
                </p>
              </el-carousel-item>
            </el-carousel>
        </div>-->
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

      </div>

      <div class="mc-ui-grid-item left-mid1" >
        <p class="title1">管理实习学生人数</p>
        <hr/>
        <p class="text1">56</p>
        <!--<p class="data1">在岗实习人数：50</p>-->
      </div>
      <div class="mc-ui-grid-item left-mid2" >
        <p class="title1">今日打卡人数</p>
        <hr/>
        <p class="text1">48</p>
      </div>
      <div class="mc-ui-grid-item left-mid3" >
        <p class="title1">今日日志提交份数</p>
        <hr/>
        <p class="text1">48</p>
      </div>

      <div class="mc-ui-grid-item mid-mid">
        <div id="my_container"></div>
      </div>

      <div class="mc-ui-grid-item right-mid1">
        <p class="title1">本周实习打卡统计</p>
        <hr/>
        <div id="chart3" style="
        width: 110%;height: 90%;position:relative;
        top: 0%;z-index: 2;
        "></div>
      </div>
      <div class="mc-ui-grid-item right-mid2">

      </div>


      <div class="mc-ui-grid-item left-bottom" >
        <div id="chart2" style="width: 100%;height: 100%;padding-top: 10%"></div>
      </div>
      <!--<div class="mc-ui-grid-item mid-bottom">
      </div>-->
      <div class="mc-ui-grid-item right-bottom" >
        <div id="chart1" style="width: 95%;height: 100%;"></div>
      </div>

    </div>
  </div>
</template>

<script>

import { getUserProfile } from '../api/system/user'
import * as echarts from 'echarts'
import { listNotice } from "@/api/system/notice";
import ScrollPane from '../layout/components/TagsView/ScrollPane'
import request from '@/utils/request'
import { getTude } from '@/api/location/info'
import { getBaseTude } from '@/api/system/baseInfo'
import  location from '@/assets/images/location.png'
import  locationRed from '@/assets/images/location-red.png'
import bus from '../bus.js'

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

      }
    };
  },
  created() {
    // 获取当前用户信息
    this.getUser();

    // 获取最近的公告
    //this.getNoticeList();
  },
  mounted(){
    // 绘图
    this.drawLine();
    // 地图初始化
    var that = this
    this.init(that)
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
    // 展示网络时间
    // this.showNetDateTime();
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },

    /* 获取当前用户信息 */
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
      });
    },

    /* 展示网络时间 */
    showNetDateTime(){
      getNetDateTime().then(response=>{
        console.log(response);
      })
    },
    /* 绘图 */
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
      let chart1 = echarts.init(document.getElementById('chart1'))
      let chart2 =echarts.init(document.getElementById('chart2'))
      let chart3 =echarts.init(document.getElementById('chart3'))
      // 绘制图表
      chart1.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: 'Email',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Union Ads',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'Video Ads',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: 'Search Engine',
            type: 'bar',
            data: [862, 1018, 964, 1026, 1679, 1600, 1570],
            emphasis: {
              focus: 'series'
            },
            /*markLine: {
              lineStyle: {
                type: 'dashed'
              },
              data: [[{ type: 'min' }, { type: 'max' }]]
            }*/
          },
          {
            name: 'Baidu',
            type: 'bar',
            barWidth: 5,
            stack: 'Search Engine',
            emphasis: {
              focus: 'series'
            },
            data: [620, 732, 701, 734, 1090, 1130, 1120]
          },
          {
            name: 'Google',
            type: 'bar',
            stack: 'Search Engine',
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 290, 230, 220]
          },
          {
            name: 'Bing',
            type: 'bar',
            stack: 'Search Engine',
            emphasis: {
              focus: 'series'
            },
            data: [60, 72, 71, 74, 190, 130, 110]
          },
          {
            name: 'Others',
            type: 'bar',
            stack: 'Search Engine',
            emphasis: {
              focus: 'series'
            },
            data: [62, 82, 91, 84, 109, 110, 120]
          }
        ]
      });
      chart2.setOption({
        title: {
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
      chart3.setOption({
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
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }
        ],

      });
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
              var cluster = AMap.MarkerClusterer(
                map,     // 地图实例
                markers)
              cluster.setMaxZoom(12)
            })
          }

// 添加点标记至点聚合中
//             this.addMarkerClusterer = function() {
//               // let lonlat = [Math.random() + 113, Math.random() + 23]
//               // console.log(lonlat)
//               // 创建 AMap.Icon 实例：
//               let icon = new AMap.Icon({
//                 size: new AMap.Size(58, 70),    // 图标尺寸
//                 image: 'http://chuyinweilai.store/apk/index_calen.png',  // Icon的图像
//                 imageSize: new AMap.Size(58, 70)   // 根据所设置的大小拉伸或压缩图片
//               })
//
//               // 将 Icon 实例添加到 marker 上:
//               let marker = new AMap.Marker({
//                 position: new AMap.LngLat(lonlats[0], lonlats[1]),
//                 offset: new AMap.Pixel(-10, -10),
//                 icon: icon, // 添加 Icon 实例
//                 title: "111",
//                 zoom: 13
//               })
//               markerEvent(marker, lonlats)
//               cluster.addMarker(marker)
//             }

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
  /* 通过noticeId搜索通知列表获取索引值 */
  function checkNoticeId(list,id){
  let i=0;
  for(let item of list){
    if(item.noticeId===id) return i;
    i++;
  }
}
  /* 获取网络时间 */
  function getNetDateTime() {
  return request({
    url: 'http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp',
    method: 'get'
  })
}
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
<style type="text/css">
  #main-panle{
    display: grid;
    grid-template-columns: 0.2fr 0.5fr 0.75fr 0.5fr;
    grid-template-rows:0.1fr 0.3fr 0.3fr 0.3fr 0.7fr;
    gap: 1% 1%;
    grid-template-areas:
      "top-panle top-panle top-panle top-panle"
      "left-mid1 mid-mid mid-mid right-mid1 "
      "left-mid2 mid-mid mid-mid right-mid1"
      "left-mid3 mid-mid mid-mid right-mid2"
      "left-bottom left-bottom right-bottom right-bottom"
    ;

  }
  .top-panle{
    grid-area: top-panle;
    padding: 1% 1.5%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
    max-height: 110px;
  }

  .left-mid1 {
    grid-area: left-mid1;
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

  .left-mid2 {
    grid-area: left-mid2;
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

  .left-mid3 {
    grid-area: left-mid3;
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

  .mid-mid {
    grid-area: mid-mid;
    padding: 0.2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);

  }

  .right-mid1 {
    grid-area: right-mid1;
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

  .right-mid2 {
    grid-area: right-mid2;
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

  .right-mid3 {
    grid-area: right-mid3;
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

  .left-bottom{
    grid-area: left-bottom;
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
    margin-bottom: 2%;
    min-width: 500px;
  }
  .mid-bottom{
    grid-area: mid-bottom;
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }
  .right-bottom{
    grid-area: right-bottom;
    padding: 1%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
    margin-bottom: 1%;
    min-width: 900px
  }

  /*公告栏样式*/
  .el-carousel__item{

  }
  .el-carousel__item:nth-child(2n) {
  }
  .el-carousel__item:nth-child(2n+1) {
  }

  .noticeSlim{
    color: #f34f4f;
    font-size: 16px;
    text-align: center;
    margin: 2% 15%
  }
  .noticeSlim:hover{
    color: #0ab685;
    cursor: pointer;

  }

  .title1{
    text-align: left;
    color: #7f7f7f;
    font-size:15px;
    margin: 8px;
    z-index: 1;
  }
  .text1{
    text-align: center;
    color:#2495b8;
    font-size: 50px;
    margin:25px 10px
  }
  .data1{
    text-align: left;
    color: #7f7f7f;
    font-size: 13px;
    margin: 8px
  }
  .sysNoticeTitle{
    text-align: center;
    font-size:larger;
    color: #959595;
    margin: 0 40%
  }
  .sysNoticeTitle:hover {
    cursor: pointer;
    color: #1ab394;
  }
  .allNotice{
    padding: 5%;
  }
</style>

