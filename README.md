# ResearchBridge - 高校科研合作平台

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**ResearchBridge** 是一个专为高校环境设计的科研合作展示与匹配平台。旨在解决高校内“学生想做科研没门路、导师有课题招不到合适学生”的信息不对称问题，对接国创/省创、横向课题及实验室日常招募需求。

## 🌟 核心功能

- **🚀 课题搜索引擎**：支持按课题级别（如“国创”、“横向”）、所属院系及招募状态进行筛选。
- **👨‍🎓 优秀人才广场**：展示学生多维度的学术画像，包括年级、GPA、CET 成绩及核心技能。
- **⚙️ 统一资料中心**：支持教师与学生身份的一键切换，模块化管理科研背景与技能标签。
- **🧭 申请审核与通知**：学生提交申请，导师审批通过/拒绝，系统发送通知提醒。
- **📊 我的工作台**：学生查看申请进度，导师查看待审批列表。
- **💎 现代视觉体验**：采用磨砂玻璃（Glassmorphism）设计风格，提供极致的视觉享受与流畅的交互。

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Vanilla CSS (CSS 变量控制全局主题)
- **图标**: Lucide React

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd SCIII
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置 MySQL
创建数据库后执行初始化 SQL：

```bash
mysql -u <user> -p <database> < db/schema.sql
mysql -u <user> -p <database> < db/seed.sql
```

创建 `.env.local` 并配置：

```bash
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=researchbridge
MYSQL_CONNECTION_LIMIT=10
```

### 4. 启动开发服务器
```bash
npm run dev
```
访问 [http://localhost:3000](http://localhost:3000) 即可查看。

## 📖 设计原则

- **高校适配**：字段设计深度参考了保研推免和校内竞赛的实际评价指标。
- **隐私保护**：通过 Mailto 协议直接联系，不存储敏感即时聊天数据。
- **高性能**：零外部 UI 库，原生 CSS 极致优化。

## 📄 许可证

基于 MIT 许可证开源。
