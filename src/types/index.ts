export interface Material {
  id: string
  title: string
  description: string
  category: string
  fileName: string
  filePath: string
  fileSize: number
  downloads: number
  createdAt: string
}

export interface MaterialsIndex {
  materials: Material[]
  lastUpdated: string
}

export interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  content: string
  encoding: string
  download_url: string
}

export interface UploadForm {
  title: string
  description: string
  category: string
  file: File | null
}

export interface Stats {
  totalMaterials: number
  totalDownloads: number
  categoryStats: { category: string; count: number }[]
}