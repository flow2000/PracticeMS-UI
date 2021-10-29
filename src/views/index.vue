<template>
  <div id="magicalDragScene" class="mc-root mc-ui-absolute-pane" style="height: 1100px;min-height: 1100px;min-width: 1700px" mcnetline="100">
    <div id="main-panle" class="mc-ui-grid-pane" style="height: 1100px; width: auto;margin:1%;min-height: 1100px;min-width: 1500px">

      <div class="mc-ui-grid-item top-panle">
        <div style="font-size:xx-large;color: #1c84c6;width: 20%;position: relative;float: left">
          |欢迎使用本系统！<br />
          <div style="font-size: x-large;color: #0eaa8b;">-{{roleGroup}}：{{user.nickName}}</div>
        </div>

        <!--通知栏-->
        <div style="position: relative;float: left;width: 60%;padding:0 8%">
          <div style="text-align: center;font-size:larger;color: #959595;" >系统通知</div>
            <el-carousel height="35px" direction="vertical" :autoplay="true" indicator-position="none">
              <el-carousel-item v-for="item in noticeList">
                <p class="noticeSlim" @click="showNoticeDetail(item.noticeId)">
                  {{item.noticeTitle}}&nbsp;[{{(item.updateTime.split(" "))[0]}}]
                </p>
              </el-carousel-item>
            </el-carousel>
        </div>
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


      </div>

      <div class="mc-ui-grid-item left-mid1" >
        <p class="title1">管理实习学生人数</p>
        <hr/>
        <p class="text1">56</p>
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
        <div id="map" style="width: 100%;height: 100%;">


        </div>
      </div>

      <div class="mc-ui-grid-item right-mid1">
        <p class="title1">本周实习打卡统计</p>
        <hr/>
        <div id="chart3" style="
        width: 100%;height: 90%;position:relative;
        top: -10%;z-index: -99;
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
        <div id="chart1" style="width: 95%;height: 100%"></div>
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
      // 查询参数
      noticeParams: {
        pageNum: 1,
        pageSize: 5,
        status: '1',
      },
    };
  },
  created() {
    // 获取当前用户信息
    this.getUser();

    // 获取最近的公告
    this.getNoticeList();

    // 展示网络时间
    // this.showNetDateTime();
  },
  mounted(){
    // 绘图
    this.drawLine();
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },

    /* 查询公告列表 */
    getNoticeList() {
      this.noticeloading = true;
      listNotice(this.noticeParams).then(response => {
        this.noticeList = response.rows;
        this.noticetotal = response.total;
        this.noticeloading = false;
        for(let item of this.noticeList){
          let day=item.updateTime.split(' ');
          this.noticeSlims.push(item.noticeTitle+" ["+day[0]+"]")
        }
      });
    },

    /* 查看公告详细信息 */
    showNoticeDetail(noticeId){
      let index=checkNoticeId(this.noticeList,noticeId);
      this.noticeDetail.visible=true;
      this.noticeDetail.title=this.noticeList[index].noticeTitle;
      this.noticeDetail.content=this.noticeList[index].noticeContent;
      this.noticeDetail.updateTime=this.noticeList[index].updateTime;
      this.noticeDetail.publisher=this.noticeList[index].nickname;
    },
    // 获取当前用户信息
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
    // 绘图
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
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }
        ]
      })
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
</style>

<!--首页元素布局-->
<style type="text/css">
  #main-panle{
    display: grid;
    grid-template-columns: 0.2fr 0.5fr 0.75fr 0.5fr;
    grid-template-rows:0.1fr 0.25fr 0.25fr 0.25fr 0.8fr;
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
    padding: 2%;
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
    margin-bottom: 2%
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
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
    margin-bottom: 1%
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
    margin: 2%
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
    margin: 10px
  }
</style>

