# 🏓 Pong Game

一个使用 TypeScript 和 HTML5 Canvas 开发的经典 Pong 游戏。

![Pong Game Screenshot](screenshot.png)

## 🌐 GitHub Pages 部署

这个项目已经配置了 GitHub Actions 工作流，可以自动部署到 GitHub Pages。

### 更新部署

每次推送到 `main` 分支时，GitHub Actions 会自动重新构建并部署应用。

## 🚀 功能特点

- 玩家 vs 电脑 AI 对战
- 实时计分系统
- 响应式控制：支持键盘(W/S或方向键)和鼠标控制
- 游戏状态管理：开始菜单、游戏中、暂停、游戏结束
- 流畅的动画效果
- 简洁现代的用户界面

## 🛠️ 技术栈

- TypeScript
- HTML5 Canvas
- CSS3
- Vite (构建工具)

## 🚦 快速开始

### 前置条件

- Node.js (v14+)
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 🎮 游戏控制

- **W/↑**: 向上移动球拍
- **S/↓**: 向下移动球拍
- **鼠标移动**: 控制球拍上下移动
- **空格键**: 开始游戏/暂停游戏/重新开始

## 📁 项目结构

```
pong-game/
├── public/                # 静态资源
├── src/
│   ├── Ball.ts           # 球类实现
│   ├── Paddle.ts         # 球拍基类
│   ├── Player.ts         # 玩家类
│   ├── AI.ts             # 电脑AI类
│   ├── Score.ts          # 计分类
│   ├── PongGame.ts       # 游戏主逻辑
│   ├── main.ts           # 入口文件
│   ├── style.css         # 样式文件
│   └── types.d.ts        # TypeScript 类型定义
├── index.html            # 主页面
├── tsconfig.json         # TypeScript 配置
├── package.json          # 项目配置
└── README.md             # 项目说明
```

## 🧪 测试

```bash
npm test
# 或
yarn test
```

## 📝 许可证

MIT License - 请查看 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 感谢所有参与测试和提供反馈的朋友们！
- 灵感来源于经典的 Pong 游戏

## 🤝 贡献

欢迎提交 Issue 和 Pull Request。对于重大更改，请先提出问题讨论您想要更改的内容。

## 📬 联系

如有任何问题或建议，请随时联系项目维护者。
