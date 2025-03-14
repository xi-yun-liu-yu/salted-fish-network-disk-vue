<script setup>
import {
  Document,
  UploadFilled,
  VideoPause,
  Promotion,
  CircleClose
} from '@element-plus/icons-vue'
import openFile from '@/utils/openFile.js'
</script>

<template>
  <div class="transfer-container">
    <el-tabs class="custom-tabs" v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane name="upload">
        <template #label>
          <span class="custom-tab-label">
            <el-icon><UploadFilled /></el-icon>
            上传列表
          </span>
        </template>
        <div class="transfer-section">
          <el-table :data="uploadList" style="width: 100%" height="70vh">
            <el-table-column prop="fileName" label="文件名" width="500" >
              <template #default="{ row }">
                <el-icon class="file-icon">
                  <Document />
                </el-icon>
                {{ row.fileName }}
              </template>
            </el-table-column>
            <el-table-column label="进度" width="300">
              <template #default="{ row }">
                <el-progress
                    :percentage="row.progress"
                    :color="customColors"
                    :stroke-width="16"
                    striped
                />
              </template>
            </el-table-column>
            <el-table-column prop="speed" label="速度" width="200" />
            <el-table-column label="状态" width="150" >
              <template #default="{ row }">
                <el-tag :type="statusType[row.status]">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" >
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
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane name="download">
        <template #label>
          <span class="custom-tab-label">
            <el-icon><Promotion/></el-icon>
            上传完成
          </span>
        </template>
        <div class="transfer-section">
          <el-table :data="finishList" style="width: 100%" height="70vh">
            <el-table-column prop="fileName" label="文件名" width="500" >
              <template #default="{ row }">
                <el-icon class="file-icon">
                  <Document />
                </el-icon>
                {{ row.fileName }}
              </template>
            </el-table-column>
            <el-table-column prop="finishData" label="下载日期" width="300"/>

            <el-table-column prop="fileSize" label="文件大小" width="200" />
            <el-table-column label="查看文件" width="150" >
              <template #default="{ row }">
                <el-button size="small" @click = openFile.handleOpenFolder(row.filePath)>
                  前往
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" >
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
                />
              </template>
            </el-table-column>
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
      activeTab: 'upload',
      customColors: [
        { color: '#409EFF', percentage: 100 },
      ],
      statusType: {
        '传输中': 'primary',
        '已完成': 'success',
        '已暂停': 'warning',
        '失败': 'danger'
      },
      uploadList: [
        {
          fileName: '项目文档.pdf',
          progress: 65,
          speed: '1.2MB/s',
          status: '传输中'
        },
        // 更多模拟数据...
      ],
      finishList: [
        {
          fileName: '设计素材.zip',
          finishData: '2025/3/8',
          fileSize: '100KB',
          filePath: 'S:\\'
        },
        // 更多模拟数据...
      ]
    }
  },
  methods: {
    handleTabClick(tab) {
      console.log('当前标签页:', tab.props.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer-container {
  padding: 20px;
  height: 100%;
  background: #f5f7fa;

  .custom-tabs {
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;

    :deep(.el-tabs__header) {
      margin: 0;
      background: linear-gradient(145deg, #f8f9fe, #eef1f8);

      .el-tabs__nav-wrap {
        padding: 0 20px;

        &::after {
          height: 0;
        }
      }

      .el-tabs__active-bar {
        height: 3px;
        background: #409EFF;
        border-radius: 2px;
      }

      .el-tabs__item {
        height: 60px;
        padding: 0 35px;
        font-size: 16px;
        color: #606266;
        transition: all 0.3s ease;

        &:hover {
          color: #409EFF;
          background: rgba(64, 158, 255, 0.05);
        }

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

    .transfer-section {
      padding: 20px;
      background: transparent;
      box-shadow: none;

      :deep(.el-table) {
        border-radius: 10px;
        overflow: hidden;

        th {
          font-weight: 600;
          background: #f8f9fc !important;
        }

        td {
          transition: background 0.2s;

          &:hover {
            background: #fafbff !important;
          }
        }
      }
    }
  }

  // 其他原有样式保持不变...
}
</style>