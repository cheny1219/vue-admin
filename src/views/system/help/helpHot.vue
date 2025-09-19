<template>
  <div class="app-container">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="常見問題" name="common">
        <el-form :model="queryParams" ref="queryRef" :inline="true" >
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
            <el-select v-model="queryParams.IsCommonShow" placeholder="請選擇顯示狀態" clearable style="width: 200px">
              <el-option
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">查詢</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            <el-button icon="Edit" @click="handleAdd">添加常見問題</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="helpList">
          <el-table-column label="權重排序" align="center" prop="CommonSequence" />
          <el-table-column label="問題ID" align="center" prop="HelpcenterID" />
          <el-table-column label="問題標題" align="center" prop="Title" />
          <el-table-column label="顯示狀態" align="center" prop="IsShow">
            <template #default="scope">
              {{scope.row.IsCommonShow ? '是':'否'}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="220" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <div style="display: inline-block;margin-right: 12px;" v-show="scope.row.IsCommonShow">
                <el-button link type="primary" @click="handleDown(scope.row)" >下架</el-button>
              </div>
              <div style="display: inline-block;margin-right: 12px;" v-show="!scope.row.IsCommonShow">
                <el-button link type="primary" @click="handleDown(scope.row)">上架</el-button>
              </div>
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
      </el-tab-pane>
      <el-tab-pane label="熱門問題" name="hot">
        <el-form :model="queryParams" ref="queryRef" :inline="true" >
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
            <el-select v-model="queryParams.IsHotShow" placeholder="請選擇顯示狀態" clearable style="width: 200px">
              <el-option
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">查詢</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            <el-button icon="Edit" @click="handleAdd">添加熱門問題</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="helpHotList">
          <el-table-column label="權重排序" align="center" prop="HotSequence" />
          <el-table-column label="問題ID" align="center" prop="HelpcenterID" />
          <el-table-column label="問題標題" align="center" prop="Title" />
          <el-table-column label="顯示狀態" align="center" prop="IsShow">
            <template #default="scope">
              {{scope.row.IsHotShow ? '是':'否'}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="220" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <div style="display: inline-block;margin-right: 12px;" v-show="scope.row.IsHotShow">
                <el-button link type="primary" @click="handleDown(scope.row)">下架</el-button>
              </div>
              <div style="display: inline-block;margin-right: 12px;" v-show="!scope.row.IsHotShow">
                <el-button link type="primary" @click="handleDown(scope.row)">上架</el-button>
              </div>
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
      </el-tab-pane>
    </el-tabs>


    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="postRef" :model="form" :rules="rules" label-width="85px">
        <el-form-item label="問題ID:" prop="HelpcenterID">
          <el-input v-model="form.HelpcenterID"/>
        </el-form-item>
        <el-form-item label="問題標題:" prop="postCode">
          <el-input v-model="form.Title" disabled/>
        </el-form-item>
        <el-form-item label="顯示排序:" prop="Sequence">
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
import { listHelp,downHelp,delHelp, addType, editType } from "@/api/system/help"
const route = useRoute();
const helpType = route.query.helpType;
const { proxy } = getCurrentInstance()
const sys_normal_disable = [{'value':1,label:'是'},{'value':0,label:'否'}]
const open = ref(false)
const helpList = ref([])
const helpHotList = ref([])
const activeName = ref('common')
const loading = ref(true)
const total = ref(0)
const title = ref("")
const data = reactive({
  form: {},
  queryParams: {
    helpType: helpType,
    page: 1,
    limit: 10,
    Title: "",
    HelpcenterID: null,
    IsCommon: null,
    IsHot: null,
    IsCommonShow: null,
    IsHotShow: null
  },
  rules:{
    HelpcenterID: [{ required: true, message: "問題ID", trigger: "blur" }],
    Sequence: [{ required: true, message: "問題排序不能为空", trigger: "blur" }]
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询常見列表 */
function getList() {
  loading.value = true
  queryParams.value.IsHot = null
  queryParams.value.IsHotShow = null
  queryParams.value.IsCommon = true
  console.log(queryParams.value)
  listHelp(queryParams.value).then(response => {
    helpList.value = response.data.list
    total.value = response.data.total
    loading.value = false
  })
}
/** 查询熱門列表 */
function getHotList() {
  loading.value = true
  queryParams.value.IsHot = true
  queryParams.value.IsHotShow = null
  queryParams.value.IsCommon = null
  queryParams.value.IsCommonShow = null
  console.log(queryParams.value)
  listHelp(queryParams.value).then(response => {
    helpHotList.value = response.data.list
    total.value = response.data.total
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page = 1
  if (activeName.value === 'common'){
    getList()
  }else{
    getHotList()
  }

}

/** 重置按钮操作 */
function resetQuery() {
  location.reload();
}




/** 新增按钮操作 */
function handleAdd() {
  title.value = activeName.value === 'common' ? '編輯常見問題' : '編輯熱門問題'
  reset()
  if (activeName.value === 'hot') {
    form.value.HotSequence = form.value.Sequence
    form.value.IsHot = true
  }
  if (activeName.value === 'common') {
    form.value.CommonSequence = form.value.Sequence
    form.value.IsCommon = true
  }
  open.value = true
}

/** 修改按钮操作 */
function handleUpdate(row) {
  title.value = activeName.value === 'common' ? '編輯常見問題' : '編輯熱門問題'
  reset()
  form.value.oldID = row.HelpcenterID
  form.value.HelpcenterID = row.HelpcenterID
  form.value.Title = row.Title
  if (activeName.value === 'hot') {
    form.value.Sequence = row.HotSequence
    form.value.IsHot = true
  }
  if (activeName.value === 'common') {
    form.value.Sequence = row.CommonSequence
    form.value.IsCommon = true
  }
  open.value = true
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["postRef"].validate(valid => {
    if (valid) {
      if (activeName.value === 'hot') {
        form.value.HotSequence = form.value.Sequence
      }
      if (activeName.value === 'common') {
        form.value.CommonSequence = form.value.Sequence
      }
      if (form.value.oldID == null) {
        addType(form.value).then(response => {
          if (response.msg === 'success') {
            proxy.$modal.msgSuccess("新增成功")
            open.value = false
            if (activeName.value === 'common') {
              getList()
            }else{
              getHotList()
            }

          }else{
            proxy.$modal.msgError(response.content)
          }
        })
      } else {
        editType(form.value).then(response => {
          if (response.msg === 'success') {
            proxy.$modal.msgSuccess("修改成功")
            open.value = false
            if (activeName.value === 'common') {
              getList()
            }else{
              getHotList()
            }
          }else{
            proxy.$modal.msgError(response.content)
          }
        })
      }
    }
  })
}


/** 下架按钮操作 */
function handleDown(row) {
  title.value = ''
  const isShow = activeName.value === 'hot' ? row.IsHotShow : row.IsCommonShow
  const params = {
    'HelpcenterID':row.HelpcenterID,
  }
  if(activeName.value === 'hot'){
    params.IsHotShow = !row.IsHotShow
  }else{
    params.IsCommonShow = !row.IsCommonShow
  }
  const content = !isShow ? '上架後幫助中心將顯示出該問題<br><span style="color: red;">是否確認上架？</span>' : '下架後幫助中心將不再顯示該問題<br><span style="color: red;">是否確認下架？</span>'
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
    downHelp(params).then(response => {
      proxy.$modal.msgSuccess("操作成功")
      getList()
    })
  })
  console.log(row)
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
/** 重置表單 */

/** 表单重置 */
function reset() {
  form.value = {
    HelpcenterID: null,
    Title: null,
    HelpType: helpType,
    Sequence: null
  }
}

/** 弹框表单取消按钮事件 */
function cancel() {
  open.value = false
  reset()
}
getList()
getHotList()
</script>
