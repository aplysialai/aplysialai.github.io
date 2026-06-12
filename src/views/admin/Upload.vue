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
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="资料标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入资料标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="资料分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="资料描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入资料描述"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="上传文件" prop="file">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :before-upload="beforeUpload"
            drag
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 PDF、Word、PPT、图片格式，文件大小不超过 20MB
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
          >
            上传资料
          </el-button>
          <el-button @click="resetForm" size="large">重置</el-button>
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
  title: '',
  category: '',
  description: '',
  file: null as File | null
})

const rules = {
  title: [
    { required: true, message: '请输入资料标题', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择资料分类', trigger: 'change' }
  ],
  file: [
    { required: true, message: '请上传文件', trigger: 'change' }
  ]
}

const handleFileChange = (uploadFile: UploadFile) => {
  if (uploadFile.raw) {
    form.file = uploadFile.raw
  }
}

const handleFileRemove = () => {
  form.file = null
}

const beforeUpload = (file: File) => {
  const isValidType = config.allowedFileTypes.includes(file.type)
  const isValidSize = file.size <= config.maxFileSize

  if (!isValidType) {
    ElMessage.error('不支持的文件类型')
    return false
  }

  if (!isValidSize) {
    ElMessage.error('文件大小不能超过20MB')
    return false
  }

  return true
}

const handleUpload = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    if (!form.file) {
      ElMessage.error('请上传文件')
      return
    }

    uploading.value = true
    try {
      const token = localStorage.getItem('github_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const materialService = new MaterialService(token)
      await materialService.uploadMaterial(
        form.title,
        form.description,
        form.category,
        form.file
      )

      ElMessage.success('上传成功！')
      resetForm()
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
  form.file = null
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