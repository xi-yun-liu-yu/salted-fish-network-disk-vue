<script setup>

/* 文件下载管理组件 - 显示已完成的下载记录 */

import {Document, Download, VideoPause, CircleClose, Platform, CircleCheck} from '@element-plus/icons-vue'
import openFile from '@/utils/openFile.js'
import {useDownListStore} from "@/stores/downList.js";
const downListStore = useDownListStore();

/* 删除已完成下载记录 */
const deleteFinish = async (fileName) => {
  downListStore.removeDownList()
  downListStore.removeDownFinishList()
  downListStore.deleteDownFinishList(fileName)
  console.log(downListStore.downFinishList)
}

</script>

<template>
  <!-- 下载管理主容器 -->
  <div class="transfer-container">
    <!-- 标签页导航 -->
    <el-tabs class="custom-tabs" v-model="activeTab" @tab-click="handleTabClick">
<!--      <el-tab-pane name="upload">-->
<!--        <template #label>-->
<!--          <span class="custom-tab-label">-->
<!--            <el-icon><Download /></el-icon>-->
<!--            下载列表-->
<!--          </span>-->
<!--        </template>-->
<!--        <div class="transfer-section">-->
<!--          <el-table :data="downListStore.downList" style="width: 100%" height="70vh">-->
<!--            <el-table-column prop="fileName" label="文件名" width="500" >-->
<!--              <template #default="{ row }">-->
<!--                <el-icon class="file-icon">-->
<!--                  <Document />-->
<!--                </el-icon>-->
<!--                {{ row.fileName }}-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="进度" width="300">-->
<!--              <template #default="{ row }">-->
<!--                <el-progress-->
<!--                    :percentage="row.progress"-->
<!--                    :color="customColors"-->
<!--                    :stroke-width="16"-->
<!--                    striped-->
<!--                />-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="speed" label="速度" width="200" />-->
<!--            <el-table-column label="状态" width="150" >-->
<!--              <template #default="{ row }">-->
<!--                <el-tag :type="statusType[row.status]">-->
<!--                  {{ row.status }}-->
<!--                </el-tag>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="操作" width="150" >-->
<!--              <template #default="{ row }">-->
<!--                <el-button-->
<!--                    v-if="row.status === '传输中'"-->
<!--                    :icon="VideoPause"-->
<!--                    type="warning"-->
<!--                    circle-->
<!--                    size="small"-->
<!--                />-->
<!--                <el-button-->
<!--                    :icon="CircleClose"-->
<!--                    type="danger"-->
<!--                    circle-->
<!--                    size="small"-->
<!--                />-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </div>-->
<!--      </el-tab-pane>-->


      <!-- 已完成下载标签页 -->
      <el-tab-pane name="download">
        <template #label>
          <span class="custom-tab-label">
            <el-icon><platform /></el-icon>
            下载完成
          </span>
        </template>
        <!-- 下载完成列表 -->
        <div class="transfer-section">
          <el-table :data="downListStore.downFinishList" style="width: 100%" height="70vh">
            <!-- 文件名列 -->
            <el-table-column prop="fileName" label="文件名" width="500" >
              <template #default="{ row }">
                <el-icon class="file-icon">
                  <Document />
                </el-icon>
                {{ row.fileName }}
              </template>
            </el-table-column>
            <!-- 下载日期列 -->
            <el-table-column prop="finishData" label="下载日期" width="300"/>
            <!-- 文件大小列 -->
            <el-table-column prop="fileSize" label="文件大小" width="200" />

<!--            <el-table-column label="本地打开" width="150" >-->
<!--              <template #default="{ row }">-->
<!--                <el-button size="small" @click = openFile.handleOpenFolder(row.filePath)>-->
<!--                  复制地址-->
<!--                </el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->

            <!-- 操作列 -->
            <el-table-column label="删除记录" width="150" >
              <template #default="{ row }">
                <el-button
                    v-if="row.status === '传输中'"
                    :icon="VideoPause"
                    type="warning"
                    circle
                    size="small"
                />
                <el-button
                    :icon="CircleClose"
                    type="danger"
                    circle
                    size="small"
                    @click = deleteFinish(row.fileName)
                />
              </template>
            </el-table-column>
            <!-- 空状态提示 -->
            <template #empty>
              <el-empty
                  description="暂无已完成下载"
                  image-size="120"
                  class="custom-empty"
              >
                <template #image>
                  <el-icon :size="60" color="#67C23A"><CircleClose /></el-icon>
                </template>
              </el-empty>
            </template>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'download',// 默认激活下载完成标签
      customColors: [// 进度条颜色配置
        { color: '#409EFF', percentage: 100 },
      ],
      statusType: {// 状态标签类型映射
        '传输中': 'primary',
        '已完成': 'success',
        '已暂停': 'warning',
        '失败': 'danger'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 主容器样式 */
.transfer-container {
  padding: 20px;
  height: 100%;
  background: #f5f7fa;
  /* 自定义标签页样式 */
  .custom-tabs {
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;// 隐藏溢出内容
    /* 标签头样式 */
    :deep(.el-tabs__header) {
      margin: 0;
      background: linear-gradient(145deg, #f8f9fe, #eef1f8);

      .el-tabs__nav-wrap {
        padding: 0 20px;

        &::after {
          height: 0;
        }
      }
      /* 激活状态指示条 */
      .el-tabs__active-bar {
        height: 3px;
        background: #409EFF;
        border-radius: 2px;
      }
      /* 单个标签项样式 */
      .el-tabs__item {
        height: 60px;
        padding: 0 35px;
        font-size: 16px;
        color: #606266;
        transition: all 0.3s ease;
        /* 悬停效果 */
        &:hover {
          color: #409EFF;
          background: rgba(64, 158, 255, 0.05);
        }
        /* 激活状态样式 */
        &.is-active {
          color: #409EFF;
          font-weight: 500;
        }

        .custom-tab-label {
          display: flex;
          align-items: center;
          gap: 8px;

          .el-icon {
            font-size: 1.2em;
            margin-right: 6px;
          }
        }
      }
    }
    /* 内容区域样式 */
    .transfer-section {
      padding: 20px;
      background: transparent;
      box-shadow: none;
      /* 表格全局样式 */
      :deep(.el-table) {
        border-radius: 10px;
        overflow: hidden;
        /* 表头样式 */
        th {
          font-weight: 600;
          background: #f8f9fc !important;
        }
        /* 单元格悬停效果 */
        td {
          transition: background 0.2s;

          &:hover {
            background: #fafbff !important;
          }
        }
      }
    }
  }

}
</style>