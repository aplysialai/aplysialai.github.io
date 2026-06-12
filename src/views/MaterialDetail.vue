<template>
  <div class="detail-container" v-loading="loading">
    <el-card v-if="material" class="detail-card">
      <div class="back-button">
        <el-button @click="goBack" :icon="ArrowLeft">返回列表</el-button>
      </div>

      <div class="material-info">
        <div class="header">
          <el-tag :type="getCategoryType(material.category)" size="large">
            {{ material.category }}
          </el-tag>
          <h1>{{ material.title }}</h1>
        </div>

        <div class="meta">
          <span class="meta-item">
            <el-icon><Document /></el-icon>
            {{ material.fileName }}
          </span>
          <span class="meta-item">
            <el-icon><Files /></el-icon>
            {{ formatFileSize(material.fileSize) }}
          </span>
          <span class="meta-item">
            <el-icon><Download /></el-icon>
            {{ material.downloads }} 次下载
          </span>
          <span class="meta-item">
            <el-icon><Calendar /></el-icon>
            {{ formatDate(material.createdAt) }}
          </span>
        </div>

        <div class="description">
          <h3>资料描述</h3>
          <p>{{ material.description || '暂无描述' }}</p>
        </div>

        <div class="actions">
          <el-button
            type="primary"
            size="large"
            :icon="Download"
            @click="handleDownload"
          >
            立即下载
          </el-button>
        </div>
      </div>
    </el-card>

    <el-empty v-else-if="!loading" description="资料不存在">
      <el-button @click="goBack">返回列表</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Document, Files, Download, Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { config } from '../config'
import type { Material } from '../types'

const router = useRouter()
const route = useRoute()
const material = ref<Material | null>(null)
const loading = ref(true)

// 加载资料数据
const loadMaterial = async () => {
  try {
    const id = route.params.id as string
    const response = await fetch('/materials.json')
    const data = await response.json()
    material.value = data.materials.find((m: Material) => m.id === id) || null
  } catch (error) {
    console.error('加载资料失败:', error)
    ElMessage.error('加载资料失败')
  } finally {
    loading.value = false
  }
}

const handleDownload = () => {
  if (!material.value) return

  const url = `https://raw.githubusercontent.com/${config.github.owner}/${config.github.repo}/${config.github.branch}/${material.value.filePath}`
  window.open(url, '_blank')
  ElMessage.success('开始下载...')
}

const goBack = () => {
  router.push('/')
}

const getCategoryType = (category: string) => {
  const types: Record<string, string> = {
    '数学': 'primary',
    '英语': 'success',
    '物理': 'warning',
    '化学': 'danger',
    '计算机': 'info'
  }
  return types[category] || ''
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadMaterial()
})
</script>

<style scoped>
.detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.detail-card {
  border-radius: 12px;
}

.back-button {
  margin-bottom: 20px;
}

.material-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header h1 {
  font-size: 2rem;
  color: #303133;
  margin: 0;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  color: #606266;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.description {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.description h3 {
  margin: 0 0 12px 0;
  color: #303133;
}

.description p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.5rem;
  }

  .meta {
    flex-direction: column;
    gap: 12px;
  }
}
</style>