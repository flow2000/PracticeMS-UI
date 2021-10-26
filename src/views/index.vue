<template>
  <div id="magicalDragScene" class="mc-root mc-ui-absolute-pane" style="height: 1000px;" mcnetline="100">
    <div id="main-panel" class="mc-ui-grid-pane" style="height: 1000px; width: auto;margin: 1% 1%">

      <div class="mc-ui-grid-item top-panel">
        <div style="font-size:xx-large;color: #1c84c6">|欢迎使用本系统！</div>
        <div style="font-size: x-large;color: #0eaa8b">-{{roleGroup}}：{{user.nickName}}</div>
      </div>

      <div class="mc-ui-grid-item right-top">
        <div id="chart1" style="width: 100%;height: 100%"></div>
      </div>

      <div class="mc-ui-grid-item left-top1" >
        <p style="text-align: left;color: #7f7f7f;font-size:large;margin: 10px">管理用户数量</p>
        <hr/>
        <p style="text-align: center;color:#2495b8;font-size: 50px;margin: 40px">56</p>
      </div>
      <div class="mc-ui-grid-item left-top2" >
        <p style="text-align: left;color: #7f7f7f;font-size:large;margin: 10px">今日打卡人数</p>
        <hr/>
        <p style="text-align: center;color:#2495b8;font-size: 50px;margin: 40px">48</p>
      </div>

      <div class="mc-ui-grid-item left-mid">
        <div id="chart2" style="width:100%;height: 100%"></div>
      </div>

      <div class="mc-ui-grid-item right-mid">
        <p style="text-align: left;color: #7f7f7f;font-size:larger;margin: 0px">公告栏</p>
        <hr/>
        <el-table
          :data="noticeList"
          style="width: 100%"
          v-loading="noticeloading"
          @row-click="noticeOpenRow"
          height="250">
            <el-table-column
              prop="noticeTitle"
              align="center"
              label="标题"
              width="500">
            </el-table-column>
            <el-table-column
              align="center"
              prop="nickname"
              label="发布人"
              sortable
              width="150">
            </el-table-column>
            <el-table-column
              align="center"
              class-name="small-padding fixed-width"
              prop="createTime"
              sortable
              label="发布时间"
              >
            </el-table-column>
        </el-table>
<!--        <el-popover-->
<!--          v-for="item in noticeList"-->
<!--          placement="top-start"-->
<!--          :title="item.noticeTitle"-->
<!--          width="600"-->
<!--          trigger="hover"-->
<!--          :content="item.noticeContent">-->
<!--          <el-table :data="item" slot="reference"  style="width: 90%;height: 40px;margin-top: 12px;font-size: medium">-->

<!--          </el-table>-->
<!--        </el-popover>-->
      </div>

      <el-dialog
        style="top: 30%"
        :title="noticeTitle"
        :visible.sync="noticeVisible"
        width="30%">
        <div v-html="noticeContent"></div>
        <span slot="footer" class="dialog-footer">

       </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import { getUserProfile } from '../api/system/user'
import * as echarts from 'echarts'
import { listNotice, getNotice, delNotice, addNotice, updateNotice } from "@/api/system/notice";
export default {

  name: "index",
  data() {
    return {
      // 版本号
      version: "3.6.0",
      // 用户信息
      user: {},
      //通知的可视
      noticeVisible:false,
      noticeTitle: '',
      noticeContent: '',
      //通知列表
      noticeList: [],
      //列表加载
      noticeloading:true,
      //通知条数
      noticetotal:0,
      // 查询参数
      noticeParams: {
        pageNum: 1,
        pageSize: 10,
        noticeTitle: undefined,
        createBy: undefined,
        status: undefined
      },
      roleGroup: {},
    };
  },
  created() {
    // 获取当前用户信息
    this.getUser();
    this.getNoticeList();

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
        console.log(this.noticeList);
      });
    },

    /* 公告表单的行事件 */
    noticeOpenRow(row) {
      this.noticeVisible = true;
      this.noticeTitle = row.noticeTitle;
      this.noticeContent = row.noticeContent;
      // console.log(row);

    },

    // 获取当前用户信息
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        //console.log(this.user.nickName)
        //console.log(this.roleGroup)
      });
    },

    // 绘图
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
      let chart1 = echarts.init(document.getElementById('chart1'))
      let chart2 =echarts.init(document.getElementById('chart2'))
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
      })
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
</style>

<!--首页元素布局-->
<style type="text/css">
  #main-panel{
    display: grid;
    grid-template-columns: 0.7fr 1.3fr;
    grid-template-rows:0.2fr 0.5fr 0.5fr 0.8fr;
    gap: 2% 2%;
    grid-template-areas:
      "top-panel top-panel"
      "left-top1 right-top"
      "left-top2 right-top"
      "left-mid right-mid"
      ". .";
  }
  .top-panel{
    grid-area: top-panel;
    padding: 1.5%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

  .right-top {
    grid-area: right-top;
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

  .left-top1 {
    grid-area: left-top1;
    padding: 1.5%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

  .left-top2 {
    grid-area: left-top2;
    padding: 1.5%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

  .left-mid {
    grid-area: left-mid;
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

  .right-mid {
    grid-area: right-mid;
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

</style>

