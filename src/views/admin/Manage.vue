<template>
  <div class="manage-container">
    <div class="header">
      <el-button @click="goBack" :icon="ArrowLeft">返回后台</el-button>
      <h1>管理资料</h1>
    </div>

    <div class="toolbar">
      <el-button
        type="danger"
        :disabled="selectedMaterials.length === 0"
        @click="handleBatchDelete"
      >
        批量删除 ({{ selectedMaterials.length }})
      </el-button>
      <el-button @click="loadMaterials" :icon="Refresh">刷新</el-button>
    </div>

    <div class="content" v-loading="loading">
      <el-empty v-if="materials.length === 0 && !loading" description="暂无资料" />

      <el-table
        v-else
        :data="materials"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="文件名" min-width="200" />
        <el-table-column prop="category" label="分类" width="180">
          <template #default="{ row }">
            <el-tag :type="getCategoryType(row.category)" size="small">
              {{ row.category }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getFileType(row.fileName)" size="small">
              {{ getFileExtension(row.fileName).toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="大小" width="100">
          <template #default="{ row }">
            {{ formatFileSize(row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column label="下载" width="80" align="center">
          <template #default="{ row }">
            {{ row.downloads }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
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
import { ArrowLeft, Delete, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MaterialService from '../../services/material'
import type { Material } from '../../types'

const router = useRouter()
const loading = ref(true)
const materials = ref<Material[]>([])
const selectedMaterials = ref<Material[]>([])

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

const handleSelectionChange = (selection: Material[]) => {
  selectedMaterials.value = selection
}

const handleDelete = async (material: Material) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 "${material.title}" 吗？`,
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

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedMaterials.value.length} 个文件吗？`,
      '批量删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const token = localStorage.getItem('github_token')
    if (!token) return

    const materialService = new MaterialService(token)
    let successCount = 0
    let failCount = 0

    for (const material of selectedMaterials.value) {
      try {
        await materialService.deleteMaterial(material.id)
        successCount++
      } catch (error) {
        console.error(`删除 ${material.title} 失败:`, error)
        failCount++
      }
    }

    if (successCount > 0) {
      ElMessage.success(`成功删除 ${successCount} 个文件${failCount > 0 ? `，${failCount} 个失败` : ''}`)
      loadMaterials()
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
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

const getFileExtension = (fileName: string) => {
  return fileName.split('.').pop() || ''
}

const getFileType = (fileName: string) => {
  const ext = getFileExtension(fileName).toLowerCase()
  if (ext === 'pdf') return 'danger'
  if (ext === 'doc' || ext === 'docx') return 'primary'
  return 'info'
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
.manage-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  color: #303133;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>