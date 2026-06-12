<template>
  <div class="home">
    <div class="header">
      <h1>期末复习资料分享</h1>
      <p>所有资料免费下载，祝你考试顺利！</p>
    </div>

    <div class="content" v-loading="loading">
      <div v-for="category in categories" :key="category" class="category-section">
        <div class="category-header">
          <el-tag :type="getCategoryType(category)" size="large">
            {{ category }}
          </el-tag>
        </div>

        <div class="type-cards">
          <!-- PDF模块 -->
          <el-card class="type-card" shadow="hover">
            <template #header>
              <div class="type-header" @click="toggleExpand(category, 'pdf')">
                <div class="type-info">
                  <el-icon class="type-icon pdf-icon"><Document /></el-icon>
                  <span class="type-title">PDF 文档</span>
                  <el-tag size="small" type="info">
                    {{ getCategoryTypeMaterials(category, 'pdf').length }} 个文件
                  </el-tag>
                </div>
                <el-icon class="expand-icon" :class="{ expanded: expandedState[`${category}-pdf`] }">
                  <ArrowDown />
                </el-icon>
              </div>
            </template>

            <div v-show="expandedState[`${category}-pdf`]" class="file-list">
              <el-empty
                v-if="getCategoryTypeMaterials(category, 'pdf').length === 0"
                description="暂无PDF文件"
                :image-size="40"
              />
              <div
                v-for="material in getCategoryTypeMaterials(category, 'pdf')"
                :key="material.id"
                class="file-item"
              >
                <div class="file-info">
                  <el-icon class="file-icon"><Document /></el-icon>
                  <span class="file-name">{{ material.title }}</span>
                  <span class="file-size">{{ formatFileSize(material.fileSize) }}</span>
                </div>
                <el-button
                  type="primary"
                  size="small"
                  :icon="Download"
                  @click.stop="handleDownload(material)"
                >
                  下载
                </el-button>
              </div>
            </div>
          </el-card>

          <!-- DOCX模块 -->
          <el-card class="type-card" shadow="hover">
            <template #header>
              <div class="type-header" @click="toggleExpand(category, 'docx')">
                <div class="type-info">
                  <el-icon class="type-icon docx-icon"><Notebook /></el-icon>
                  <span class="type-title">Word 文档</span>
                  <el-tag size="small" type="info">
                    {{ getCategoryTypeMaterials(category, 'docx').length }} 个文件
                  </el-tag>
                </div>
                <el-icon class="expand-icon" :class="{ expanded: expandedState[`${category}-docx`] }">
                  <ArrowDown />
                </el-icon>
              </div>
            </template>

            <div v-show="expandedState[`${category}-docx`]" class="file-list">
              <el-empty
                v-if="getCategoryTypeMaterials(category, 'docx').length === 0"
                description="暂无Word文件"
                :image-size="40"
              />
              <div
                v-for="material in getCategoryTypeMaterials(category, 'docx')"
                :key="material.id"
                class="file-item"
              >
                <div class="file-info">
                  <el-icon class="file-icon"><Notebook /></el-icon>
                  <span class="file-name">{{ material.title }}</span>
                  <span class="file-size">{{ formatFileSize(material.fileSize) }}</span>
                </div>
                <el-button
                  type="primary"
                  size="small"
                  :icon="Download"
                  @click.stop="handleDownload(material)"
                >
                  下载
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Document, Notebook, Download, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { config } from '../config'
import type { Material } from '../types'

const materials = ref<Material[]>([])
const loading = ref(true)
const expandedState = reactive<Record<string, boolean>>({})

const categories = config.categories

const loadMaterials = async () => {
  try {
    const response = await fetch('/materials.json')
    const data = await response.json()
    materials.value = data.materials || []
  } catch (error) {
    console.error('加载资料失败:', error)
  } finally {
    loading.value = false
  }
}

const getCategoryTypeMaterials = (category: string, type: string) => {
  return materials.value.filter(m => {
    if (m.category !== category) return false
    const ext = m.fileName.split('.').pop()?.toLowerCase()
    if (type === 'pdf') return ext === 'pdf'
    if (type === 'docx') return ext === 'docx' || ext === 'doc'
    return false
  })
}

const toggleExpand = (category: string, type: string) => {
  const key = `${category}-${type}`
  expandedState[key] = !expandedState[key]
}

const handleDownload = async (material: Material) => {
  try {
    // 使用jsDelivr CDN下载（公开仓库无需认证）
    const url = `https://cdn.jsdelivr.net/gh/${config.github.owner}/${config.github.repo}@${config.github.branch}/${material.filePath}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('获取文件失败')
    }

    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = material.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)

    ElMessage.success(`下载成功: ${material.fileName}`)
  } catch (error) {
    console.error('下载失败:', error)
    // 备用方案：直接打开链接
    const fallbackUrl = `https://raw.githubusercontent.com/${config.github.owner}/${config.github.repo}/${config.github.branch}/${material.filePath}`
    window.open(fallbackUrl, '_blank')
    ElMessage.info('正在打开文件...')
  }
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

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

onMounted(() => {
  loadMaterials()
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  color: #303133;
  margin-bottom: 10px;
}

.header p {
  font-size: 1.1rem;
  color: #606266;
}

.category-section {
  margin-bottom: 40px;
}

.category-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #ebeef5;
}

.type-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.type-card {
  transition: all 0.3s;
}

.type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.type-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-icon {
  font-size: 24px;
}

.pdf-icon {
  color: #e74c3c;
}

.docx-icon {
  color: #3498db;
}

.type-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #303133;
}

.expand-icon {
  transition: transform 0.3s;
  color: #909399;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.file-list {
  padding-top: 10px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #f5f7fa;
  border-radius: 8px;
  transition: background 0.2s;
}

.file-item:hover {
  background: #e6e8eb;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.file-icon {
  font-size: 18px;
  color: #606266;
}

.file-name {
  font-size: 0.95rem;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 0.8rem;
  color: #909399;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .type-cards {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 1.8rem;
  }
}
</style>