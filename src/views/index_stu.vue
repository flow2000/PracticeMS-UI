<template>
  <div class="app-container home" >

      <el-row :gutter="20">
        <el-col :sm="24" :lg="24">
          <div class="mc-ui-grid-item top-panle">
            <div style="font-size:xx-large;color: #1c84c6;width: 30%;float: left">
                <div style="padding-top: 30px;font-size: x-large;color: #0eaa8b;">{{this.timeState}},{{roleGroup}} {{user.nickName}}</div>
            </div>
            <div>
              <el-image :src="qrCode" style="width: 100px; float: right"></el-image>
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
        </el-col>
      </el-row>


    <el-row :gutter="20">
      <el-col :sm="24" :lg="16">
        <div class="mc-ui-grid-item left-mid">
          <span>考勤记录</span>
          <hr/>
          <el-calendar v-model="mouthNow">
            <template
              slot="dateCell"
              slot-scope="{date, data}">
              {{ data.day.split('-').slice(2).join('-') }}
              <div v-for="item in punchSucceedDate">
                <div v-if="item.indexOf(data.day)!==-1">
                  <p style="text-align: center"><i class="el-icon-success" style="color: #0ab685"/>签到成功</p>
                </div>
              </div>
              <div v-for="item in punchFailedDate">
                <div v-if="item.indexOf(data.day)!==-1">
                  <p style="text-align: center"><i class="el-icon-error" style="color: #dc1a2e"/>签到失败</p>
                </div>
              </div>
            </template>
          </el-calendar>
        </div>
      </el-col>
      <el-col :sm="24" :lg="8">
        <div class="mc-ui-grid-item right-mid" style=" width: auto;margin:1%;min-height: 730px">

        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import { getUserProfile } from '../api/system/user'
  import{listPunch} from '../api/punch/punch'
  import bus from '../bus'
  import qr from '@/assets/images/qr.png'

  export default {
    name: 'index_stu',
    data(){
      return{
        // 用户信息
        user: {},
        //二维码
        qrCode: qr,
        roleGroup: {},
        // 当前月份信息
        mouthNow:new Date(),
        //通知列表
        noticeList: [],
        noticeSlims:[],
        timeState : null,
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
        // 考勤记录查询参数
        punchParams:{
          userName:null,
        },
        // 考勤记录
        punchList:[],
        // 考勤总数
        punchTotal:null,
        // 成功考勤记录日期
        punchSucceedDate:[],
        // 失败考勤记录日期
        punchFailedDate:[],
      }
    },
    created() {
      // 获取当前用户信息
      this.getUser();
      this.getTimeState();
    },
    updated() {
      // 考勤记录参数设置
      this.punchParams.userName=this.user.userName;
    },
    methods:{
      /* 获取当前用户信息 */
      getUser() {
        getUserProfile().then(response => {
          this.user = response.data;
          //console.log(this.user)
          this.roleGroup = response.roleGroup;
          if(this.roleGroup!=="实习学生"){
            this.$message.error('请使用实习学生角色打开首页(学生端)');
            this.$router.replace({ path: "/index" }).catch(()=>{});
          }

        });
      },
      getTimeState() {
        // 获取当前时间
        let timeNow = new Date();
        // 获取当前小时
        let hours = timeNow.getHours();
        // 设置默认文字
        let text = ``;
        // 判断当前时间段
        if (hours >= 4 && hours <= 10) {
          text = `早上好`;
        } else if (hours > 10 && hours <= 14) {
          text = `中午好`;
        } else if (hours > 14 && hours <= 18) {
          text = `下午好`;
        } else if (hours > 18 && hours <= 24 || hours < 4) {
          text = `晚上好`;
        }
        console.log(text)
        // 返回当前时间段对应的状态
        this.timeState = text
      },
      /* 获取考勤记录 */
      getPunch(){
        //console.log(this.punchParams)
        listPunch(this.punchParams).then(response => {
          this.punchList=response.rows;
          // 提取考勤记录日期为列表
          for(let item of this.punchList){
            if(item.status==='0')
              this.punchSucceedDate.push(item.createTime);
            else
              this.punchFailedDate.push(item.createTime);
          }
          this.punchTotal=response.total;
        })
      }
    },
    mounted() {
      // 获取考勤记录
      this.getPunch();
      // 接收详细公告信息
      bus.$on('sendNoticeDetail',(detail)=>{
        this.noticeDetail=detail;
        this.noticeDetail.visible=true;
      });
      //接收全部公告信息
      bus.$on('sendAllNotice',list=>{
        this.noticeList=list;
        this.allNotice.visible=true;
      });
    }
  }
</script>

<style scoped>
  .top-panle{
    padding: 1% 1.5%;
    margin-bottom: 1.5%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
    height: 130px;
    max-width: 100%;
  }

  .left-mid {
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }

  .right-mid {
    padding: 2%;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 3px 3px 10px 0px rgba(1,1,1,0.2);
  }
</style>
