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
            <el-select v-model="queryParams.CategoryID" placeholder="請選擇問題一級分類" clearable style="width: 200px">
               <el-option
                  v-for="dict in []"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               />
            </el-select>
         </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams.SubCategoryID" placeholder="請選擇問題二級分類" clearable style="width: 200px">
            <el-option
                v-for="dict in []"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
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
              v-model="createTime"
              type="daterange"
              range-separator="To"
              start-placeholder="创建-开始时间"
              end-placeholder="创建-结束时间"
          />
        </el-form-item>
        {{createTime[0]}}}
        {{queryParams.createstartTime}}}
        <el-form-item prop="status">
          <el-date-picker
              v-model="updateTime"
              type="daterange"
              range-separator="To"
              start-placeholder="修改-开始时间"
              end-placeholder="修改-结束时间"
          />
        </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
         <el-table-column label="問題ID" align="center" prop="HelpcenterID" />
         <el-table-column label="問題標題" align="center" prop="Title" />
         <el-table-column label="問題一級分類" align="center" width="150" prop="CategoryDesc" />
         <el-table-column label="問題二級分類" align="center" width="150" prop="SubCategoryDesc" />
         <el-table-column label="常見問題" align="center" prop="IsCommon">
            <template #default="scope">
               <dict-tag :options="sys_normal_disable" :value="scope.row.IsCommon" />
            </template>
         </el-table-column>
        <el-table-column label="熱門問題" align="center" prop="IsHot">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.IsHot" />
          </template>
        </el-table-column>
        <el-table-column label="顯示狀態" align="center" prop="IsShow">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.IsShow" />
          </template>
        </el-table-column>
        <el-table-column label="是否置頂" align="center" prop="IsTop">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.IsTop" />
          </template>
        </el-table-column>
         <el-table-column label="创建时间" align="center" prop="CreateTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.CreateTime) }}</span>
            </template>
         </el-table-column>
        <el-table-column label="创建时间" align="center" prop="UpdateTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.UpdateTime) }}</span>
          </template>
        </el-table-column>
         <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:post:edit']">修改</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:post:remove']">删除</el-button>
            </template>
         </el-table-column>
      </el-table>

      <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.pageNum"
         v-model:limit="queryParams.pageSize"
         @pagination="getList"
      />
   </div>
</template>

<script setup name="Help">
import { listHelp } from "@/api/system/help"

const { proxy } = getCurrentInstance()
const sys_normal_disable = [{'value':1,label:'是'},{'value':0,label:'否'}]

const postList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")
const createTime = ref([])
const updateTime = ref([])
const data = reactive({
  form: {},
  queryParams: {
    helpType: 1,
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
watch(createTime,(newVal,oldVal)=>{
  if (newVal !== null) {
    this.queryParams.value.createstartTime = newVal[0]
    this.queryParams.value.createendTime = newVal[1]
  } else {
    this.queryParams.value.createstartTime = null
    this.queryParams.value.createstartTime = null
  }
})
watch(updateTime,(newVal,oldVal)=>{
  if (newVal !== null) {
    this.queryParams.value.updatestartTime = newVal[0]
    this.queryParams.value.updateendTime = newVal[1]
  } else {
    this.queryParams.value.updatestartTime = null
    this.queryParams.value.updateendTime = null
  }
})
const { queryParams, form, rules } = toRefs(data)

/** 查询岗位列表 */
function getList() {
  loading.value = true
  listHelp(queryParams.value).then(response => {
    postList.value = response.data.list
    total.value = response.data.total
    loading.value = false
  })
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    postId: undefined,
    postCode: undefined,
    postName: undefined,
    postSort: 0,
    status: "0",
    remark: undefined
  }
  proxy.resetForm("postRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.postId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加岗位"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const postId = row.postId || ids.value
  getPost(postId).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改岗位"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["postRef"].validate(valid => {
    if (valid) {
      if (form.value.postId != undefined) {
        updatePost(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addPost(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const postIds = row.postId || ids.value
  proxy.$modal.confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？').then(function() {
    return delPost(postIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/post/export", {
    ...queryParams.value
  }, `post_${new Date().getTime()}.xlsx`)
}

getList()
</script>
