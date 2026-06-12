import axios from 'axios'
import { config } from '../config'
import type { GitHubFile, MaterialsIndex } from '../types'

const GITHUB_API = 'https://api.github.com'

class GitHubService {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  }

  // 获取文件内容
  async getFile(path: string): Promise<GitHubFile> {
    const response = await axios.get(
      `${GITHUB_API}/repos/${config.github.owner}/${config.github.repo}/contents/${path}`,
      { headers: this.getHeaders() }
    )
    return response.data
  }

  // 创建或更新文件
  async updateFile(path: string, content: string, message: string, sha?: string) {
    const body: any = {
      message,
      content: btoa(unescape(encodeURIComponent(content)))
    }

    if (sha) {
      body.sha = sha
    }

    const response = await axios.put(
      `${GITHUB_API}/repos/${config.github.owner}/${config.github.repo}/contents/${path}`,
      body,
      { headers: this.getHeaders() }
    )
    return response.data
  }

  // 上传文件
  async uploadFile(path: string, file: File, message: string) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async () => {
        const content = (reader.result as string).split(',')[1]
        try {
          const result = await this.updateFile(path, content, message)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // 删除文件
  async deleteFile(path: string, sha: string, message: string) {
    const response = await axios.delete(
      `${GITHUB_API}/repos/${config.github.owner}/${config.github.repo}/contents/${path}`,
      {
        headers: this.getHeaders(),
        data: { message, sha }
      }
    )
    return response.data
  }

  // 获取资料索引
  async getMaterialsIndex(): Promise<MaterialsIndex> {
    try {
      const data = await this.getFile('public/materials.json')
      const content = decodeURIComponent(escape(atob(data.content)))
      return JSON.parse(content)
    } catch (error) {
      return { materials: [], lastUpdated: new Date().toISOString() }
    }
  }

  // 更新资料索引
  async updateMaterialsIndex(materials: any[]) {
    const index: MaterialsIndex = {
      materials,
      lastUpdated: new Date().toISOString()
    }

    try {
      const data = await this.getFile('public/materials.json')
      return this.updateFile(
        'public/materials.json',
        JSON.stringify(index, null, 2),
        '更新资料索引',
        data.sha
      )
    } catch (error) {
      return this.updateFile(
        'public/materials.json',
        JSON.stringify(index, null, 2),
        '创建资料索引'
      )
    }
  }

  // 验证Token是否有效
  async verifyToken(): Promise<boolean> {
    try {
      await axios.get(`${GITHUB_API}/user`, {
        headers: this.getHeaders()
      })
      return true
    } catch (error) {
      return false
    }
  }
}

export default GitHubService