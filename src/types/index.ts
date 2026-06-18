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
  hasAnswers?: boolean // true=有解析答案版, false/undefined=无解析答案版
}
