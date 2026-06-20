<template>
  <el-config-provider :locale="zhCn">
    <div class="app">
      <!-- 支持按钮 -->
      <div class="donate-btn" @click="showDonate = true" title="支持作者">
        <span class="coin-icon">🪙</span>
        <span>支持</span>
      </div>

      <!-- 支持弹窗 -->
      <el-dialog
        v-model="showDonate"
        title="支持作者"
        width="420px"
        :align-center="true"
        :close-on-click-modal="true"
        @open="onDialogOpen"
      >
        <div class="donate-content">
          <div class="donate-images">
            <div class="donate-qr-wrap">
              <div v-if="qrError" class="donate-placeholder">
                <p>📷</p>
                <p>请将赞赏二维码保存为</p>
                <code>public/images/wx二维码.png</code>
              </div>
              <img v-else :src="donateQrSrc" alt="赞赏二维码" class="donate-qrcode"
                @error="onQrError" />
            </div>
            <div class="donate-bulusi-wrap">
              <div class="bulusi-row">
                <img :src="bulusiSrc" alt="布鲁斯" class="donate-bulusi" />
                <div class="bulusi-btns">
                  <el-button size="small" type="danger" plain @click="bulusiSrc = '/images/no.jpg'">不行</el-button>
                  <el-button size="small" type="success" plain @click="bulusiSrc = '/images/good.jpg'">好</el-button>
                </div>
              </div>
              <p class="donate-bulusi-text">布鲁斯让你靠近点扫</p>
            </div>
          </div>
        </div>
      </el-dialog>

      <router-view />
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const showDonate = ref(false)
const donateQrSrc = '/images/wx二维码.png'
const bulusiSrc = ref('/images/bulusi.jpg')
const qrError = ref(false)

const onDialogOpen = () => {
  // 每次打开弹窗重置图片
  bulusiSrc.value = '/images/bulusi.jpg'
  qrError.value = false
}

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

/* 支持浮动按钮 */
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

.coin-icon {
  font-size: 16px;
  line-height: 1;
}

/* 支持弹窗内容 */
.donate-content {
  padding: 10px 0;
}

.donate-images {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
}

.donate-qr-wrap {
  flex-shrink: 0;
}

.donate-qrcode {
  width: 180px;
  height: 180px;
  object-fit: contain;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.donate-placeholder {
  width: 180px;
  height: 180px;
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
  font-size: 36px;
}

.donate-placeholder code {
  background: #f5f7fa;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: #606266;
}

.donate-bulusi-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.bulusi-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.donate-bulusi {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.bulusi-btns {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

.bulusi-btns .el-button {
  width: 64px;
  justify-content: center;
}

.donate-bulusi-text {
  margin-top: 6px;
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}
</style>
