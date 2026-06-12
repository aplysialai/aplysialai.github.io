<template>
  <div class="manage-container">
    <div class="header">
      <el-button @click="goBack" :icon="ArrowLeft">返回后台</el-button>
      <h1>管理资料</h1>
    </div>

    <div class="content" v-loading="loading">
      <el-empty v-if="materials.length === 0 && !loading" description="暂无资料" />

      <el-table v-else :data="materials" style="width: 100%" border>
        <el-table-column prop="title" label="资料标题" min-width="200" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)" size="small">
              {{ row.category }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名" width="200" />
        <el-table-column label="文件大小" width="120">
          <template #default="{ row }">
            {{ formatFileSize(row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column label="下载次数" width="100" align="center">
          <template #default="{ row }">
            {{ row.downloads }}
          </template>
        </el-table-column>
        <el-table-column label="上传时间" width="150">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MaterialService from '../../services/material'
import type { Material } from '../../types'

const router = useRouter()
const loading = ref(true)
const materials = ref<Material[]>([])

const loadMaterials = async () => {
  try {
    const token = localStorage.getItem('github_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    const materialService = new MaterialService(token)
    materials.value = await materialService.getMaterials()
  } catch (error) {
    console.error('加载资料失败:', error)
    ElMessage.error('加载资料失败')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (material: Material) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除资料 "${material.title}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const token = localStorage.getItem('github_token')
    if (!token) return

    const materialService = new MaterialService(token)
    await materialService.deleteMaterial(material.id)

    ElMessage.success('删除成功')
    loadMaterials()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const goBack = () => {
  router.push('/admin/dashboard')
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadMaterials()
})
</script>

<style scoped>
.manage-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  color: #303133;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>