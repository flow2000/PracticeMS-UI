<template>
  <div id="my_container"></div>
</template>
<script>

  import { getTude } from '@/api/location/info'
  import { getBaseTude } from '@/api/system/baseInfo'
  import  location from '@/assets/images/location.png'
  import  locationRed from '@/assets/images/location-red.png'

  export default {

    name: 'company_manage',
    data() {
      return {
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
    mounted: function() {
      var that = this
      this.init(that)

    },
    methods: {
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
                <a href="#">今日在岗学生：1名</a> <br />
                <a href="#">今日离岗学生：2名</a> <br />
                <a href="#">今日共有学生：3名</a>
              </div>
            </div>`

              marker.on('mouseover', function(e) {
                marker.setLabel({
                  offset: new AMap.Pixel(0, -30), //显示位置
                  content: markerContent //显示内容
                })
                marker.setTop(true)
              })

              marker.on('mouseout', function() {
                //  鼠标离开标注地点事件
                marker.setTop(false)
                marker.setLabel({
                  offset: new AMap.Pixel(20, -10)  , //显示位置
                  content: msg_label //显示内容
                })
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
                <a href="#">今日在岗学生：1名</a> <br />
                <a href="#">今日离岗学生：2名</a> <br />
                <a href="#">今日共有学生：3名</a>
              </div>
            </div>`

              marker.on('mouseover', function(e) {
                marker.setLabel({
                  offset: new AMap.Pixel(0, -30), //显示位置
                  content: markerContent //显示内容
                })
                marker.setTop(true)
              })
              marker.on('mouseout', function() {
                marker.setLabel({
                  offset: new AMap.Pixel(20, -10)  , //显示位置
                  content: msg_label //显示内容
                })
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
  }
</script>

<style scoped>
  #my_container {
    height: 700px;
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
