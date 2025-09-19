<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
         <el-form-item label="" prop="mobile">
            <el-input
               v-model="queryParams.mobile"
               placeholder="請輸入需要查詢的電話號碼"
               clearable
               style="width: 200px"
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
         </el-form-item>
      </el-form>


      <el-table v-loading="loading" :data="userSmsLogList">
         <el-table-column label="產品類型" align="center" prop="sendtype" />
         <el-table-column label="用戶電話" align="center" prop="mobile" />
         <el-table-column label="驗證碼" align="center" prop="sendcontent" />
        <el-table-column label="發送狀態" align="center" prop="issuccess">
          <template #default="scope">
            <span>{{ scope.row.issuccess ? '成功' : '失敗' }}</span>
          </template>

        </el-table-column>
         <el-table-column label="發送时间" align="center" prop="sendtime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.sendtime) }}</span>
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

   </div>
</template>

<script setup name="userSmsLog">
import { listUserSmsLog } from "@/api/system/userSmsLog"

const userSmsLogList = ref([])
const loading = ref(true)
const total = ref(0)

const data = reactive({
  queryParams: {
    page: 1,
    limit: 10,
    mobile: ''
  }
})

const { queryParams } = toRefs(data)

/** 查询岗位列表 */
function getList() {
  loading.value = true
  listUserSmsLog(queryParams.value).then(response => {
    console.log(response)
    userSmsLogList.value = response.data
    total.value = response.count
    loading.value = false
  })
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page = 1
  getList()
}
getList()
</script>
