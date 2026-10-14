/* Edit your profile, academic service, awards and publications here. Person homepage URLs live in people.js. */
window.SITE_DATA = {
  profile: {
    name: 'Shen Hu', nameZh: '胡深', initials: 'sh.',
    affiliation: { en: 'Institute of Big Data Science and Industry, Shanxi University', zh: '山西大学大数据科学与产业研究院' },
    role: { en: 'Ph.D. student in Computer Science', zh: '计算机科学与技术 · 博士研究生' },
    email: 'hushen@alu.sxu.edu.cn',
    portrait: './assets/shen-hu-official.png',
    scholar: 'https://scholar.google.com/citations?user=Q31HAAcAAAAJ',
    institution: 'https://dig.sxu.edu.cn/xwz/td/bss/2023j/b91acaa0e0754523bf255812c80f2d0d.htm',
    advisor: 'Yuhua Qian', advisorZh: '钱宇华',
    github: 'https://github.com/shenhu365', cv: '', updated: '2026-10-13',
    intro: {
      en: 'I work on LLM-driven evolutionary data intelligence, with a focus on AI scientist agent systems.',
      zh: '研究大模型驱动的演化数据智能，聚焦 AI 科学家智能体系统。'
    },
    about: {
      en: 'I am a Ph.D. student at the Institute of Big Data Science and Industry, Shanxi University, advised by Prof. Yuhua Qian. My research focuses on LLM-driven evolutionary data intelligence and AI scientist agent systems. I also collaborate on research in multimodal learning and visual perception.',
      zh: '我是山西大学大数据科学与产业研究院博士研究生，师从钱宇华教授。主要研究大模型驱动的演化数据智能，聚焦 AI 科学家智能体系统。同时参与多模态学习与视觉感知方向的合作研究。'
    }
  },
  services: [
    { venue: 'ICLR', year: 2027, role: { en: 'Reviewer', zh: '审稿人' } },
    { venue: 'IJCAI', year: 2026, role: { en: 'Program Committee Member', zh: '程序委员会成员' } }
  ],
  awards: [
    {
      title: { en: 'China Undergraduate Mathematical Contest in Modeling (CUMCM)', zh: '全国大学生数学建模竞赛' },
      honor: { en: 'National Second Prize', zh: '全国二等奖' },
      detail: { en: '', zh: '' },
      url: 'https://www.mcm.edu.cn/'
    },
    {
      title: { en: '“Huawei Cup” China Post-Graduate Mathematical Contest in Modeling (CPMCM)', zh: '“华为杯”中国研究生数学建模竞赛' },
      honor: { en: 'National Second Prize', zh: '全国二等奖' },
      detail: { en: 'Top 4% in Huawei Special Problem B', zh: '华为专项 B 题排名前 4%' },
      url: 'https://cpipc.acge.org.cn/cw/hp/4'
    },
    {
      title: { en: 'China Computer Federation (CCF)', zh: '中国计算机学会（CCF）' },
      honor: { en: 'Recognition for Campus Outreach', zh: '高校宣传员表彰' },
      detail: { en: '', zh: '' },
      url: 'https://www.ccf.org.cn/c/2018-09-29/653020.shtml'
    }
  ],
  education: [
    { period: '2023 — Present', periodZh: '2023 — 至今', degree: 'Ph.D.', degreeZh: '博士', field: 'Computer Science & Technology', fieldZh: '计算机科学与技术' },
    { period: '2020 — 2023', periodZh: '2020 — 2023', degree: 'Master’s', degreeZh: '硕士', field: 'Computer Science & Technology', fieldZh: '计算机科学与技术' },
    { period: '2016 — 2020', periodZh: '2016 — 2020', degree: 'Bachelor’s', degreeZh: '学士', field: 'Computer Science & Technology', fieldZh: '计算机科学与技术' }
  ],
  research: [
    { id: 'agents', number: '01', title: { en: 'AI scientist agents', zh: 'AI 科学家智能体' }, description: { en: 'Agent systems for exploring questions and advancing scientific discovery.', zh: '面向科学问题探索与发现的智能体系统。' }, icon: 'agents' },
    { id: 'language', number: '02', title: { en: 'Evolutionary data intelligence', zh: '演化数据智能' }, description: { en: 'LLM-driven intelligence that develops through data and knowledge.', zh: '以大模型驱动数据与知识中的智能演化。' }, icon: 'language' },
    { id: 'multiview', number: '03', title: { en: 'Multi-view learning', zh: '多视图学习' }, description: { en: 'Learning complementary representations across views.', zh: '从不同视角中学习互补的表征。' }, icon: 'multiview' },
    { id: 'signal', number: '04', title: { en: 'Signal processing', zh: '信号处理' }, description: { en: 'Understanding structure in complex, noisy signals.', zh: '理解复杂信号与噪声背后的结构。' }, icon: 'signal' }
  ],
  publications: [
    {
      id: 'amr-llm', title: 'AMR-LLM: Knowledge-Enhanced Multi-Modal Automatic Modulation Recognition via Large Language Models',
      authors: ['Shen Hu', 'Yuhua Qian', 'Xinyan Liang', 'Zikun Jin', 'Jiaqian Zhang', 'Jiangfeng Zhang'],
      year: 2026, venue: 'IJCAI', venueFull: 'Proceedings of the Thirty-Fifth International Joint Conference on Artificial Intelligence',
      category: 'language', tags: ['LLMs', 'Signal processing'], firstAuthor: true,
      summary: { en: 'Bringing domain knowledge and signal perception into large language models.', zh: '将领域知识与信号感知引入大语言模型。' },
      url: 'https://www.ijcai.org/proceedings/2026/486', pdf: 'https://www.ijcai.org/proceedings/2026/0486.pdf', code: '',
      doi: '10.24963/ijcai.2026/486', pages: '4367--4375', type: 'inproceedings', image: './assets/paper-amr.svg'
    },
    {
      id: 'focus-depth', title: 'Focus Depth Anything: Towards Robust Depth from Focus in the Wild',
      authors: ['Jiangfeng Zhang', 'Yuhua Qian', 'Tao Yan', 'Shen Hu', 'Yayu Zhang', 'Jinwen Liu'],
      year: 2026, venue: 'IJCV', venueFull: 'International Journal of Computer Vision',
      category: 'vision', tags: ['Depth estimation', 'Visual perception'], firstAuthor: false,
      summary: { en: 'Learning robust depth perception from focus across diverse scenes.', zh: '面向多样真实场景，探索基于聚焦线索的鲁棒深度感知。' },
      url: 'https://link.springer.com/article/10.1007/s11263-026-03006-8', pdf: 'https://link.springer.com/content/pdf/10.1007/s11263-026-03006-8.pdf', code: 'https://github.com/jiangfeng-Z/Focus-Depth-Anything',
      doi: '10.1007/s11263-026-03006-8', volume: '134', articleNumber: '439', type: 'article', image: './assets/paper-depth.svg'
    },
    {
      id: 'signal-enhancement', title: 'Signal Enhancement via Multi-view Dynamic Representation and Alignment-aware Fusion',
      authors: ['Zikun Jin', 'Yuhua Qian', 'Xinyan Liang', 'Jiaqian Zhang', 'Jinpeng Yuan', 'Shen Hu', 'Haijun Geng', 'Honghong Cheng'],
      year: 2026, venue: 'AAAI', venueFull: 'Proceedings of the AAAI Conference on Artificial Intelligence',
      category: 'multimodal', tags: ['Multi-view learning', 'Signal enhancement'], firstAuthor: false,
      summary: { en: 'Aligning complementary views for more effective signal enhancement.', zh: '通过对齐互补视图，提升信号增强能力。' },
      url: 'https://ojs.aaai.org/index.php/AAAI/article/view/39404', pdf: 'https://ojs.aaai.org/index.php/AAAI/article/download/39404/43365', code: '',
      doi: '10.1609/aaai.v40i27.39404', volume: '40', number: '27', pages: '22454--22462', type: 'article', image: './assets/paper-signal.svg'
    },
    {
      id: 'balanced-multimodal', title: 'Balanced Multimodal Learning: An Unidirectional Dynamic Interaction Perspective',
      authors: ['Shijie Wang', 'Li Zhang', 'Xinyan Liang', 'Yuhua Qian', 'Shen Hu'],
      year: 2025, venue: 'arXiv', venueFull: 'arXiv preprint arXiv:2509.02281',
      category: 'multimodal', tags: ['Multimodal learning', 'Balanced optimization'], firstAuthor: false,
      summary: { en: 'Balancing how different modalities learn through dynamic interactions.', zh: '通过动态交互，平衡不同模态的学习过程。' },
      url: 'https://arxiv.org/abs/2509.02281', pdf: 'https://arxiv.org/pdf/2509.02281', code: '',
      eprint: '2509.02281', type: 'misc', image: './assets/paper-balance.svg'
    }
  ]
};
