<template>
  <div class="dashboard">
    <div class="header">
      <h1>管理后台</h1>
      <div class="header-actions">
        <el-button @click="goToUpload" type="primary" :icon="Upload">
          上传资料
        </el-button>
        <el-button @click="goToManage" :icon="Setting">
          管理资料
        </el-button>
        <el-button @click="handleLogout" type="danger" :icon="SwitchButton">
          退出登录
        </el-button>
      </div>
    </div>

    <div class="stats-cards" v-loading="loading">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background: #409eff">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalMaterials }}</div>
            <div class="stat-label">资料总数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background: #67c23a">
            <el-icon><Download /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalDownloads }}</div>
            <div class="stat-label">总下载次数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background: #e6a23c">
            <el-icon><Folder /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.categoryStats.length }}</div>
            <div class="stat-label">资料分类</div>
          </div>
        </div>
      </el-card>
    </div>

    <el-card class="category-card">
      <template #header>
        <div class="card-header">
          <span>分类统计</span>
        </div>
      </template>

      <div class="category-list">
        <div
          v-for="item in stats.categoryStats"
          :key="item.category"
          class="category-item"
        >
          <div class="category-info">
            <el-tag :type="getCategoryType(item.category)">
              {{ item.category }}
            </el-tag>
            <span class="category-count">{{ item.count }} 个资料</span>
          </div>
          <el-progress
            :percentage="(item.count / stats.totalMaterials) * 100"
            :show-text="false"
            :stroke-width="10"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, Setting, SwitchButton, Document, Download, Folder } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MaterialService from '../../services/material'
import type { Stats } from '../../types'

const router = useRouter()
const loading = ref(true)
const stats = ref<Stats>({
  totalMaterials: 0,
  totalDownloads: 0,
  categoryStats: []
})

const loadStats = async () => {
  try {
    const token = localStorage.getItem('github_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    const materialService = new MaterialService(token)
    stats.value = await materialService.getStats()
  } catch (error) {
    console.error('加载统计数据失败:', error)
    ElMessage.error('加载统计数据失败')
  } finally {
    loading.value = false
  }
}

const goToUpload = () => {
  router.push('/admin/upload')
}

const goToManage = () => {
  router.push('/admin/manage')
}

const handleLogout = () => {
  localStorage.removeItem('github_token')
  ElMessage.success('已退出登录')
  router.push('/admin/login')
}

const getCategoryType = (category: string) => {
  const types: Record<string, string> = {
    '计算机系统基础': 'primary',
    '软件设计模式': 'success',
    '软件设计与体系结构': 'warning',
    '软件质量保证与测试': 'danger'
  }
  return types[category] || 'info'
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  border-radius: 12px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #909399;
  margin-top: 4px;
}

.category-card {
  border-radius: 12px;
}

.card-header {
  font-weight: bold;
  font-size: 1.1rem;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-count {
  color: #606266;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>