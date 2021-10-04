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
          addresses:[]
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
          zoom: 18,
        })
        AMap.plugin('AMap.Geolocation',function(){ //异步加载插件
          var geolocation = new AMap.Geolocation()
          map.addControl(geolocation)
        })
        let markers = []; // 点聚合数组
        for (let i = 0; i < 3; i++) {
          customMark();
        }
        initMarkerClusterer();
        // cluster.setMaxZoom(15);
// 添加自定义标记
        function customMark () {
          let lonlat = [Math.random() + 108, Math.random() + 22];
          console.log(lonlat)
          // 创建 AMap.Icon 实例：
          let icon = new AMap.Icon({
            size: new AMap.Size(58, 70),    // 图标尺寸
            image: 'http://chuyinweilai.store/apk/location.png',  // Icon的图像
            imageSize: new AMap.Size(28, 30)   // 根据所设置的大小拉伸或压缩图片
          });

          // 将 Icon 实例添加到 marker 上:
          let marker = new AMap.Marker({
            position: new AMap.LngLat(lonlat[0], lonlat[1]),
            offset: new AMap.Pixel(-10, -10),
            icon: icon, // 添加 Icon 实例
            title: localStorage.address,
            zoom: 13

          });
          map.add(marker);
          markers.push(marker);
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

        var geocoder = new AMap.Geocoder({
          /// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          radius:10
        });
        var lnglat = [108.232471,22.842915];//这里是需要转化的经纬度
        geocoder.getAddress(lnglat, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
// result为对应的地理位置详细信息
//             console.log(result.regeocode.formattedAddress)
            var address = result.regeocode.formattedAddress
            // this.addresses.push(address)
            localStorage.address = address
          }
        })

        console.log(localStorage.address)
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
</style>
