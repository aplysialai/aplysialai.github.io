// GitHub配置
export const config = {
  github: {
    owner: 'aplysialai',          // GitHub用户名
    repo: 'aplysialai.github.io', // 仓库名
    branch: 'main'
  },
  // 资料分类
  categories: [
    '计算机系统基础',
    '软件设计模式',
    '软件设计与体系结构',
    '软件质量保证与测试'
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