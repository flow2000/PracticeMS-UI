<template>
  <div id="magicalDragScene" class="mc-root mc-ui-absolute-pane" style="height: 1000px;min-height: 1000px;min-width: 1500px" mcnetline="100">
    <div id="main-panle" class="mc-ui-grid-pane" style="height: 1000px; width: auto;margin:1%;min-height: 1000px;min-width: 1500px">
      <div class="mc-ui-grid-item top-panle">
        <div style="font-size:xx-large;color: #1c84c6;width: 30%;position: relative;float: left">
          |欢迎使用本系统！<br />
          <div style="font-size: x-large;color: #0eaa8b;">-{{roleGroup}}：{{user.nickName}}</div>
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

      <div class="mc-ui-grid-item right-mid">

      </div>
    </div>

  </div>
</template>

<script>
  import { getUserProfile } from '../api/system/user'
  import{listPunch} from '../api/punch/punch'
  import bus from '../bus'

  export default {
    name: 'index_stu',
    data(){
      return{
        // 用户信息
        user: {},
        roleGroup: {},
        // 当前月份信息
        mouthNow:new Date(),
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
          console.log(this.punchSucceedDate)
          console.log(this.punchFailedDate)
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
  #main-panle{
    display: grid;
    grid-template-columns:0.3fr 0.3fr 0.4fr ;
    grid-template-rows:0.1fr 0.6fr 0.25fr 0.05fr;
    gap: 1% 1%;
    grid-template-areas:
      "top-panle top-panle top-panle"
      "left-mid left-mid right-mid"
      "left-mid left-mid right-mid"
      "left-bottom left-bottom right-bottom"
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
