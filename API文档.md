# API文档（Vue 3版）

## 📋 概述

本项目使用GitHub API实现文件管理功能，无需后端服务器。

**核心技术**：
- GitHub REST API
- GitHub Personal Access Token

---

## 🔐 GitHub API接口

### 1. 获取文件内容

```typescript
GET https://api.github.com/repos/{owner}/{repo}/contents/{path}
```

**请求头**：
```
Authorization: Bearer {token}
Accept: application/vnd.github.v3+json
```

**响应示例**：
```json
{
  "name": "materials.json",
  "path": "materials.json",
  "sha": "abc123",
  "content": "base64_encoded_content"
}
```

---

### 2. 创建或更新文件

```typescript
PUT https://api.github.com/repos/{owner}/{repo}/contents/{path}
```

**请求体**：
```json
{
  "message": "更新资料索引",
  "content": "base64_encoded_content",
  "sha": "existing_file_sha"
}
```

---

### 3. 上传文件

```typescript
PUT https://api.github.com/repos/{owner}/{repo}/contents/{path}
```

**请求体**：
```json
{
  "message": "上传资料: 文件名",
  "content": "base64_encoded_file_content"
}
```

---

### 4. 删除文件

```typescript
DELETE https://api.github.com/repos/{owner}/{repo}/contents/{path}
```

**请求体**：
```json
{
  "message": "删除资料: 文件名",
  "sha": "file_sha"
}
```

---

## 📊 数据结构

### Material（资料）

```typescript
interface Material {
  id: string           // 唯一标识
  title: string        // 资料标题
  description: string  // 资料描述
  category: string     // 分类
  fileName: string     // 文件名
  filePath: string     // 文件路径
  fileSize: number     // 文件大小（字节）
  downloads: number    // 下载次数
  createdAt: string    // 创建时间
}
```

### MaterialsIndex（资料索引）

```typescript
interface MaterialsIndex {
  materials: Material[]  // 资料列表
  lastUpdated: string    // 最后更新时间
}
```

---

## 🔧 服务封装

### GitHubService

```typescript
class GitHubService {
  constructor(token: string)
  
  getFile(path: string): Promise<GitHubFile>
  updateFile(path: string, content: string, message: string, sha?: string): Promise<any>
  uploadFile(path: string, file: File, message: string): Promise<any>
  deleteFile(path: string, sha: string, message: string): Promise<any>
  getMaterialsIndex(): Promise<MaterialsIndex>
  updateMaterialsIndex(materials: Material[]): Promise<any>
  verifyToken(): Promise<boolean>
}
```

### MaterialService

```typescript
class MaterialService {
  constructor(token: string)
  
  getMaterials(): Promise<Material[]>
  uploadMaterial(title: string, description: string, category: string, file: File): Promise<Material>
  deleteMaterial(id: string): Promise<{ id: string; title: string }>
  getStats(): Promise<Stats>
  getDownloadUrl(filePath: string): string
}
```

---

## 🔑 认证说明

### GitHub Personal Access Token

1. 访问 GitHub Settings → Developer settings → Personal access tokens
2. 创建新的 Fine-grained token
3. 设置权限：
   - Repository access: 选择FR-site仓库
   - Repository permissions:
     - Contents: Read and write
     - Metadata: Read-only

### Token存储

```typescript
// 登录时保存
localStorage.setItem('github_token', token)

// 使用时获取
const token = localStorage.getItem('github_token')
```

---

## 📝 使用示例

### 管理员登录

```typescript
import GitHubService from './services/github'

const verifyToken = async (token: string) => {
  const github = new GitHubService(token)
  return await github.verifyToken()
}
```

### 获取资料列表

```typescript
// 从public/materials.json获取
const getMaterials = async () => {
  const response = await fetch('/materials.json')
  const data = await response.json()
  return data.materials
}
```

### 上传资料

```typescript
import MaterialService from './services/material'

const uploadMaterial = async (token: string, formData: FormData) => {
  const materialService = new MaterialService(token)
  
  return await materialService.uploadMaterial(
    formData.get('title'),
    formData.get('description'),
    formData.get('category'),
    formData.get('file')
  )
}
```

### 删除资料

```typescript
import MaterialService from './services/material'

const deleteMaterial = async (token: string, id: string) => {
  const materialService = new MaterialService(token)
  return await materialService.deleteMaterial(id)
}
```

### 下载资料

```typescript
import { config } from './config'

const downloadMaterial = (filePath: string) => {
  const url = `https://raw.githubusercontent.com/${config.github.owner}/${config.github.repo}/${config.github.branch}/${filePath}`
  window.open(url, '_blank')
}
```

---

## ⚠️ 限制说明

### GitHub API限制
- 认证请求：5000次/小时
- 未认证请求：60次/小时
- 单个文件大小：100MB
- 仓库总大小：建议<1GB

### 建议
1. 压缩大文件后再上传
2. 定期清理不需要的文件
3. 使用CDN加速下载（可选）

---

## 📚 相关文档

- [GitHub REST API文档](https://docs.github.com/en/rest)
- [GitHub Pages文档](https://docs.github.com/en/pages)
- [Vite部署文档](https://vitejs.dev/guide/static-deploy.html)

---

**最后更新**: 2026年6月12日