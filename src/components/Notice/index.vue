<template>
  <el-dropdown trigger="click">
    <el-badge :is-dot="target" :max="99" style="position:relative;top: 8px">
      <i class="el-icon-message-solid" id="noticeIcon"></i>
    </el-badge>
    <el-dropdown-menu  slot="dropdown" >
      <el-dropdown-item v-for="(item,index) in noticeSlims"><div @click="sendNoticeDetail(index)">{{item}}</div></el-dropdown-item>
      <el-dropdown-item style="text-align: right"><div @click="sendAllNotice()">更多通知</div></el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

</template>

<script>
  import { listNotice } from "@/api/system/notice";
  import bus from '../../bus.js'
  export default {
    name: "Notice",
    data(){
      return{
        //通知列表
        noticeList: [],
        noticeSlims:[],
        //通知条数
        noticetotal:0,
        // 通知查询参数
        noticeParams: {
          pageNum: 1,
          pageSize: 5,
          status: '1',
        },
        noticeDetail:{
          visible:false,
          title:null,
          content:null,
          updateTime:null,
          publisher:null,
        },
        // 图标小红点参数
        target:false
      }
    },
    created() {
      // 获取最近的公告
      this.getNoticeList();
    },
    methods:{
      /* 查询公告列表 */
      getNoticeList() {
        listNotice(this.noticeParams).then(response => {
          this.noticeList = response.rows;
          this.noticetotal = response.total;
          if(this.noticetotal>0) this.target=true;
          for(let item of this.noticeList){
            let day=item.updateTime.split(' ');
            this.noticeSlims.push(item.noticeTitle+" ["+day[0]+"]")
          }
        });
      },
      /* 发送详细公告内容 */
      sendNoticeDetail(index) {
        this.noticeDetail.visible=true;
        this.noticeDetail.title=this.noticeList[index].noticeTitle;
        this.noticeDetail.content=this.noticeList[index].noticeContent;
        this.noticeDetail.updateTime=this.noticeList[index].updateTime;
        this.noticeDetail.publisher=this.noticeList[index].nickname;
        bus.$emit('sendNoticeDetail',this.noticeDetail);
      },
      /* 发送所有公告通知 */
      sendAllNotice(){
        bus.$emit('sendAllNotice',this.noticeList);
      }
    }
  }
</script>
<style lang="scss" scoped>
  #noticeIcon{
    font-size: 23px;
    position:relative;
    top: -6px
  }
  #noticeIcon:hover{
    cursor: pointer;
  }
</style>
