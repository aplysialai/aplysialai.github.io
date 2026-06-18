# 期末复习资料分享网站（Vue 3版）

一个简单的期末复习资料分享网站，使用Vue 3 + TypeScript开发，所有内容公开可下载。

## ✨ 功能特点

### 访客功能（无需登录）
- 📚 浏览资料列表
- 🔍 搜索和筛选资料
- ⬇️ 直接下载资料
- 📊 查看资料详情

### 资料管理
- 资料通过本地文件管理，修改 `public/materials.json` 并推送到仓库即可更新

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
│   │   └── MaterialDetail.vue # 详情页
│   ├── router/               # 路由
│   ├── types/                # 类型定义
│   ├── config/               # 配置文件
│   └── main.ts               # 入口文件
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 📝 资料管理

资料通过本地文件管理，步骤如下：

1. 将文件放入 `materials/<分类名>/pdf/` 或 `materials/<分类名>/docx/` 目录
2. 编辑 `public/materials.json`，添加对应的资料条目
3. 提交并推送到 GitHub：
   ```bash
   git add .
   git commit -m "添加资料: xxx"
   git push origin main
   ```
4. GitHub Pages 部署完成后即可在网站上看到更新

## 📊 功能说明

### 首页
- 显示所有资料列表
- 支持搜索和分类筛选
- 点击卡片查看详情

### 资料详情
- 显示资料详细信息
- 一键下载资料
- 显示下载次数

### 资料管理
- 本地管理文件和 `public/materials.json`，推送到仓库即可更新

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