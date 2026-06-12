<template>
  <div class="home">
    <div class="header">
      <h1>期末复习资料分享</h1>
      <p>所有资料免费下载，祝你考试顺利！</p>
    </div>

    <div class="search-bar">
      <el-input
        v-model="searchText"
        placeholder="搜索资料..."
        clearable
        size="large"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select
        v-model="selectedCategory"
        placeholder="选择分类"
        clearable
        size="large"
        @change="handleSearch"
      >
        <el-option
          v-for="cat in categories"
          :key="cat"
          :label="cat"
          :value="cat"
        />
      </el-select>
    </div>

    <div class="content" v-loading="loading">
      <el-empty v-if="filteredMaterials.length === 0 && !loading" description="暂无资料" />

      <div class="materials-grid">
        <el-card
          v-for="material in filteredMaterials"
          :key="material.id"
          class="material-card"
          shadow="hover"
          @click="goToDetail(material)"
        >
          <div class="card-content">
            <div class="card-header">
              <el-tag :type="getCategoryType(material.category)" size="small">
                {{ material.category }}
              </el-tag>
              <span class="downloads">
                <el-icon><Download /></el-icon>
                {{ material.downloads }}
              </span>
            </div>

            <h3 class="title">{{ material.title }}</h3>
            <p class="description">{{ material.description }}</p>

            <div class="card-footer">
              <span class="file-info">
                {{ formatFileSize(material.fileSize) }}
              </span>
              <span class="date">
                {{ formatDate(material.createdAt) }}
              </span>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MaterialService from '../services/material'
import { config } from '../config'
import type { Material } from '../types'

const router = useRouter()
const materials = ref<Material[]>([])
const searchText = ref('')
const selectedCategory = ref('')
const loading = ref(true)

const categories = config.categories

// 创建一个不需要token的MaterialService实例（只用于读取）
const materialService = new MaterialService('')

// 从public目录加载资料索引
const loadMaterials = async () => {
  try {
    const response = await fetch('/materials.json')
    const data = await response.json()
    materials.value = data.materials || []
  } catch (error) {
    console.error('加载资料失败:', error)
    ElMessage.error('加载资料失败')
  } finally {
    loading.value = false
  }
}

// 过滤资料
const filteredMaterials = computed(() => {
  let result = materials.value

  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    result = result.filter(
      m =>
        m.title.toLowerCase().includes(search) ||
        m.description.toLowerCase().includes(search)
    )
  }

  if (selectedCategory.value) {
    result = result.filter(m => m.category === selectedCategory.value)
  }

  return result
})

const handleSearch = () => {
  // 搜索逻辑已在computed中处理
}

const goToDetail = (material: Material) => {
  router.push(`/material/${material.id}`)
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
  margin-bottom: 30px;
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

.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
}

.search-bar .el-input {
  flex: 1;
}

.search-bar .el-select {
  width: 200px;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.material-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.material-card:hover {
  transform: translateY(-4px);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.downloads {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 0.9rem;
}

.title {
  font-size: 1.2rem;
  color: #303133;
  margin: 0;
  line-height: 1.4;
}

.description {
  color: #606266;
  font-size: 0.9rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #909399;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  .search-bar .el-select {
    width: 100%;
  }

  .materials-grid {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 1.8rem;
  }
}
</style>