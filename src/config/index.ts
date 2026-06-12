// GitHub配置
export const config = {
  github: {
    owner: 'aplysialai',  // GitHub用户名
    repo: 'FR-site',      // 仓库名
    branch: 'main'
  },
  // 资料分类
  categories: [
    '数学',
    '英语',
    '物理',
    '化学',
    '计算机',
    '经济学',
    '管理学',
    '法学',
    '文学',
    '历史',
    '其他'
  ],
  // 支持的文件类型
  allowedFileTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png'
  ],
  // 最大文件大小 (20MB)
  maxFileSize: 20 * 1024 * 1024
}