<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>管理员登录</h2>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="GitHub Token" prop="token">
          <el-input
            v-model="form.token"
            type="password"
            placeholder="请输入GitHub Personal Access Token"
            show-password
            size="large"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            size="large"
            style="width: 100%"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="help-text">
        <h4>如何获取Token：</h4>
        <ol>
          <li>访问 <a href="https://github.com/settings/tokens?type=beta" target="_blank">GitHub Settings</a></li>
          <li>创建新的 Fine-grained token</li>
          <li>设置仓库权限：Contents: Read and write</li>
          <li>复制Token并粘贴到上方输入框</li>
        </ol>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import GitHubService from '../../services/github'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  token: ''
})

const rules = {
  token: [
    { required: true, message: '请输入GitHub Token', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const github = new GitHubService(form.token)
      const isValid = await github.verifyToken()

      if (isValid) {
        localStorage.setItem('github_token', form.token)
        ElMessage.success('登录成功！')
        router.push('/admin/dashboard')
      } else {
        ElMessage.error('Token无效，请检查后重试')
      }
    } catch (error) {
      ElMessage.error('验证失败，请检查Token是否正确')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.help-text {
  margin-top: 24px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #606266;
}

.help-text h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.help-text ol {
  margin: 0;
  padding-left: 20px;
}

.help-text li {
  margin-bottom: 8px;
}

.help-text a {
  color: #409eff;
  text-decoration: none;
}

.help-text a:hover {
  text-decoration: underline;
}
</style>