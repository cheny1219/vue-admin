<template>
  <div class="app-container">
    <div class="title">
      <p>問題基本資料:</p>
    </div>
    <el-row>
      <el-col :span="10">
        <el-form-item label="問題分類:" class="is-required">
          <el-input />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item label="問題分類:" class="is-required">
          <el-input />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item label="問題標題:" class="is-required">
          <el-input />
        </el-form-item>
      </el-col>
      <el-col :span="6" :offset="2">
        繁體中文，100字以內
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;">
          <el-input />
        </el-form-item>
      </el-col>
      <el-col :span="6" :offset="2">
        英文，150字以內
      </el-col>

    </el-row>
    <div class="title">
      <p>問題正文:</p>
    </div>
    <el-row>
      <el-col :span="1" :offset="1">
      </el-col>
      <el-col :span="22">
        <el-form-item label="中文:" class="is-required">
          富文本編輯器
        </el-form-item>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="1" :offset="1">
      </el-col>
      <el-col :span="22">
        <el-form-item label="&nbsp;英文:">
          富文本編輯器
        </el-form-item>
      </el-col>
    </el-row>

    <div class="title">
      <p>標籤:</p>
    </div>
   <el-row>
     <el-col :span="1" :offset="1">
     </el-col>
    <el-col :span="2">
      <el-form-item label="標籤:"/>
    </el-col>
    <el-col :span="2" :offset="1">
      <el-input />
    </el-col>
    <el-col :span="2" :offset="1">
      <el-input />
    </el-col>
    <el-col :span="2" :offset="1">
      <el-input />
    </el-col>
    <el-col :span="2" :offset="1">
      <el-input />
    </el-col>
    <el-col :span="2" :offset="1">
      <el-input />
    </el-col>
   </el-row>
  </div>
</template>

<script setup name="Help">
const route = useRoute(); // 使用 useRoute 钩子
const helpType = route.query.helpType;
const { proxy } = getCurrentInstance()

const data = reactive({

})

</script>
<style lang="scss">
.title{
  width: 100%;background-color: #b4d5ff;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  margin-bottom: 10px;
}
.title p{
  font-size: 16px;
}
</style>
