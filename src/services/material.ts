import GitHubService from './github'
import type { Material, Stats } from '../types'
import { config } from '../config'

class MaterialService {
  private github: GitHubService

  constructor(token: string) {
    this.github = new GitHubService(token)
  }

  // 获取所有资料
  async getMaterials(): Promise<Material[]> {
    const index = await this.github.getMaterialsIndex()
    return index.materials || []
  }

  // 上传资料
  async uploadMaterial(
    title: string,
    description: string,
    category: string,
    file: File,
    subFolder: string = 'pdf'
  ): Promise<Material> {
    const id = Date.now().toString()
    const fileName = file.name
    const filePath = `materials/${category}/${subFolder}/${fileName}`

    // 上传文件
    await this.github.uploadFile(filePath, file, `上传资料: ${title}`)

    // 更新索引
    const materials = await this.getMaterials()
    const newMaterial: Material = {
      id,
      title,
      description,
      category,
      fileName,
      filePath,
      fileSize: file.size,
      downloads: 0,
      createdAt: new Date().toISOString()
    }

    materials.push(newMaterial)
    await this.github.updateMaterialsIndex(materials)

    return newMaterial
  }

  // 删除资料
  async deleteMaterial(id: string): Promise<{ id: string; title: string }> {
    const materials = await this.getMaterials()
    const material = materials.find(m => m.id === id)

    if (!material) {
      throw new Error('资料不存在')
    }

    // 获取文件sha
    const fileData = await this.github.getFile(material.filePath)

    // 删除文件
    await this.github.deleteFile(
      material.filePath,
      fileData.sha,
      `删除资料: ${material.title}`
    )

    // 更新索引
    const updatedMaterials = materials.filter(m => m.id !== id)
    await this.github.updateMaterialsIndex(updatedMaterials)

    return { id, title: material.title }
  }

  // 增加下载次数
  async incrementDownloads(id: string): Promise<void> {
    const materials = await this.getMaterials()
    const index = materials.findIndex(m => m.id === id)

    if (index !== -1) {
      materials[index].downloads += 1
      await this.github.updateMaterialsIndex(materials)
    }
  }

  // 获取统计数据
  async getStats(): Promise<Stats> {
    const materials = await this.getMaterials()

    const totalMaterials = materials.length
    const totalDownloads = materials.reduce((sum, m) => sum + m.downloads, 0)

    const categoryMap = new Map<string, number>()
    materials.forEach(m => {
      categoryMap.set(m.category, (categoryMap.get(m.category) || 0) + 1)
    })

    const categoryStats = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count
    }))

    return {
      totalMaterials,
      totalDownloads,
      categoryStats
    }
  }

  // 获取下载链接
  getDownloadUrl(filePath: string): string {
    return `https://raw.githubusercontent.com/${config.github.owner}/${config.github.repo}/${config.github.branch}/${filePath}`
  }
}

export default MaterialService