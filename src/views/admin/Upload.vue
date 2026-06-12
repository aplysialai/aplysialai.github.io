<template>
  <div class="upload-container">
    <div class="header">
      <el-button @click="goBack" :icon="ArrowLeft">返回后台</el-button>
      <h1>上传资料</h1>
    </div>

    <el-card class="upload-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="选择分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择学科分类" size="large" style="width: 100%">
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="选择文件" prop="files">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :before-upload="beforeUpload"
            multiple
            drag
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 PDF、DOC、DOCX 格式，文件大小不超过 20MB，可批量上传
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="uploading"
            @click="handleUpload"
            size="large"
            :disabled="form.files.length === 0"
          >
            上传 ({{ form.files.length }} 个文件)
          </el-button>
          <el-button @click="resetForm" size="large">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, UploadFile } from 'element-plus'
import MaterialService from '../../services/material'
import { config } from '../../config'

const router = useRouter()
const formRef = ref<FormInstance>()
const uploadRef = ref()
const uploading = ref(false)

const categories = config.categories

const form = reactive({
  category: '',
  files: [] as File[]
})

const rules = {
  category: [
    { required: true, message: '请选择学科分类', trigger: 'change' }
  ]
}

const allowedTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

const handleFileChange = (uploadFile: UploadFile) => {
  if (uploadFile.raw) {
    form.files.push(uploadFile.raw)
  }
}

const handleFileRemove = (uploadFile: UploadFile) => {
  const index = form.files.findIndex(f => f.name === uploadFile.name)
  if (index !== -1) {
    form.files.splice(index, 1)
  }
}

const beforeUpload = (file: File) => {
  const isValidType = allowedTypes.includes(file.type) ||
    file.name.endsWith('.pdf') ||
    file.name.endsWith('.doc') ||
    file.name.endsWith('.docx')
  const isValidSize = file.size <= config.maxFileSize

  if (!isValidType) {
    ElMessage.error(`${file.name} 不是支持的文件类型`)
    return false
  }

  if (!isValidSize) {
    ElMessage.error(`${file.name} 超过20MB限制`)
    return false
  }

  return true
}

const handleUpload = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    if (form.files.length === 0) {
      ElMessage.error('请选择文件')
      return
    }

    uploading.value = true
    let successCount = 0
    let failCount = 0

    try {
      const token = localStorage.getItem('github_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const materialService = new MaterialService(token)

      for (const file of form.files) {
        try {
          // 从文件名中提取标题（去掉扩展名）
          const title = file.name.replace(/\.(pdf|doc|docx)$/i, '')

          // 根据文件类型决定子文件夹
          let subFolder = 'pdf'
          if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
            subFolder = 'docx'
          }

          await materialService.uploadMaterial(
            title,
            `${form.category} - ${title}`,
            form.category,
            file,
            subFolder
          )
          successCount++
        } catch (error) {
          console.error(`上传 ${file.name} 失败:`, error)
          failCount++
        }
      }

      if (successCount > 0) {
        ElMessage.success(`成功上传 ${successCount} 个文件${failCount > 0 ? `，${failCount} 个失败` : ''}`)
        resetForm()
      } else {
        ElMessage.error('上传失败')
      }
    } catch (error) {
      console.error('上传失败:', error)
      ElMessage.error('上传失败，请重试')
    } finally {
      uploading.value = false
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  uploadRef.value?.clearFiles()
  form.files = []
}

const goBack = () => {
  router.push('/admin/dashboard')
}
</script>

<style scoped>
.upload-container {
  max-width: 800px;
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

.upload-card {
  border-radius: 12px;
}

.el-upload__tip {
  color: #909399;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>