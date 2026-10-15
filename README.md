# Shen Hu（胡深）的个人学术主页 · 极简版

原生 HTML、CSS 和 JavaScript 实现的两页学术主页：首页展示个人介绍、学术服务和联系方式，`/publications/` 按年份展示论文及 Paper/PDF 链接。论文静态列表随源码保存，禁用 JavaScript 时也可阅读。

本分支 `codex/minimal-backup` 保留极简版历史快照，供查阅和本地预览；日常维护不在此分支进行，也不将新版合入或覆盖它。正式站由 `main` 发布，[线上主页](https://shenhu365.github.io/)可能与本快照不同。推送本分支不会自动部署，不从备份分支手动运行发布工作流。

## 本地预览

需要 Node.js 20+，无需安装依赖或编译。在这个工作树的根目录运行：

```sh
npm run dev
```

打开[首页](http://127.0.0.1:4173/)或[论文页](http://127.0.0.1:4173/publications/)。修改页面后刷新，按 `Ctrl+C` 停止服务。若其他版本已占用端口，可使用 `npm run dev -- --port 4174`，打开对应的 4174 地址。

验证项目子目录路径时可运行：

```sh
npm run dev -- --base /scholarpage/ --port 4174
```

打开 <http://127.0.0.1:4174/scholarpage/>。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地预览 |
| `npm run sync` | 根据配置同步论文页的静态年份与论文列表 |
| `npm run check` | 只读离线检查配置、静态论文同步和本地引用 |
| `git diff --check` | 检查差异中的空白问题 |

个人资料与论文在 `data.js`，人物主页和别名在 `people.js`。如用户明确要求修改此快照，涉及论文、人物配置、站主姓名或共享论文渲染器时，先运行 `npm run sync`，再运行 `npm run check`；检查不会自动同步，也不验证外部链接或浏览器布局。仅修改文档时核对命令和路径即可。

## 文档

- [项目与智能体说明](AGENTS.md)：本历史版本的架构、配置、静态回退和维护约定；AI 接手前先读此文件及本 README。
- [资料来源](SOURCE_NOTES.md)：个人资料、论文和资源的来源记录。
- [字体说明](assets/fonts/README.md)：字体来源及许可证。
- [GitHub 仓库](https://github.com/shenhu365/shenhu365.github.io)：其他版本的现状与维护约定以各自分支的文档为准。
