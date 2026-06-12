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
          <span class="category-count">{{ getCategoryMaterials(category).length }} 个资料</span>
        </div>

        <el-empty
          v-if="getCategoryMaterials(category).length === 0 && !loading"
          description="暂无资料"
          :image-size="60"
        />

        <div class="materials-grid">
          <el-card
            v-for="material in getCategoryMaterials(category)"
            :key="material.id"
            class="material-card"
            shadow="hover"
            @click="goToDetail(material)"
          >
            <div class="card-content">
              <h3 class="title">{{ material.title }}</h3>
              <p class="description">{{ material.description }}</p>

              <div class="card-footer">
                <span class="file-info">
                  <el-icon><Document /></el-icon>
                  {{ material.fileName }}
                </span>
                <span class="file-size">
                  {{ formatFileSize(material.fileSize) }}
                </span>
                <span class="downloads">
                  <el-icon><Download /></el-icon>
                  {{ material.downloads }}
                </span>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Download } from '@element-plus/icons-vue'
import { config } from '../config'
import type { Material } from '../types'

const router = useRouter()
const materials = ref<Material[]>([])
const loading = ref(true)

const categories = config.categories

// 从public目录加载资料索引
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

// 获取某个分类的资料
const getCategoryMaterials = (category: string) => {
  return materials.value.filter(m => m.category === category)
}

const goToDetail = (material: Material) => {
  router.push(`/material/${material.id}`)
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
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #ebeef5;
}

.category-count {
  color: #909399;
  font-size: 0.9rem;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.material-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.material-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  font-size: 1.1rem;
  color: #303133;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description {
  color: #606266;
  font-size: 0.9rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #909399;
  font-size: 0.8rem;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size,
.downloads {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .materials-grid {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .card-footer {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>