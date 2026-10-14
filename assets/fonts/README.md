# 本地字体来源

本站自行托管字体，不请求外部字体服务。当前界面使用用户提供的设计源码包中的 Manrope 与 Noto Sans SC 子集；原有 Source Serif 4 / Source Sans 3 文件及许可证继续保留。四款字体对应的许可证原文均保存在本目录，采用 SIL Open Font License 1.1。

## 当前界面字体

直接来源为用户提供的 `shen-homepage-source.zip`。以下文件从压缩包中原样复制，未重新生成、压缩或裁剪字体；许可证仅调整本地文件名。

| 本地文件 | 压缩包内来源路径 | 大小（bytes） |
| --- | --- | ---: |
| `manrope.woff2` | `shen-homepage/source/assets/fonts/manrope.woff2` | 24836 |
| `noto-sans-sc-subset.woff2` | `shen-homepage/source/assets/fonts/noto-sans-sc-subset.woff2` | 20332 |
| `LICENSE-manrope.txt` | `shen-homepage/source/licenses/Manrope-OFL.txt` | 4387 |
| `LICENSE-noto-sans-sc.txt` | `shen-homepage/source/licenses/Noto-Sans-SC-OFL.txt` | 4388 |

源码包的 CSS 将 Manrope 声明为正体、字重 400–700，将 Noto Sans SC 子集声明为正体、字重 400–600；本站沿用这些声明并设置 `font-display: swap`。这些范围是来源 CSS 的声明，不是本次从字体二进制核验出的轴范围。当前检查环境没有可用的 fontTools，未核实这两份文件的精确版本、可变轴或完整字符覆盖；不据文件名推定版本或上游固定提交。

`noto-sans-sc-subset.woff2` 是子集文件，不应视为完整中文字库。保留苹方、微软雅黑等系统回退字体；新增中文姓名、单位或正文后，应检查缺字、字体混排与换行，不保证新文字全部由该子集覆盖。若更换完整字体或重新制作子集，需补充可追溯的官方来源、实际版本、字符覆盖、大小与校验值，并保留许可证。

Manrope 的随包许可证注明 The Manrope Project Authors；Noto Sans SC 的随包许可证注明 Adobe 与保留名称 Source。两份许可证均按原文完整保留，未改写版权声明。本次确认的来源为用户源码包，不将其记作重新从官方仓库下载的文件。

```text
a30ddcd349703aff7464c34bef3fffdff405ee50c113440d7c8693c02d210972  manrope.woff2
b0f8442c6140f691a925493870e0cfb3af24210166c5c3e59d9b93c1fb9005b2  noto-sans-sc-subset.woff2
58172e0c0fac2cda8a37b348164bb55e44b0e69051e557e92b1d3f6910141f7b  LICENSE-manrope.txt
1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9  LICENSE-noto-sans-sc.txt
```

## 保留的 Source 字体

以下两款正体可变 WOFF2 字体直接取自 Adobe 官方仓库，文件内容未修改，仅重命名以便站点引用。原有文件及来源记录继续保留，不作为当前界面的默认字体。

| 本地文件 | 字体版本 | 大小（bytes） | 支持轴 |
| --- | --- | ---: | --- |
| `source-serif-4-roman.woff2` | Source Serif 4 · 4.005 | 429100 | `wght` 200–900；`opsz` 8–60 |
| `source-sans-3-roman.woff2` | Source Sans 3 · 3.052 | 170188 | `wght` 200–900 |

版本与轴范围此前已从下载文件的 `name` / `fvar` 表核对。两款均为正体，没有打包斜体；若恢复使用，`@font-face` 可分别命名为 `Source Serif 4`、`Source Sans 3`，并声明 `font-style: normal` 与 `font-weight: 200 900`；Source Serif 4 可使用 `font-optical-sizing: auto`。

### 固定来源

- **Source Serif 4**：[Adobe 官方仓库](https://github.com/adobe-fonts/source-serif)，固定提交 [`80d3f8894c09c937bebfa9011247d2e1c79fd6f4`](https://github.com/adobe-fonts/source-serif/tree/80d3f8894c09c937bebfa9011247d2e1c79fd6f4)。原路径为 `WOFF2/VAR/SourceSerif4Variable-Roman.ttf.woff2`。[字体原文件](https://raw.githubusercontent.com/adobe-fonts/source-serif/80d3f8894c09c937bebfa9011247d2e1c79fd6f4/WOFF2/VAR/SourceSerif4Variable-Roman.ttf.woff2)；[许可证原文件](https://raw.githubusercontent.com/adobe-fonts/source-serif/80d3f8894c09c937bebfa9011247d2e1c79fd6f4/LICENSE.md)，本地保存为 `LICENSE-source-serif.md`（4491 bytes）。
- **Source Sans 3**：[Adobe 官方仓库](https://github.com/adobe-fonts/source-sans)，固定提交 [`87b37a2daaed80fcb8e8ccb0085c4d72ddade12e`](https://github.com/adobe-fonts/source-sans/tree/87b37a2daaed80fcb8e8ccb0085c4d72ddade12e)。原路径为 `WOFF2/VF/SourceSans3VF-Upright.ttf.woff2`，与官方 `source-sans-3VF.css` 的正体路径一致。[字体原文件](https://raw.githubusercontent.com/adobe-fonts/source-sans/87b37a2daaed80fcb8e8ccb0085c4d72ddade12e/WOFF2/VF/SourceSans3VF-Upright.ttf.woff2)；[许可证原文件](https://raw.githubusercontent.com/adobe-fonts/source-sans/87b37a2daaed80fcb8e8ccb0085c4d72ddade12e/LICENSE.md)，本地保存为 `LICENSE-source-sans.md`（4486 bytes）。

### SHA-256

```text
940a76eda1388de39d38c8e7a79bf6ea058a387faee0a9f33c8d25c6ba05e1be  source-serif-4-roman.woff2
5f16566f7a40d39b339ad26be151fa5a1ab1f0c2574c7a2e619765584a1acbd8  source-sans-3-roman.woff2
c21d7293d87b6d7ab1d0229a2f55b77f33a7613a6a4e66f6693d68d7d8d09464  LICENSE-source-serif.md
56af9b9c6715597e458284a474dc118a50a4150e9d547c70f7b4a33c3e6a9328  LICENSE-source-sans.md
```

更新字体时使用官方固定提交，保留相应原始许可证，并同步本说明中的版本、来源、大小与校验值。
