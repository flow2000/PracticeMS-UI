<template>
  <div class="hello">
    <h1> 二维码</h1>
    <vue-qr ref="Qrcode"
            :text="dataObj.text"
            :logoSrc="dataObj.logo"
            :callback="getLocation" :qid="qid"></vue-qr>

  </div>
</template>
<script>
  // 二维码组件
  import VueQr from 'vue-qr'
  import { getToken } from "@/utils/auth";

  export default {
    name: 'HelloWorld',
    components: { VueQr },
    data () {
      return {
        dataObj: {
          text:"http://www.chuyinweilai.store/",
          logo: require('../index_calen.png')
        },
        qid:getToken()
      }
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
            console.log(data.formattedAddress)
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
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>

