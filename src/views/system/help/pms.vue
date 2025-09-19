<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item prop="postCode">
        <el-input
            v-model="queryParams.Title"
            placeholder="請輸入問題標題"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="postName">
        <el-input
            v-model="queryParams.HelpcenterID"
            placeholder="請輸入問題ID"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="queryParams.CategoryID" @change="initSubCategory" placeholder="請選擇問題一級分類" clearable style="width: 200px">
          <el-option
              v-for="dict in category_select"
              :key="dict.CategoryID"
              :label="dict.CategoryName"
              :value="dict.CategoryID"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="queryParams.SubCategoryID" placeholder="請選擇問題二級分類" clearable style="width: 200px">
          <el-option
              v-for="dict in subCategory_select"
              :key="dict.CategoryID"
              :label="dict.CategoryName"
              :value="dict.CategoryID"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="queryParams.IsShow" placeholder="請選擇顯示狀態" clearable style="width: 200px">
          <el-option
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="queryParams.IsCommon" placeholder="是否常見問題" clearable style="width: 200px">
          <el-option
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="queryParams.IsHot" placeholder="是否熱門問題" clearable style="width: 200px">
          <el-option
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-date-picker
            clearable
            v-model="createTime"
            type="daterange"
            range-separator="To"
            date-format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            start-placeholder="创建-开始时间"
            end-placeholder="创建-结束时间"
        />
      </el-form-item>
      <el-form-item prop="status">
        <el-date-picker
            clearable
            v-model="updateTime"
            type="daterange"
            range-separator="To"
            date-format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            start-placeholder="修改-开始时间"
            end-placeholder="修改-结束时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button icon="Edit" @click="handleAdd">添加問題</el-button>
        <el-button icon="Memo" @click="toHelpType">熱門/常見問題</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="helpList">
      <el-table-column label="問題ID" align="center" prop="HelpcenterID" />
      <el-table-column label="問題標題" align="center" prop="Title" />
      <el-table-column label="問題一級分類" align="center" width="150" prop="CategoryDesc" />
      <el-table-column label="問題二級分類" align="center" width="150" prop="SubCategoryDesc" />
      <el-table-column label="常見問題" align="center" prop="IsCommon">
        <template #default="scope">
          {{scope.row.IsCommon ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column label="熱門問題" align="center" prop="IsHot">
        <template #default="scope">
          {{scope.row.IsHot ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column label="顯示狀態" align="center" prop="IsShow">
        <template #default="scope">
          {{scope.row.IsShow ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column label="是否置頂" align="center" prop="IsTop">
        <template #default="scope">
          {{scope.row.IsTop ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="CreateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.CreateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="UpdateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.UpdateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="220" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="handleTop(scope.row)" v-show="!scope.row.IsTop">置顶</el-button>
          <el-button link type="primary" @click="handleManageTop(scope.row)" v-show="scope.row.IsTop">管理置顶</el-button>
          <el-button link type="primary" @click="handleDown(scope.row)" v-show="scope.row.IsShow">下架</el-button>
          <el-button link type="primary" @click="handleDown(scope.row)" v-show="!scope.row.IsShow">上架</el-button>
          <el-button link type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.limit"
        @pagination="getList"
    />


    <!--    置顶弹框-->
    <el-dialog :title="title" v-model="openTop" width="600px" append-to-body>
      <el-form ref="postRef" :model="topForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="10">
            <el-select v-model="topFormSelect" @change="onChange" clearable style="width: 200px">
              <el-option
                  v-for="dict in [{'id':1,'label':'影片連結'},{'id':2,'label':'上傳圖片'} ]"
                  :key="dict.id"
                  :label="dict.label"
                  :value="dict.id"
              />
            </el-select>
          </el-col>
          <el-col :span="14">
            <div v-show="topFormSelect === 2">
              <el-upload
                  :http-request="upload"
                  :multiple="false"
                  :with-credentials="true"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
              >
                <el-button>
                  选择
                  <el-icon class="el-icon--right"><Upload /></el-icon>
                </el-button>
              </el-upload>
              <el-image style="width: 100px; height: 100px" :src="topForm.ImagePath" fit="cover" />
              <br>
              <span class="demonstration">支持擴展名：.png .jpg 建議分辨率:460*260</span>
            </div>

            <div v-show="topFormSelect === 1">
              <el-input v-model="topForm.VideoPath" style="width: 300px" placeholder="請輸入YouTube或Facebook網站影片連結" />
              <br>
              <span class="demonstration" style="color:red">請輸入YouTube或Facebook網站影片連結</span>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" v-show="title==='設置置頂'">确 定</el-button>
          <el-button type="primary" @click="unTop" v-show="title==='置頂管理'">取消置頂</el-button>
          <el-button @click="submitForm" v-show="title==='置頂管理'">保 存</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Help">
import { listHelp,getCategory,editTop,checkCount,downHelp,delHelp } from "@/api/system/help"
import { uploadImage } from "@/api/system/upload"
const router = useRouter()

const { proxy } = getCurrentInstance()
const sys_normal_disable = [{'value':1,label:'是'},{'value':0,label:'否'}]

const helpList = ref([])
const openTop = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const title = ref("")
const createTime = ref([])
const updateTime = ref([])
let category_select = ref([])
let subCategory_select = ref([])
let topFormSelect = ref(2)
const data = reactive({
  topForm: {},
  queryParams: {
    helpType: 2,
    page: 1,
    limit: 10,
    Title: "",
    HelpcenterID: null,
    CategoryID: null,
    SubCategoryID: null,
    IsShow: null,
    IsCommon: null,
    IsHot: null,
    createstartTime: '',
    createendTime: '',
    updatestartTime: '',
    updateendTime: ''
  }
})

const { queryParams, topForm, rules } = toRefs(data)
watch(createTime,(newVal,oldVal)=>{
  if (newVal !== null) {
    queryParams.value.createstartTime = newVal[0]
    queryParams.value.createendTime = newVal[1]
  } else {
    queryParams.value.createstartTime = null
    queryParams.value.createstartTime = null
  }
})
watch(updateTime,(newVal,oldVal)=>{
  if (newVal !== null) {
    queryParams.value.updatestartTime = newVal[0]
    queryParams.value.updateendTime = newVal[1]
  } else {
    queryParams.value.updatestartTime = null
    queryParams.value.updateendTime = null
  }
})
/** 查询岗位列表 */
function getList() {
  loading.value = true
  console.log(queryParams.value)
  listHelp(queryParams.value).then(response => {
    helpList.value = response.data.list
    total.value = response.data.total
    loading.value = false
  })
}


/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  location.reload();
}

/** 初始化一级下拉 */
function initCategory(){
  getCategory({'level':1,'helpType':2}).then(response => {
    category_select.value = response
  })
}

/** 下拉联动 */
function initSubCategory(val){
  if(!val){
    subCategory_select = []
  }
  getCategory({'pid':val,'helpType':2}).then(response => {
    subCategory_select = response
  })
}

/** 新增按钮操作 */
function handleAdd() {
  router.push({ path: '/help/addHelp',query: { helpType: 2 } })
}
/** 热门/常见问题按钮操作 */
function toHelpType() {
  router.push({ path: '/help/helpType',query: { helpType: 2 } })
}
toHelpType
/** 修改按钮操作 */
function handleUpdate(row) {
  router.push({ path: '/help/editHelp',query: { helpType: 2,HelpcenterID:row.HelpcenterID } })
}

/** 置顶按钮操作 */
function handleTop(row) {
  reset()
  topFormSelect.value = 2
  title.value = "設置置頂"
  openTop.value = true
  topForm.value.HelpcenterID = row.HelpcenterID
  topForm.value.IsTop=1
}
/** 置顶管理按钮操作 */
function handleManageTop(row) {
  reset()
  title.value = "置頂管理"
  openTop.value = true
  topForm.value.HelpcenterID = row.HelpcenterID
  topForm.value.IsTop=1
  topForm.value.VideoPath=row.VideoPath
  topForm.value.ImagePath=row.ImagePath
  topFormSelect.value = row.VideoPath ? 1 : 2
}
/** 下架按钮操作 */
function handleDown(row) {
  title.value = ''
  const content = !row.IsShow ? '上架後幫助中心將顯示出該問題<br><span style="color: red;">是否確認上架？</span>' : '下架後幫助中心將不再顯示該問題<br><span style="color: red;">是否確認下架？</span>'
  proxy.$modal.confirms(
      content,
      '',
      {
        dangerouslyUseHTMLString: true,
        type: 'warning',
        icon: 'Warning',
        confirmButtonText: '是,確認',
        cancelButtonText: '取消',
      }
  ).then(function() {
    downHelp({'HelpcenterID':row.HelpcenterID,'IsShow':row.IsShow}).then(response => {
      proxy.$modal.msgSuccess("操作成功")
      getList()
    })
  })
  console.log(row)
}
/** 提交按钮前检查参数 */
function handSubmitcheck(){
  if (topFormSelect.value === 1) {
    if (topForm.value.VideoPath === '' || topForm.value.VideoPath.trim() === '') {
      proxy.$modal.alertWarning("請填寫YouTube或Facebook網站影片連結")
      return false
    }else if(topForm.value.VideoPath.indexOf("youtube.com") === -1
        && topForm.value.VideoPath.indexOf("facebook.com") === -1
        && topForm.value.VideoPath.indexOf("fb.watch") === -1
        && topForm.value.VideoPath.indexOf("youtu.be") === -1){
      proxy.$modal.alertWarning("請填寫YouTube或Facebook網站影片連結")
      return false
    }else{
      return true
    }
  }
  if (topFormSelect.value === 2) {
    if (topForm.value.ImagePath === '' || topForm.value.ImagePath.trim() === '') {
      proxy.$modal.alertWarning("請上傳圖片")
      return false
    }else{
      return true
    }
  }
}
/** 提交按钮 */
function submitForm() {
  if(!handSubmitcheck()){
    return
  }
  if(title.value === "設置置頂"){
    checkCount({'HelpType':2}).then(resp => {
      if (resp === 1) {
        proxy.$modal.confirms(
            '當前已有問題置頂中，如繼續則覆蓋原問題<br><span style="color: red;">是否確認繼續？</span>',
            '',
            {
              dangerouslyUseHTMLString: true,
              type: 'warning',
              icon: 'Warning',
              confirmButtonText: '是,確認',
              cancelButtonText: '取消',
            }
        ).then(function() {
          proxy.$refs["postRef"].validate(valid => {
            editTop(topForm.value).then(response => {
              proxy.$modal.msgSuccess("操作成功")
              openTop.value = false
              getList()
            })
          })
        }).then(() => {
          getList()
        }).catch(() => {})
      }else{
        proxy.$refs["postRef"].validate(valid => {
          editTop(topForm.value).then(response => {
            proxy.$modal.msgSuccess("操作成功")
            openTop.value = false
            getList()
          })
        })
      }
    })
  }

}
/** 删除按钮操作 */
function handleDelete(row) {
  title.value = ''
  proxy.$modal.confirms(
      '確定後將刪除該問題記錄<br><span style="color: red;">是否確認刪除？</span>',
      '',
      {
        dangerouslyUseHTMLString: true,
        type: 'warning',
        icon: 'Warning',
        confirmButtonText: '是,確認',
        cancelButtonText: '取消',
      }
  ).then(function() {
    delHelp({'HelpcenterID':row.HelpcenterID}).then(response => {
      proxy.$modal.msgSuccess("操作成功")
      getList()
    })
  })
}
/** 置顶类型下拉*/
function onChange(val) {
  topForm.value.VideoPath= ''
  topForm.value.ImagePath= ''
}
/** 上传预处理 */
function beforeUpload(file) {
  if (file.type.indexOf("image/") === -1) {
    proxy.$modal.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。")
  }
}
//** 上传图片 */
function upload(param){
  let formData = new FormData()
  formData.append("file", param.file)
  uploadImage(formData).then(res => {
    topForm.value.ImagePath = res.url + '?x-oss-process=style/master'
    proxy.$modal.msgSuccess("上传成功")
  })
}
/** 表单重置 */
function reset() {
  topForm.value = {
    IsTop: 1,
    HelpType: 2,
    HelpcenterID: 0,
    VideoPath: '',
    ImagePath: ''
  }
  proxy.resetForm("postRef")
}
/** 取消指定按钮操作 */
function unTop(){
  proxy.$modal.confirm(
      '取消後幫助中心首頁將沒有置頂問題<br><span style="color: red;">是否確認繼續？</span>',
      '',
      {
        dangerouslyUseHTMLString: true,
        type: 'warning',
        icon: 'Warning',
        confirmButtonText: '是,確認',
        cancelButtonText: '取消',
      }
  ).then(function() {
    topForm.value.IsTop = 0
    topForm.value.VideoPath=''
    topForm.value.ImagePath=''
    proxy.$refs["postRef"].validate(valid => {
      editTop(topForm.value).then(response => {
        proxy.$modal.msgSuccess("操作成功")
        openTop.value = false
      })
    })
  }).then(() => {
    getList()
  }).catch(() => {})
}
/** 取消按钮 */
function cancel() {
  openTop.value = false
  reset()
}
getList()
initCategory()
</script>
