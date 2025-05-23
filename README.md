# AI 音乐生成器

一个基于 Stability AI 的 AI 音乐生成应用，可以根据用户输入的歌词生成独特的音乐。

## 功能特点

- 根据歌词生成音乐
- 支持多种音乐风格（流行、摇滚、爵士等）
- 可调节音乐节奏和情绪
- 实时音频预览
- 响应式设计

## 技术栈

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Stability AI API

## 本地开发

1. 克隆仓库：
```bash
git clone [your-repository-url]
cd ai-music-generator
```

2. 安装依赖：
```bash
npm install
```

3. 创建环境变量文件：
创建 `.env.local` 文件并添加以下内容：
```
STABILITY_API_KEY=your_stability_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. 启动开发服务器：
```bash
npm run dev
```

5. 在浏览器中访问 `http://localhost:3000`

## 部署

本项目可以轻松部署到 Vercel：

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

## 环境变量

- `STABILITY_API_KEY`: Stability AI API 密钥
- `NEXT_PUBLIC_APP_URL`: 应用 URL
- `NEXT_PUBLIC_API_URL`: API URL

## 许可证

MIT
