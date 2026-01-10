# 小红书动态分类展示网站

这是一个基于 React + TypeScript + Vite 构建的静态网站，用于分类展示从小红书爬取的动态内容。

## 功能特性

- 📱 **分类展示**: 根据标签（hashtag）自动分类展示动态
- 🎨 **美观界面**: 现代化的卡片式设计，响应式布局
- 📊 **详细信息**: 显示封面图、标题、作者、描述、标签、互动数据等
- 🔗 **原动态链接**: 点击可跳转到小红书原动态
- 🎬 **视频标识**: 自动识别并标记视频动态

## 项目结构

```
website/
├── src/
│   ├── components/          # React 组件
│   │   ├── NoteCard.tsx    # 动态卡片组件
│   │   ├── NoteCard.css
│   │   ├── CategoryNav.tsx # 分类导航组件
│   │   └── CategoryNav.css
│   ├── services/            # 数据服务
│   │   └── dataService.ts  # 数据加载和分类逻辑
│   ├── types.ts            # TypeScript 类型定义
│   ├── App.tsx             # 主应用组件
│   ├── App.css
│   └── main.tsx            # 应用入口
├── public/
│   └── notes.json          # 笔记数据文件（需要生成）
├── export_data.py          # 数据导出脚本
└── package.json
```

## 使用步骤

### 1. 安装依赖

```bash
cd marksort/website
npm install
```

### 2. 导出数据

首先需要将爬取的小红书动态数据导出为 JSON 格式：

```bash
# 编辑 export_data.py，设置你的 cookies 和 user_id
python export_data.py
```

这个脚本会：
- 从 RedNote API 获取所有收藏的动态
- 获取每条动态的详细信息
- 将数据保存到 `public/notes.json`

或者，你也可以手动创建 `public/notes.json` 文件，格式如下：

```json
[
  {
    "display_title": "动态标题",
    "type": "video",
    "note_id": "xxx",
    "xsec_token": "xxx",
    "cover": {
      "url_default": "封面图URL",
      "url_pre": "封面图预览URL",
      ...
    },
    "user": {
      "nickname": "作者名",
      "avatar": "头像URL",
      ...
    },
    "interact_info": {
      "liked_count": "点赞数",
      ...
    },
    "detail": {
      "note_card": {
        "title": "标题",
        "desc": "描述",
        "tag_list": [
          {
            "id": "标签ID",
            "name": "标签名",
            "type": "topic"
          }
        ],
        ...
      }
    }
  }
]
```

### 3. 启动开发服务器

```bash
npm run dev
```

然后在浏览器中打开显示的地址（通常是 `http://localhost:5173`）

### 4. 构建生产版本

```bash
npm run build
```

构建后的文件会在 `dist/` 目录中，可以部署到任何静态网站托管服务。

## 数据结构说明

### Note（基础笔记信息）

- `display_title`: 显示标题
- `note_id`: 笔记ID
- `xsec_token`: 安全令牌
- `cover`: 封面图信息
- `user`: 作者信息
- `interact_info`: 互动信息（点赞数等）

### NoteDetail（详细笔记信息）

- `note_card.title`: 标题
- `note_card.desc`: 描述
- `note_card.tag_list`: 标签列表（用于分类）
- `note_card.user`: 作者详细信息
- `note_card.interact_info`: 详细互动信息（点赞、收藏、评论数）
- `note_card.video`: 视频信息（如果存在）

## 分类逻辑

- 系统会根据每条动态的 `tag_list`（标签列表）自动生成分类
- 每个标签会成为一个分类
- "全部" 分类显示所有动态
- 点击分类按钮可以筛选显示该分类下的动态

## 样式定制

主要样式文件：
- `src/App.css`: 主应用样式
- `src/components/NoteCard.css`: 动态卡片样式
- `src/components/CategoryNav.css`: 分类导航样式

可以通过修改这些 CSS 文件来自定义网站外观。

## 技术栈

- **React 19**: UI 框架
- **TypeScript**: 类型安全
- **Vite**: 构建工具
- **CSS3**: 样式设计

## 注意事项

1. 确保 `public/notes.json` 文件存在且格式正确
2. 图片可能需要处理跨域问题（如果图片域名有 CORS 限制）
3. 如果数据量很大，可以考虑添加分页或虚拟滚动
4. 视频下载功能需要在后端实现，本网站只负责展示

## 开发建议

- 可以在 `dataService.ts` 中添加更多的数据处理逻辑
- 可以扩展分类功能，支持自定义分类或多种分类方式
- 可以添加搜索、排序等功能
- 可以添加动态详情页面
