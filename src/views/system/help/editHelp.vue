<template>
  <div class="app-container">
    <el-form ref="helpRef" :model="tableForm" :rules="rules">
      <div class="title">
        <p>問題基本資料:</p>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="問題分類:" class="is-required" prop="category">
            <el-row>
              <el-col :span="12">
                <el-select v-model="tableForm.CategoryID" @change="initSubCategory" placeholder="請選擇問題一級分類"
                           clearable style="width: 200px">
                  <el-option
                      v-for="dict in category_select"
                      :key="dict.CategoryID"
                      :label="dict.CategoryName"
                      :value="dict.CategoryID"
                  />
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select v-model="tableForm.SubCategoryID" v-show="subCategory_select.length>0"
                           placeholder="請選擇問題二級分類" clearable style="width: 200px">
                  <el-option
                      v-for="dict in subCategory_select"
                      :key="dict.CategoryID"
                      :label="dict.CategoryName"
                      :value="dict.CategoryID"
                  />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="問題標題:" prop="title" class="is-required">
            <el-input
                v-model="tableForm.Title"/>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="2">
          繁體中文，100字以內
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item
              label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;">
            <el-input
                v-model="tableForm.TitleEN"/>
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
        <el-col :span="24">
          <el-form-item label="中文:" prop="content" class="is-required">
            <div>
              <vue-ueditor-wrap v-model="tableForm.Content"
                                ref="UE_CN"
                                editor-id="editorCN"
                                :config="editorConfig"
                                autoHeightEnabled="false"
                                :editorDependencies="['ueditor.config.js','ueditor.all.js']"
                                style="height:500px;width: 80%"
                                @ready="editorCNReady"/>
            </div>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="&nbsp;英文:">
            <div>
              <vue-ueditor-wrap v-model="tableForm.ContentEN"
                                ref="UE_EN"
                                editor-id="editorEN"
                                autoHeightEnabled="false"
                                :config="editorConfig"
                                :editorDependencies="['ueditor.config.js','ueditor.all.js']"
                                style="height:550px;width: 80%"
                                @ready="editorENReady"/>
            </div>
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
          <el-input v-model="label[0]"/>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-input v-model="label[1]"/>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-input v-model="label[2]"/>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-input v-model="label[3]"/>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-input v-model="label[4]"/>
        </el-col>
      </el-row>
      <div class="title">
        <p>問題適用於:</p>
      </div>
      <el-row>
        <el-col :span="2">
          <el-form-item label="PMS類型:"/>
        </el-col>
        <el-col :span="19" :offset="1">
          <el-checkbox-group v-model="setArray">
            <el-checkbox
                v-for="(item, index) in setList"
                :key="item.SetID"
                :label="item.SetName"
                :value="item.SetID"
                size="large"
            />
          </el-checkbox-group>
        </el-col>
      </el-row>
      <div class="title">
        <p>問題推薦</p>
      </div>
      <el-row>
        <el-col :span="2">
          <el-checkbox label="常見問題" v-model="tableForm.IsCommon"/>
        </el-col>
        <el-col :span="10" :offset="1" style="line-height: 32px;">
          顯示在幫助中心常見列表中
        </el-col>
      </el-row>
      <el-row v-show="tableForm.IsCommon">
        <el-col :span="8">
          <el-form-item label="顯示排序:" prop="cs" class="is-required">
            <el-input
                v-model.number="tableForm.CommonSequence"
                type="number"
                min="0"
                max="100"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="2">
          <el-checkbox label="熱門問題" v-model="tableForm.IsHot"/>
        </el-col>
        <el-col :span="10" :offset="1" style="line-height: 32px;">
          <span>顯示在搜索框彈出的熱門問題列表中</span>
        </el-col>
      </el-row>
      <el-row v-show="tableForm.IsHot">
        <el-col :span="8">
          <el-form-item label="顯示排序:" prop="hs" class="is-required">
            <el-input
                v-model.number="tableForm.HotSequence"
                type="number"
                min="0"
                max="100"/>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="fixed-buttons">
        <el-button>取消</el-button>
        <el-button type="primary" @click="onSubmit">發佈</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup name="Help">
import {getCategory, getSetIds, edit, getHelpById} from "@/api/system/help"

const route = useRoute(); // 使用 useRoute 钩子
const helpType = route.query.helpType;
const HelpcenterID = route.query.HelpcenterID;
const {proxy} = getCurrentInstance()
const setList = ref([])
const setArray = ref([])
let category_select = ref([])
let subCategory_select = ref([])
const UE_CN = ref(null)
const UE_EN = ref(null)
let label = ref(['','','','',''])
const editorConfig = {
  autoHeightEnabled:false,
  // 后端服务地址，后端处理参考
  // https://open-doc.modstart.com/ueditor-plus/backend.html
  // serverUrl: 'http://127.0.0.1:8088/infomationmanage/ueconfig',
  UEDITOR_HOME_URL: '/ueditor/',
  UEDITOR_CORS_URL: '/ueditor/',
  loadConfigFromServer: false,
}
const data = reactive({
  tableForm: {
    HelpcenterID:null,
    HelpType: helpType,
    CategoryID: '',
    SubCategoryID: '',
    Title: '',
    TitleEN: '',
    Content: '',
    ContentEN: '',
    Lable: '',
    SetID: '',
    IsCommon: false,
    IsCommonShow: false,
    CommonSequence: null,
    IsHot: false,
    IsHotShow: false,
    HotSequence: null
  }
})
const {tableForm} = toRefs(data)
const rules = {
  category: [{ validator: validateCategory, trigger: 'blur', message: "請選擇問題分類" }],
  title: [{ validator: validateTitle, trigger: "blur", message: "中文標題不得為空" }],
  content: [{ validator: validateContent, trigger: "blur", message: "中文正文不得為空" }],
  hs: [{ validator: validateHs, trigger: 'blur', message: "熱門排序不得為空" }],
  cs: [{ validator: validateCs, trigger: 'blur', message: "常見排序不得為空" }],
}

function validateTitle(r,v,callback){
  if(tableForm.value.Title === '' || tableForm.value.Title.trim() === ''){
    callback(new Error('中文標題不得為空'));
  } else {
    callback();
  }
}
function validateContent(r,v,callback){
  if(tableForm.value.Content === '' || tableForm.value.Content.trim() === ''){
    callback(new Error('中文正文不得為空'));
  } else {
    callback();
  }
}

function validateCategory(r,v,callback){
  if(!tableForm.value.CategoryID || tableForm.value.CategoryID === ''){
    callback(new Error('請選擇問題分類'));
  } else if(subCategory_select.length > 0 && tableForm.value.SubCategoryID === ''){
    callback(new Error('請選擇問題二级分類'));
  } else {
    callback();
  }
}

function validateHs(r,v,callback){
  if(tableForm.value.IsHot && tableForm.value.HotSequence === null){
    callback(new Error('熱門排序不得為空'));
  } else {
    callback();
  }
}
function validateCs(r,v,callback){
  if(tableForm.value.IsCommon && tableForm.value.CommonSequence === null){
    callback(new Error('常見排序不得為空'));
  } else {
    callback();
  }
}
/** 发布按钮事件 */
function onSubmit() {
  getParam()
  proxy.$refs.helpRef.validate(valid => {
    if(valid){
      edit(tableForm.value).then(response => {
        if(response.msg === 'success'){
          proxy.$modal.msgSuccess("保存成功")
          proxy.$tab.closePage()
        }else{
          proxy.$modal.msgError(response.content)
        }
      })
    }
  })

}

/** 参数整合 */
function getParam() {
  tableForm.value.HelpcenterID = HelpcenterID
  tableForm.value.Content = UE.getEditor('editorCN').getContent()
  tableForm.value.ContentEN = UE.getEditor('editorEN').getContent()
  tableForm.value.SetID = setArray.value.join(',')
  tableForm.value.Lable = label.value.filter(item => item && item.trim() !== '').join(',')
  if(!tableForm.value.IsHot){
    tableForm.value.HotSequence = null
    tableForm.value.IsHotShow = null
    tableForm.value.IsHot = null
  }
  if(!tableForm.value.IsCommon){
    tableForm.value.CommonSequence = null
    tableForm.value.IsCommonShow = null
    tableForm.value.IsCommon = null
  }
}
/** 初始化一级下拉 */
function initCategory() {
  getCategory({'level': 1, 'helpType': 2}).then(response => {
    category_select.value = response
  })
}

/** 下拉联动 */
function initSubCategory(val) {
  if (!val) {
    subCategory_select.value = []
    tableForm.value.SubCategoryID = ''
  }else{
    getCategory({'pid': val, 'helpType': 2}).then(response => {
      subCategory_select.value = response
    })
  }
}

/** 获取UE示例 */
function editorCNReady(editor) {
  UE_CN.value = editor
  UE_CN.value.setHeight(300);
}

function editorENReady(editor) {
  UE_EN.value = editor
  UE_EN.value.setHeight(300);
}
function initData(){
  getHelpById({'HelpcenterID': HelpcenterID}).then(resp => {
    tableForm.value.CategoryID = resp.help.CategoryID
    tableForm.value.SubCategoryID = resp.help.SubCategoryID
    tableForm.value.Title = resp.help.Title
    tableForm.value.TitleEN = resp.help.TitleEN
    tableForm.value.Content = resp.help.Content
    tableForm.value.ContentEN = resp.help.ContentEN
    tableForm.value.IsCommon = resp.help.IsCommon
    tableForm.value.IsCommonShow = resp.help.IsCommonShow
    tableForm.value.CommonSequence = resp.help.CommonSequence
    tableForm.value.IsHot = resp.help.IsHot
    tableForm.value.IsHotShow = resp.help.IsHotShow
    tableForm.value.HotSequence = resp.help.HotSequence
    if(resp.help.Lable !==  ''){
      const temp = resp.help.Lable.split(',')
      for (let i = 0; i < temp.length; i++) {
        label.value[i] = temp[i]
      }
    }
    tableForm.value.SetID = setArray.value = resp.help.SetID.split(',').map(item => parseInt(item, 10))
  })
}
initData()
getSetIds().then(resres => {
  setList.value = resres
})
initCategory()
</script>
<style lang="scss">
.title {
  width: 100%;
  background-color: #b4d5ff;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  margin-bottom: 10px;
}

.title p {
  font-size: 16px;
}

.fixed-buttons {
  width: 140px;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 50%;
  right: 0;
  background: #ffffff00;
  padding: 10px 0;
  z-index: 999999;
  margin-left: 0 !important;
  text-align: center; /* 水平居中 */
  justify-content: center;
}
</style>
