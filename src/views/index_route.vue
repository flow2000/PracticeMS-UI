<template>

</template>

<script>
  import { getUserProfile} from '../api/system/user'
  export default {
    name: 'index_route',
    data(){
      return{
        // 用户信息
        user: {},
        roleGroup: {}
      }
    },
    created() {
      this.getUser()
    },
    methods:{
      getUser(){
        getUserProfile().then(response => {
          console.log("进入了index_route")
          this.user = response.data;
          this.roleGroup = response.roleGroup;
          if(this.roleGroup==="实习学生"){
            this.$store.dispatch('tagsView/delView', this.$route).then(() => {
              this.$router.push({path:'/index_stu'}).catch(()=>{});
            });
          }else {
            this.$store.dispatch('tagsView/delView', this.$route).then(() => {
              this.$router.push({path:'/index'}).catch(()=>{});
            });
          }
        });
      }
    }

  }
</script>

<style scoped>

</style>
