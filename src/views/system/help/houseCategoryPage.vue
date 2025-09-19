<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item prop="postCode">
        <el-input
            v-model="queryParams.categoryName"
            placeholder="請輸入分類名稱"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
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
        <el-button icon="Edit" @click="handleAdd">新增類型</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="helpList">
      <el-table-column label="問題一級分類" align="center" prop="CategoryName" />
      <el-table-column label="分類排序" align="center" prop="Sequence" />
      <el-table-column label="顯示狀態" align="center" prop="IsShow">
        <template #default="scope">
          {{scope.row.IsShow ? '是':'否'}}
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
          <el-button link type="primary" @click="toSub(scope.row)">二級分類管理</el-button>
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

    
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="postRef" :model="form" :rules="rules" label-width="85px">
        <el-form-item label="中文名稱:" prop="CategoryName">
          <el-input v-model="form.CategoryName"/>
        </el-form-item>
        <el-form-item label="英文名稱:" prop="postCode">
          <el-input v-model="form.CategoryNameEN"/>
        </el-form-item>
        <el-form-item label="分類權重:" prop="Sequence">
          <el-input-number v-model="form.Sequence" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Help">
import { listCategory,delHelpCategory,categoryAddToUpdate } from "@/api/system/help"
import { uploadImage } from "@/api/system/upload"
const router = useRouter()

const { proxy } = getCurrentInstance()
const helpList = ref([])
const open = ref(false)
const loading = ref(true)
const total = ref(0)
const title = ref("")
const createTime = ref([])
const updateTime = ref([])
const data = reactive({
  form: {
    CategoryName: '',
    CategoryNameEN: '',
    Sequence:'',
    HelpType: 1
  },
  queryParams: {
    helpType: 1,
    page: 1,
    limit: 10,
    Title: "",
    categoryName: "",
    createStartTime: '',
    createEndTime: '',
    updateStartTime: '',
    updateEndTime: ''
  },
  rules:{
    CategoryName: [{ required: true, message: "中文名稱不能为空", trigger: "blur" }],
    Sequence: [{ required: true, message: "分類權重不能为空", trigger: "blur" }]
  }
})

const { queryParams, form, rules } = toRefs(data)
watch(createTime,(newVal,oldVal)=>{
  if (newVal !== null) {
    queryParams.value.createStartTime = newVal[0]
    queryParams.value.createEndTime = newVal[1]
  } else {
    queryParams.value.createStartTime = null
    queryParams.value.createStartTime = null
  }
})
watch(updateTime,(newVal,oldVal)=>{
  if (newVal !== null) {
    queryParams.value.updateStartTime = newVal[0]
    queryParams.value.updateEndTime = newVal[1]
  } else {
    queryParams.value.updateStartTime = null
    queryParams.value.updateEndTime = null
  }
})
/** 查询岗位列表 */
function getList() {
  loading.value = true
  console.log(queryParams.value)
  listCategory(queryParams.value).then(response => {
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


/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
}
/** 二級分類管理按钮操作 */
function toSub(row){
  router.push({ path: '/help/houseSubCategoryPage',query: { hid: row.CategoryID,helpType: 1 } })
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  open.value = true
  form.value.CategoryName = row.CategoryName
  form.value.CategoryNameEN = row.CategoryNameEN
  form.value.Sequence = row.Sequence
  form.value.CategoryID = row.CategoryID
}
/** 提交按钮 */
function submitForm() {
  title.value = '新增（或編輯）一級分類'
  proxy.$refs["postRef"].validate(valid => {
    categoryAddToUpdate(form.value).then(response => {
      proxy.$modal.msgSuccess("操作成功")
      open.value = false
      getList()
    })
  })
}
/** 删除按钮操作 */
function handleDelete(row) {
  title.value = ''
  proxy.$modal.confirms(
      '刪除分類將隱藏所有該分類下的二級分類及問題<br><span style="color: red;">是否確認刪除？</span>',
      '',
      {
        dangerouslyUseHTMLString: true,
        type: 'warning',
        icon: 'Warning',
        confirmButtonText: '是,確認',
        cancelButtonText: '取消',
      }
  ).then(function() {
    delHelpCategory({'id':row.CategoryID}).then(response => {
      proxy.$modal.msgSuccess("操作成功")
      getList()
    })
  })
}
/** 表单重置 */
function reset() {
  form.value = {
    CategoryName: '',
    CategoryNameEN: '',
    Sequence:'',
    HelpType: 1
  }
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
    form.value.IsTop = 0
    form.value.VideoPath=''
    form.value.ImagePath=''
    proxy.$refs["postRef"].validate(valid => {
      editTop(form.value).then(response => {
        proxy.$modal.msgSuccess("操作成功")
        open.value = false
      })
    })
  }).then(() => {
    getList()
  }).catch(() => {})
}
/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}
getList()
</script>
