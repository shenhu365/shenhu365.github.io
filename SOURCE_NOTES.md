# Content sources and editorial decisions

Initial sources verified on 12 October 2026; later confirmations are noted below. This file records the provenance of homepage content; it is not a complete publication list.

本文件仅供维护时查阅，记录信息来源与取舍，不参与页面渲染。个人资料与论文展示以 `data.js` 为准，人物主页与姓名别名以 `people.js` 为准；修改本文件不会改变网页，各文件不会自动同步。日常操作见 [MAINTENANCE.md](MAINTENANCE.md)，智能体接手与文档同步约定见 [AGENTS.md](AGENTS.md)。

## Profile: user-provided details take priority

The user explicitly confirmed the following for this website:

- **Name:** Shen Hu (胡深)
- **Affiliation:** 山西大学大数据科学与产业研究院 / Institute of Big Data Science and Industry, Shanxi University
- **Current research:** 大模型驱动的演化数据智能（AI科学家智能体系统） / LLM-driven evolutionary data intelligence, with a focus on AI scientist agent systems
- **Email:** hushen@alu.sxu.edu.cn
- **GitHub:** <https://github.com/shenhu365>
- **Portrait:** <https://dig.sxu.edu.cn/images/2023-08/0f846d13de7c4148857a793bc316bd05.png>
- **Google Scholar:** <https://scholar.google.com/citations?user=Q31HAAcAAAAJ>

The user's current research description overrides older public descriptions. Google Scholar lists AI agents, LLMs, Multi-view Learning, and Signal processing. The university profile lists self-supervised learning and biomedical large models. Neither older description should replace the user's stated current focus; biomedical research is not promoted as the present main direction.

The [university profile](https://dig.sxu.edu.cn/xwz/td/bss/2023j/b91acaa0e0754523bf255812c80f2d0d.htm) independently confirms the Chinese name, public email, doctoral-student status, advisor 钱宇华 / Yuhua Qian, and education in Computer Science and Technology at Shanxi University:

- Ph.D.: September 2023–present.
- Master's: September 2020–June 2023.
- Bachelor's: September 2016–June 2020.

No ORCID, citation metrics, or CV link have been inferred. Awards and recognition follow the confirmations below.

## Awards and recognition

On 14 October 2026, the user confirmed two mathematical modeling awards and CCF recognition, and explicitly requested that the Awards page omit years. The page follows the configuration order, without inferring editions or a chronology.

- **全国大学生数学建模竞赛 — 全国二等奖.** The Chinese name follows the [official contest website](https://www.mcm.edu.cn/). Its [official English introduction](https://en.mcm.edu.cn/html_en/section/b77a1402496e05863c96de6120931806.html) uses CUMCM and explains that the initial C means China for participants from mainland China and Macau; the page therefore uses **China Undergraduate Mathematical Contest in Modeling (CUMCM)**. The prize is user-confirmed; the official name verification does not independently verify the user's competition result. Do not infer a title sponsor or edition without a year.
- **“华为杯”中国研究生数学建模竞赛 — 全国二等奖，华为专项 B 题排名前 4%.** The Chinese name follows the [official contest platform](https://cpipc.acge.org.cn/cw/hp/4); **China Post-Graduate Mathematical Contest in Modeling (CPMCM)** follows its [official English invitation](https://cpipc.acge.org.cn/cw/contestNews/detail/4/2c9080189914a5c4019940d4f22060bc?page=3). The prize and ranking are user-confirmed. “Top 4% in Huawei Special Problem B” describes that specific problem's ranking, not the overall contest ranking or a separate prize category.
- **中国计算机学会（CCF）高校宣传员表彰.** The user supplied the report title; the [CCF official report “CCF表彰108名高校宣传员”](https://www.ccf.org.cn/c/2018-09-29/653020.shtml) lists **胡深 — 山西大学** at entry 66. It recognizes CCF campus outreach representatives without naming an “优秀” or “Outstanding” award. The website uses **Recognition for Campus Outreach** as a descriptive English translation, not an official award title. The report's publication date is retained in the source URL but is not displayed as an award year.

Runtime content is maintained in `data.js` under `awards`; `awards/index.html` retains a manually synchronized static fallback. Competition and organization titles link to the official sources above. The Awards page adds no inferred grades, dates, counts, or award titles.

## Publication metadata

### AMR-LLM

**AMR-LLM: Knowledge-Enhanced Multi-Modal Automatic Modulation Recognition via Large Language Models**

Authors: Shen Hu, Yuhua Qian, Xinyan Liang, Zikun Jin, Jiaqian Zhang, Jiangfeng Zhang.

- Venue: Proceedings of the Thirty-Fifth International Joint Conference on Artificial Intelligence, **IJCAI 2026**, main track, pp. 4367–4375.
- DOI: `10.24963/ijcai.2026/486`
- [Official publication page](https://www.ijcai.org/proceedings/2026/486)
- [Official PDF](https://www.ijcai.org/proceedings/2026/0486.pdf)

Use the official proceedings metadata to correct the incomplete Google Scholar entry, including its missing venue/year and erroneous trailing author fragment. The official PDF contains no identifiable source-code link; searches for `github` and `code` returned no matches. Leave the code field empty until a verified release is supplied.

### Focus Depth Anything

**Focus Depth Anything: Towards Robust Depth from Focus in the Wild**

Authors: Jiangfeng Zhang, Yuhua Qian, Tao Yan, Shen Hu, Yayu Zhang, Jinwen Liu.

- Venue: **International Journal of Computer Vision**, volume 134, article 439 (2026).
- Publication date: 18 September 2026.
- DOI: `10.1007/s11263-026-03006-8`
- [Official publication page](https://link.springer.com/article/10.1007/s11263-026-03006-8)
- [Publisher PDF](https://link.springer.com/content/pdf/10.1007/s11263-026-03006-8.pdf) — exact URL supplied by the user on 13 October 2026.
- [Code and dataset repository linked by the publisher](https://github.com/jiangfeng-Z/Focus-Depth-Anything)

439 is an article number, not a page range. The website keeps the publisher page as the Paper link and uses the user-supplied PDF URL for the PDF link.

### Signal Enhancement / FracFusion

**Signal Enhancement via Multi-view Dynamic Representation and Alignment-aware Fusion**

Authors: Zikun Jin, Yuhua Qian, Xinyan Liang, Jiaqian Zhang, Jinpeng Yuan, Shen Hu, Haijun Geng, Honghong Cheng.

- Venue: **Proceedings of the AAAI Conference on Artificial Intelligence**, 40(27), 22454–22462 (2026).
- Publication date: 14 March 2026.
- DOI: `10.1609/aaai.v40i27.39404`
- [Official publication page](https://ojs.aaai.org/index.php/AAAI/article/view/39404)
- [Official PDF](https://ojs.aaai.org/index.php/AAAI/article/download/39404/43365)

The official AAAI page supplies the full eight-author list. No verified code link was found.

### Balanced Multimodal Learning / UDI

**Balanced Multimodal Learning: An Unidirectional Dynamic Interaction Perspective**

Authors: Shijie Wang, Li Zhang, Xinyan Liang, Yuhua Qian, Shen Hu.

- Status: **arXiv preprint**, 2025.
- arXiv identifier: `2509.02281`; first submitted 2 September 2025; version 3 dated 5 September 2025.
- DOI: `10.48550/arXiv.2509.02281`
- [arXiv abstract and metadata](https://arxiv.org/abs/2509.02281)
- [arXiv PDF](https://arxiv.org/pdf/2509.02281)
- [Coauthor's publication list](https://xinyanliang.github.io/publications/) also places this work under preprints.

Some third-party aggregators label this work ICLR 2026. That label was not verified from an official acceptance/proceedings source, so the homepage retains **arXiv 2025**. No verified code link was found.

## Presentation

The UI on main retains the light blue-gray background, white panels and font assets from the user-provided `shen-homepage-source.zip` supplied on 14 October 2026, with plain text navigation and an unframed SH mark. The existing profile text, academic service entries, publication metadata, person links and local portrait remain the content sources; the reference package does not override these facts or the shared publication renderer. Font provenance and original licenses are documented in [assets/fonts/README.md](assets/fonts/README.md). Current branch and deployment conventions are maintained in [MAINTENANCE.md](MAINTENANCE.md) and [AGENTS.md](AGENTS.md).

The homepage presents an English biography followed directly by its Chinese version, a separate Publications summary section, academic service, and an email-only Contact section. The Publications summary reads “I have published papers in IJCAI, AAAI, IJCV, …” and includes a View publications link. Retain the introductory phrase followed by venue abbreviations and the ellipsis; do not reduce it to a bare venue list. The named venues follow the existing AMR-LLM (IJCAI), Signal Enhancement (AAAI), and Focus Depth Anything (IJCV) entries documented above. The ellipsis is a presentation choice, not evidence for additional papers, venues, publication statuses, counts, or rankings. The summary is maintained only in `index.html` under `.publication-summary`.

Individual publications appear on the separate Publications page as text entries with original publication links.

The user supplied the academic service entries **IJCAI 2026 reviewer** and **ICLR 2027 reviewer** on 13 October 2026. These entries are based on the user's statement, not an independent verification of reviewer lists.

The displayed role titles follow the conferences' official terminology: [IJCAI-ECAI 2026 Call for PC Members](https://2026.ijcai.org/call-for-pc-members/) identifies reviewers as **Program Committee members**, while the [ICLR 2027 Reviewer Guide](https://iclr.cc/Conferences/2027/ReviewerGuidelines) uses **Reviewer** and separately refers to Program Chairs as PCs. The website therefore displays **Program Committee Member** for IJCAI 2026 and **Reviewer** for ICLR 2027, without duplicate Chinese labels. This verifies terminology, not individual membership.

Publication years, authors, venues, and links derive from the sources above. Previous decorative illustrations and per-paper editorial summaries are not displayed in the current interface.

On 13 October 2026, the user specified [Yuhua Qian's university homepage](https://dig.sxu.edu.cn/qyh/index.htm) for the advisor link and [Xinyan Liang's homepage](https://xinyanliang.github.io/) for author links. These destinations are user-specified. The bilingual biography now ends with the collaboration statement about multimodal learning and visual perception; the separate recent-research paragraph has been removed at the user's request.

At runtime, `people.js` (`window.SITE_PEOPLE`) is the single source of truth for person homepage URLs and name aliases. The links above remain historical source records; person links displayed on the site follow the current people configuration.
