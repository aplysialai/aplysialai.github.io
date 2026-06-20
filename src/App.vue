<template>
  <el-config-provider :locale="zhCn">
    <div class="app">
      <!-- 赞赏按钮 -->
      <div class="donate-btn" @click="showDonate = true" title="赞赏作者">
        <el-icon><Present /></el-icon>
        <span>赞赏</span>
      </div>

      <!-- 赞赏弹窗 -->
      <el-dialog
        v-model="showDonate"
        title="赞赏作者"
        width="320px"
        :align-center="true"
        :close-on-click-modal="true"
      >
        <div class="donate-content">
          <div v-if="qrError" class="donate-placeholder">
            <p>📷</p>
            <p>请将赞赏二维码保存为</p>
            <code>public/images/wx二维码.png</code>
          </div>
          <img v-else :src="donateQrSrc" alt="赞赏二维码" class="donate-qrcode"
            @error="onQrError" />
          <p class="donate-text">扫描二维码赞赏作者</p>
          <p class="donate-thanks">感谢你的支持 ❤️</p>
        </div>
      </el-dialog>

      <router-view />
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Present } from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const showDonate = ref(false)
const donateQrSrc = '/images/wx二维码.png'
const qrError = ref(false)

const onQrError = () => {
  qrError.value = true
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
}

.app {
  min-height: 100vh;
}

/* 赞赏浮动按钮 */
.donate-btn {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid #e4e7ed;
  border-radius: 20px;
  font-size: 14px;
  color: #e6a23c;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.donate-btn:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

/* 赞赏弹窗内容 */
.donate-content {
  text-align: center;
  padding: 10px 0;
}

.donate-qrcode {
  width: 220px;
  height: 220px;
  object-fit: contain;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.donate-text {
  margin-top: 12px;
  font-size: 14px;
  color: #606266;
}

.donate-thanks {
  margin-top: 4px;
  font-size: 13px;
  color: #909399;
}

.donate-placeholder {
  width: 220px;
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  color: #909399;
  font-size: 13px;
  line-height: 1.8;
}

.donate-placeholder p:first-child {
  font-size: 40px;
}

.donate-placeholder code {
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
}
</style>
