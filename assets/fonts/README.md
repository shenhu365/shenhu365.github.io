# 本地字体来源

这两款正体可变 WOFF2 字体直接取自 Adobe 官方仓库，文件内容未修改，仅重命名以便站点引用。本站自行托管字体，不请求外部字体服务。许可证原文分别保留在本目录；两者均采用 SIL Open Font License 1.1。

| 本地文件 | 字体版本 | 大小（bytes） | 支持轴 |
| --- | --- | ---: | --- |
| `source-serif-4-roman.woff2` | Source Serif 4 · 4.005 | 429100 | `wght` 200–900；`opsz` 8–60 |
| `source-sans-3-roman.woff2` | Source Sans 3 · 3.052 | 170188 | `wght` 200–900 |

版本与轴范围已从下载文件的 `name` / `fvar` 表核对。两款均为 `font-style: normal`；没有打包斜体。本站 `@font-face` 分别命名为 `Source Serif 4`、`Source Sans 3`，均声明 `font-weight: 200 900`；Source Serif 4 可使用 `font-optical-sizing: auto`。

## 固定来源

- **Source Serif 4**：[Adobe 官方仓库](https://github.com/adobe-fonts/source-serif)，固定提交 [`80d3f8894c09c937bebfa9011247d2e1c79fd6f4`](https://github.com/adobe-fonts/source-serif/tree/80d3f8894c09c937bebfa9011247d2e1c79fd6f4)。原路径为 `WOFF2/VAR/SourceSerif4Variable-Roman.ttf.woff2`。[字体原文件](https://raw.githubusercontent.com/adobe-fonts/source-serif/80d3f8894c09c937bebfa9011247d2e1c79fd6f4/WOFF2/VAR/SourceSerif4Variable-Roman.ttf.woff2)；[许可证原文件](https://raw.githubusercontent.com/adobe-fonts/source-serif/80d3f8894c09c937bebfa9011247d2e1c79fd6f4/LICENSE.md)，本地保存为 `LICENSE-source-serif.md`（4491 bytes）。
- **Source Sans 3**：[Adobe 官方仓库](https://github.com/adobe-fonts/source-sans)，固定提交 [`87b37a2daaed80fcb8e8ccb0085c4d72ddade12e`](https://github.com/adobe-fonts/source-sans/tree/87b37a2daaed80fcb8e8ccb0085c4d72ddade12e)。原路径为 `WOFF2/VF/SourceSans3VF-Upright.ttf.woff2`，与官方 `source-sans-3VF.css` 的正体路径一致。[字体原文件](https://raw.githubusercontent.com/adobe-fonts/source-sans/87b37a2daaed80fcb8e8ccb0085c4d72ddade12e/WOFF2/VF/SourceSans3VF-Upright.ttf.woff2)；[许可证原文件](https://raw.githubusercontent.com/adobe-fonts/source-sans/87b37a2daaed80fcb8e8ccb0085c4d72ddade12e/LICENSE.md)，本地保存为 `LICENSE-source-sans.md`（4486 bytes）。

## SHA-256

```text
940a76eda1388de39d38c8e7a79bf6ea058a387faee0a9f33c8d25c6ba05e1be  source-serif-4-roman.woff2
5f16566f7a40d39b339ad26be151fa5a1ab1f0c2574c7a2e619765584a1acbd8  source-sans-3-roman.woff2
c21d7293d87b6d7ab1d0229a2f55b77f33a7613a6a4e66f6693d68d7d8d09464  LICENSE-source-serif.md
56af9b9c6715597e458284a474dc118a50a4150e9d547c70f7b4a33c3e6a9328  LICENSE-source-sans.md
```

更新字体时使用官方固定提交，保留相应原始许可证，并同步本说明中的版本、来源、大小与校验值。
