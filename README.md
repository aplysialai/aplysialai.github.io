# 期末复习资料分享网站（Vue 3版）

一个简单的期末复习资料分享网站，使用Vue 3 + TypeScript开发，所有内容公开可下载。

## ✨ 功能特点

### 访客功能（无需登录）
- 📚 浏览资料列表
- 🔍 搜索和筛选资料
- ⬇️ 直接下载资料
- 📊 查看资料详情

### 管理员功能（GitHub Token登录）
- 🔐 管理员登录后台
- 📈 查看统计数据
- ⬆️ 上传新资料
- 🗑️ 删除已有资料

## 🚀 技术栈

- **前端**：Vue 3 + TypeScript
- **UI库**：Element Plus
- **构建工具**：Vite
- **存储**：GitHub仓库
- **部署**：GitHub Pages

## 📦 安装和运行

### 1. 克隆项目
```bash
git clone https://github.com/your-username/FR-site.git
cd FR-site
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置项目

在 `src/config/index.ts` 中配置：
```typescript
export const config = {
  github: {
    owner: 'your-username',  // 替换为你的GitHub用户名
    repo: 'FR-site',        // 替换为你的仓库名
    branch: 'main'
  }
}
```

### 4. 启动开发服务器
```bash
npm run dev
```

### 5. 构建和部署
```bash
npm run deploy
```

## 📁 项目结构

```
FR-site/
├── public/
│   ├── materials.json        # 资料索引
│   └── materials/            # 资料文件
├── src/
│   ├── components/           # 组件
│   ├── views/                # 页面
│   │   ├── Home.vue          # 首页
│   │   ├── MaterialDetail.vue # 详情页
│   │   └── admin/            # 管理员页面
│   ├── services/             # API服务
│   ├── router/               # 路由
│   ├── types/                # 类型定义
│   ├── config/               # 配置文件
│   └── main.ts               # 入口文件
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🔑 管理后台登录

### 1. 创建 GitHub Fine-grained Token

1. 登录 GitHub，访问 [Personal Access Tokens (Fine-grained)](https://github.com/settings/tokens?type=beta)
2. 点击 **Generate new token**
3. 填写 Token 名称（如 `FR-site-admin`），设置过期时间
4. 在 **Repository access** 中选择 **Only select repositories**，并选择本项目仓库
5. 在 **Permissions → Repository permissions** 中，将 **Contents** 设置为 **Read and write**
6. 点击 **Generate token**，**立即复制并保存** Token（页面刷新后无法再次查看）

### 2. 登录管理后台

1. 在浏览器中访问 `/admin/login`（本地开发为 `http://localhost:3005/admin/login`）
2. 在输入框中粘贴上一步创建的 GitHub Token
3. 点击 **登录** 按钮，系统会自动验证 Token 有效性
4. 验证通过后跳转至管理后台（`/admin/dashboard`），即可上传、删除和管理资料

> **注意**：Token 保存在浏览器 localStorage 中，清除浏览器数据后需要重新登录。

## 📊 功能说明

### 首页
- 显示所有资料列表
- 支持搜索和分类筛选
- 点击卡片查看详情

### 资料详情
- 显示资料详细信息
- 一键下载资料
- 显示下载次数

### 管理后台
- 统计面板：资料总数、下载次数、分类统计
- 上传资料：支持PDF、Word、PPT、图片
- 管理资料：查看和删除资料

## 🚀 部署

### GitHub Pages部署
```bash
# 构建并部署
npm run deploy
```

### 手动部署
```bash
# 构建项目
npm run build

# 推送到GitHub
git add .
git commit -m "Deploy"
git push origin main

# 在仓库设置中启用GitHub Pages
# Settings → Pages → Source: gh-pages branch
```

## 📝 开发文档

- [开发计划.md](开发计划.md) - 详细开发计划
- [API文档.md](API文档.md) - GitHub API文档
- [快速开始.md](快速开始.md) - 快速开始指南
- [部署指南.md](部署指南.md) - 部署指南

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

---

**最后更新**: 2026年6月13日