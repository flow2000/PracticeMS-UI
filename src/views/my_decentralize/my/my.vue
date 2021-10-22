<template>
  <div class="app-container">
  <el-descriptions class="margin-top" title="实习基本信息" :column="3" :size="size" border>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        姓名
      </template>
      <span v-if="practiceInfo != null">{{ practiceInfo.user.nickName }}</span>
      <span v-if="practiceInfo == null">暂无</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        手机号
      </template>
      <span v-if="practiceInfo != null">{{ practiceInfo.user.phonenumber }}</span>
      <span v-if="practiceInfo == null">暂无</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-location-outline"></i>
        指导老师
      </template>
      <span v-if="practiceInfo != null">{{ practiceInfo.info.teacher.nickName }}</span>
      <span v-if="practiceInfo == null">暂无</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-office-building"></i>
        实习单位
      </template>
      <span v-if="practiceInfo != null">{{ practiceInfo.info.baseInfo.baseName }}</span>
      <span v-if="practiceInfo == null">暂无</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-tickets"></i>
        实习岗位
      </template>
      <span v-if="practiceInfo != null">{{ practiceInfo.info.postName }}</span>
      <span v-if="practiceInfo == null">暂无</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-office-building"></i>
        实习公司
      </template>
      <span v-if="practiceInfo != null">{{ practiceInfo.info.baseInfo.companyName }}</span>
      <span v-if="practiceInfo == null">暂无</span>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-office-building"></i>
        实习详细地点
      </template>
      <span v-if="practiceInfo != null">{{ practiceInfo.info.baseInfo.baseAddress }}</span>
      <span v-if="practiceInfo == null">暂无</span>
    </el-descriptions-item>
  </el-descriptions>

    <div v-if="practiceInfo == null"><span>您还未进行实习，<el-button type="text" @click="dialogVisible = true">点击此处</el-button>申请分散实习</span></div>

    <el-dialog :visible.sync="dialogVisible" :title="title" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生编号" prop="stuId">
          <el-input v-model="form.stuId" placeholder="请输入实习学生学号" />
        </el-form-item>
        <el-form-item label="经营范围" prop="businessScope">
          <el-input v-model="form.businessScope" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input v-model="form.notes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="审核人" prop="auditorName">
          <el-input v-model="form.auditorId" placeholder="请输入审核人ID" />
        </el-form-item>
        <el-form-item label="审核时间" prop="auditTime">
          <el-date-picker clearable size="small"
                          v-model="form.auditTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择审核时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
        <el-form-item label="实习地点" prop="locationId">
          <el-input v-model="form.locationId" placeholder="请输入实习地点编号" />
        </el-form-item>
        <el-form-item label="实习单位接收实习证明" prop="acceptanceCertificate">
          <el-upload
            :action="uploadUrl"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            name="file"
            :show-file-list="false"
            :headers="headers"
            style="display: none"
            ref="upload"
            v-if="this.type == 'url'"
          >
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStudentPracticeInfo } from "@/api/decentralize/decentralize";

export default {
  props: {
    /* 编辑器的内容 */
    value: {
      type: String,
      default: "",
    },
    /* 高度 */
    height: {
      type: Number,
      default: null,
    },
    /* 最小高度 */
    minHeight: {
      type: Number,
      default: null,
    },
    /* 只读 */
    readOnly: {
      type: Boolean,
      default: false,
    },
    /* 类型（base64格式、url格式） */
    type: {
      type: String,
      default: "url",
    }
  },
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      size: '',
      practiceInfo : [],
      dialogVisible: false,
      form : []
    }
  },
  created() {
    this.getStudentPracticeInfo()
  },
  methods: {
    /** 查询学生实习信息 */
    getStudentPracticeInfo() {
      this.loading = true;
      getStudentPracticeInfo().then(response => {
        this.practiceInfo = response.data;
        console.log(this.practiceInfo)
        this.loading = false;
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
}

</script>
<style>
</style>
