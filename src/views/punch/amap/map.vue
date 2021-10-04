<template>
  <div id="my_container" ></div>
</template>
<script>

  export default {
    name: "company_manage",
    data () {
      return {
        ruleForm: {
          name: '',
          phone: '',
          addr: '',
          long: '',
          lat: '',
          start_work_time: '',
          end_work_time: '',
          addresses:'',
        },
      }
    },
    mounted:function () {
      this.init()
    },
    methods: {

      init() {
        var map = new AMap.Map('my_container',{
          resizeEnable: true,
          zoom: 10,
          center: [108.365386, 22.843292], // 中心点坐标,广西民族大学
        })
        AMap.plugin('AMap.Geolocation',function(){ //异步加载插件
          var geolocation = new AMap.Geolocation()
          map.addControl(geolocation)
        })
        let markers = []; // 点聚合数组
        let lonlat = [[108.365386,22.843292],[108.238089,22.848063],[108.244248,22.852298]];
        for (let i = 0; i < 3; i++) {
          //获得地点信息
          var geocoder = new AMap.Geocoder({
            /// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            radius:10
          });
          geocoder.getAddress(lonlat[i], function(status, result) {
            console.log(status,result)
            if (status === 'complete' && result.info === 'OK') {
              // result为对应的地理位置详细信息
              //             console.log(result.regeocode.formattedAddress)
              customMark(lonlat[i][0],lonlat[i][1],result.regeocode.formattedAddress)
              // console.log(address)
              // this.addresses = address
            }
          })
          // console.log(this.addresses)
          //添加标记
          // customMark(lonlat[i][0],lonlat[i][1],address)
        }
        initMarkerClusterer();
        // cluster.setMaxZoom(15);
// 添加自定义标记
        function customMark(longit,lat,title) {
          // let lonlat = [108.365386,22.843292];
          // 创建 AMap.Icon 实例：
          let icon = new AMap.Icon({
            size: new AMap.Size(58, 70),    // 图标尺寸
            image: 'http://chuyinweilai.store/apk/location.png',  // Icon的图像
            imageSize: new AMap.Size(28, 30)   // 根据所设置的大小拉伸或压缩图片
          });

          // 将 Icon 实例添加到 marker 上:
          let marker = new AMap.Marker({
            position: new AMap.LngLat(longit, lat),
            offset: new AMap.Pixel(-10, -10),
            icon: icon, // 添加 Icon 实例
            title: title,
            zoom: 13,
          });
          var msg_label = '<span>'+title+'</span>';
          
          marker.setLabel({
            offset: new AMap.Pixel(20, -10), //显示位置
            content: msg_label //显示内容
          });
          marker.on("mouseover", function(e) {
            marker.setTop(true);
          });
          marker.on("mouseout", function() {
            marker.setTop(false);
          });

          // var lonlat=longit+","+lat
          // markerEvent(marker,lonlat)
          map.add(marker);

          markers.push(marker);
        }
        // markerEvent在创建点标记后调用，这里不写了
        function markerEvent (marker, lonlat) {
          // AMap.event.addListener(marker, 'click', function () {
          //   openInfo(marker, lonlat);
          // })
        }
// 初始化点聚合k
        function initMarkerClusterer () {
          //添加聚合组件
          map.plugin(["AMap.MarkerClusterer"],function() {
            var cluster = new AMap.MarkerClusterer(
              map,     // 地图实例
              markers);
            cluster.setMaxZoom(12);
          });
        }



        // function openInfo(marker, lonlat) {
        //   let info = document.createElement("div");
        //   info.className = "infoWindow";
        //   info.innerHTML = '自定义样式信息窗口';
        //     //构建信息窗体中显示的内容
        //     infoWindow = AMap.InfoWindow({
        //       content: info,  //使用默认信息窗体框样式，显示信息内
        //       offset: new AMap.Pixel(16, -10)
        //     });
        //   infoWindow.open(map, lonlat);
        // }





        // function initAddress(lnglat){
        //   // console.log(lnglat)
        //   var geocoder = new AMap.Geocoder({
        //     /// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        //     radius:10
        //   });
        //   let address;
        //   geocoder.getAddress(lnglat, function(status, result) {
        //     console.log(status,result)
        //     if (status === 'complete' && result.info === 'OK') {
        //       // result为对应的地理位置详细信息
        //       //             console.log(result.regeocode.formattedAddress)
        //       localStorage.removeItem("adddress")
        //        localStorage.address = result.regeocode.formattedAddress
        //       // console.log(address)
        //       // this.addresses = address
        //     }
        //   })
        //   // console.log(this.addresses)
        //   return localStorage.address;
        // }


// 添加点标记至点聚合中
        this.addMarkerClusterer = function () {
          let lonlat = [Math.random() + 113, Math.random() + 23];
          console.log(lonlat)
          // 创建 AMap.Icon 实例：
          let icon = new AMap.Icon({
            size: new AMap.Size(58, 70),    // 图标尺寸
            image: 'http://chuyinweilai.store/apk/index_calen.png',  // Icon的图像
            imageSize: new AMap.Size(58, 70)   // 根据所设置的大小拉伸或压缩图片
          });

          // 将 Icon 实例添加到 marker 上:
          let marker = new AMap.Marker({
            position: new AMap.LngLat(lonlat[0], lonlat[1]),
            offset: new AMap.Pixel(-10, -10),
            icon: icon, // 添加 Icon 实例
            title: localStorage.address,
            zoom: 13
          });
          markerEvent(marker, lonlat);
          cluster.addMarker(marker);
        }

        var geocoder,marker;
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
      },
    },
  }
</script>

<style scoped>
  #my_container{
    height: 700px;
  }

  /**
  * 信息窗口主体
  */
  .infoWindow{
    position: relative!important;
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
  .amap-info-contentContainer .amap-info-sharp{
    border-top: 8px solid rgba(0, 44, 71, .5);
  }
  /**
  * 信息窗口箭头
  */
  .amap-info-content{
    background-color: rgba(0, 44, 71, .5);
  }
  /**
  * 关闭按钮
  */
  .amap-info-close{
    right: 10px;
    color: #fff;
  }
  #my_container .amap-marker-label{border:0 none; background-color: #fff; white-space: nowrap; box-shadow: 0 0 5px 0 rgba(0,0,0,.3); border-radius: 5px;}
  #my_container .amap-marker-label:after{position: absolute; border:5px solid transparent; border-top-color: #fff; top:19px; left: 43%; content: ''; width: 0; height: 0;}

</style>
