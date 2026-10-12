(() => {
  'use strict';
  const data = window.SITE_DATA;
  const $ = (selector) => document.querySelector(selector);
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const external = 'target="_blank" rel="noopener noreferrer"';
  const translations = {
    en: {
      skip:'Skip to content', aboutNav:'About', researchNav:'Research', publicationsNav:'Publications', contactNav:'Contact',
      heroEyebrow:'PHD STUDENT · SHANXI UNIVERSITY', tagline:'Evolving intelligence.<br>Accelerating discovery.',
      exploreWork:'Explore my work', portraitCaption:'A little curiosity. A different perspective.', workingOn:'THINKING ABOUT',
      agentsTopic:'AI scientist agents', multiView:'Multi-view learning', signal:'Data intelligence', aboutTitle:'A little context.', universityProfile:'University profile',
      education:'EDUCATION · SHANXI UNIVERSITY', researchTitle:'Questions that connect.', researchSubtitle:'Different perspectives.<br>A shared pursuit of understanding.',
      publicationsTitle:'Selected work<span class="heading-period">.</span>', allOnScholar:'All on Google Scholar',
      publicationNote:'Concept illustrations · Full details in the linked papers.', downloadBib:'Download bibliography',
      contactTitle:'Good research starts<br>with a conversation.', contactIntro:"A question, an idea, or a shared research interest?<br>I'd be happy to hear from you.",
      sayHello:'SAY HELLO', copyEmail:'Copy email address', footerNote:'Curiosity, with care.', backTop:'Back to top',
      citePaper:'Cite this paper', copyCitation:'Copy citation', downloadCitation:'Download .bib ↓',
      all:'All work', language:'LLMs & signals', multimodal:'Multimodal', vision:'Vision', search:'Find a paper…',
      firstAuthor:'First author', paper:'Paper', code:'Code', empty:'No papers match your search.', reset:'Clear filters',
      found:'publications shown', copiedEmail:'Email address copied', copiedCitation:'Citation copied', copyFailed:'Copy unavailable. Please select and copy the text.',
      dark:'Switch to dark mode', light:'Switch to light mode', menu:'Open navigation', closeMenu:'Close navigation', closeCitation:'Close citation',
      advisor:'Advised by Prof.', institution:'University', paperImage:'Concept illustration for', downloadReady:'Bibliography downloaded'
    },
    zh: {
      skip:'跳转到正文', aboutNav:'关于', researchNav:'研究方向', publicationsNav:'论文成果', contactNav:'联系',
      heroEyebrow:'博士研究生 · 山西大学', tagline:'让智能演化，<br>让科学发现更进一步。',
      exploreWork:'探索我的研究', portraitCaption:'保持好奇，换一个视角。', workingOn:'正在思考',
      agentsTopic:'AI 科学家智能体', multiView:'多视图学习', signal:'数据智能', aboutTitle:'关于我。', universityProfile:'院系个人主页',
      education:'教育经历 · 山西大学', researchTitle:'从问题出发，让研究相连。', researchSubtitle:'不同的视角，<br>共同的求知。',
      publicationsTitle:'代表性工作<span class="heading-period">。</span>', allOnScholar:'在 Google Scholar 查看全部',
      publicationNote:'配图为概念示意，研究细节请参阅论文原文。', downloadBib:'下载参考文献',
      contactTitle:'好的研究，<br>始于一次交流。', contactIntro:'一个问题、一个想法，或一个共同的研究兴趣？<br>欢迎来信交流。',
      sayHello:'联系我', copyEmail:'复制邮箱地址', footerNote:'心怀好奇，认真求索。', backTop:'返回顶部',
      citePaper:'引用这篇论文', copyCitation:'复制引用', downloadCitation:'下载 .bib ↓',
      all:'全部', language:'大模型与信号', multimodal:'多模态', vision:'视觉', search:'搜索论文…',
      firstAuthor:'第一作者', paper:'原文', code:'代码', empty:'未找到符合条件的论文。', reset:'清除筛选',
      found:'篇论文', copiedEmail:'邮箱地址已复制', copiedCitation:'引用已复制', copyFailed:'无法自动复制，请选中文字后复制。',
      dark:'切换到深色模式', light:'切换到浅色模式', menu:'打开导航菜单', closeMenu:'关闭导航菜单', closeCitation:'关闭引用',
      advisor:'导师', institution:'院系主页', paperImage:'研究概念示意：', downloadReady:'参考文献已下载'
    }
  };
  let language = 'en';
  try { const saved = localStorage.getItem('shen-language'); if (saved === 'zh' || saved === 'en') language = saved; } catch {}
  let filter = 'all';
  let query = '';
  let activePaper = null;
  let citationTrigger = null;
  let toastTimeout;
  const t = (key) => translations[language][key] || key;
  const local = (value) => typeof value === 'object' ? value[language] || value.en : value;
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const icons = {
    agents:'<path d="M28 14C47 2 69 9 76 27M77 18l0 10-10-2M70 48C51 61 28 51 22 35M21 44l0-10 10 1"/><rect x="37" y="22" width="27" height="20" rx="5"/><circle cx="45" cy="31" r="1.5" fill="currentColor"/><circle cx="56" cy="31" r="1.5" fill="currentColor"/><path d="M46 37h9M51 22v-6"/><circle cx="51" cy="14" r="2"/>',
    language:'<path d="M10 44L30 29 49 36 66 16 88 10M10 44L30 49 49 36 66 39 88 10M30 29V49M66 16v23"/><circle cx="10" cy="44" r="3"/><circle cx="30" cy="29" r="4"/><circle cx="30" cy="49" r="3"/><circle cx="49" cy="36" r="5"/><circle cx="66" cy="16" r="4"/><circle cx="66" cy="39" r="3"/><circle cx="88" cy="10" r="4"/><path d="M9 55h81" stroke-dasharray="2 4" opacity=".3"/>',
    multiview:'<path d="m13 22 25-14 25 14-25 14zM13 32l25 14 25-14M13 42l25 14 25-14M13 22v20M38 36v20M63 22v20"/><path d="m40 18 23-11 22 13-22 14M63 34v17M63 51l22-13V20" opacity=".4"/>',
    signal:'<path d="M4 32h88M8 5v51" opacity=".25"/><path d="M5 32c6 0 5-19 11-19s5 38 12 38 6-44 13-44 5 47 12 47 5-43 12-43 5 32 11 32 7-18 15-18"/><path d="M5 35c11-31 21 31 32 0s23 31 34 0 14 0 20 0" opacity=".3"/>'
  };
  function renderProfile() {
    const profile = data.profile;
    $('#profile-name').textContent = profile.name;
    $('#profile-name-zh').textContent = profile.nameZh;
    $('#profile-intro').textContent = local(profile.intro);
    $('#profile-portrait').src = profile.portrait;
    $('#profile-portrait').alt = language === 'zh' ? `${profile.nameZh}的照片` : `Portrait of ${profile.name}`;
    $('#about-bio').textContent = local(profile.about);
    $('#research-note').textContent = local(profile.researchNote);
    $('#institution-link').href = profile.institution;
    $('#hero-scholar').href = profile.scholar;
    $('#all-scholar').href = profile.scholar;
    $('#email-link').textContent = profile.email;
    $('#email-link').href = `mailto:${profile.email}`;
    $('#contact-socials').innerHTML = `<a href="${escape(profile.scholar)}" ${external}>Google Scholar ↗</a>${profile.github ? `<a href="${escape(profile.github)}" ${external}>GitHub ↗</a>` : ''}<a href="${escape(profile.institution)}" ${external}>${t('institution')} ↗</a>${profile.cv ? `<a href="${escape(profile.cv)}" ${external}>CV ↗</a>` : ''}`;
    $('#education-list').innerHTML = data.education.map(item => `<div class="education-item"><div class="education-date">${escape(language === 'zh' ? item.periodZh : item.period)}</div><div class="education-degree"><strong>${escape(language === 'zh' ? item.degreeZh : item.degree)}</strong> ${escape(language === 'zh' ? item.fieldZh : item.field)}</div></div>`).join('');
    $('#research-grid').innerHTML = data.research.map(item => `<article class="research-item"><div class="research-art" aria-hidden="true"><svg viewBox="0 0 100 64">${icons[item.icon] || icons.language}</svg></div><h3>${escape(local(item.title))}</h3><p>${escape(local(item.description))}</p></article>`).join('');
    $('#copyright').textContent = `© ${new Date().getFullYear()} ${profile.name} · ${language === 'zh' ? '山西大学' : 'Shanxi University'}`;
  }
  function renderFilters() {
    $('#publication-filters').innerHTML = ['all', 'language', 'multimodal', 'vision'].map(category => {
      const count = data.publications.filter(paper => category === 'all' || paper.category === category).length;
      return `<button class="filter-button" data-filter="${category}" aria-pressed="${filter === category}">${t(category)}<span class="filter-count">${count}</span></button>`;
    }).join('');
    $('#publication-filters').setAttribute('aria-label', language === 'zh' ? '按主题筛选论文' : 'Filter publications by topic');
  }
  function renderPublications() {
    const papers = data.publications.filter(paper => (filter === 'all' || paper.category === filter) && `${paper.title} ${paper.authors.join(' ')} ${paper.tags.join(' ')} ${paper.venue} ${paper.year} ${local(paper.summary)}`.toLowerCase().includes(query.toLowerCase().trim()));
    $('#publication-list').innerHTML = papers.length ? papers.map(paper => `<article class="publication" id="paper-${escape(paper.id)}"><a class="paper-visual" href="${escape(paper.url)}" ${external} aria-label="${escape(paper.title)}"><img src="${escape(paper.image)}" alt="${escape(t('paperImage') + ' ' + paper.title)}" width="360" height="220" loading="lazy"></a><div class="paper-details"><div class="paper-topline"><span class="venue">${escape(paper.venue)}</span><span class="paper-year">${paper.year}</span>${paper.firstAuthor ? `<span class="first-author">${t('firstAuthor')}</span>` : ''}</div><h3 class="paper-title"><a href="${escape(paper.url)}" ${external}>${escape(paper.title)}</a></h3><p class="paper-authors">${paper.authors.map(author => author === data.profile.name ? `<strong>${escape(author)}</strong>` : escape(author)).join(', ')}</p><p class="paper-summary">${escape(local(paper.summary))}</p><div class="paper-links"><a href="${escape(paper.url)}" ${external}>${t('paper')} <span aria-hidden="true">↗</span></a>${paper.pdf ? `<a href="${escape(paper.pdf)}" ${external}>PDF <span aria-hidden="true">↗</span></a>` : ''}${paper.code ? `<a href="${escape(paper.code)}" ${external}>${t('code')} <span aria-hidden="true">↗</span></a>` : ''}<button data-cite="${escape(paper.id)}" aria-label="BibTeX: ${escape(paper.title)}">BibTeX <span aria-hidden="true">↗</span></button><span class="paper-tags">${escape(paper.tags[0])}</span></div></div></article>`).join('') : `<div class="empty-state"><p>${t('empty')}</p><button id="reset-search">${t('reset')}</button></div>`;
    $('#publication-results').textContent = `${papers.length} ${t('found')}`;
  }
  function syncTheme() {
    const dark = document.documentElement.dataset.theme === 'dark';
    $('#theme-toggle').innerHTML = dark ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15a8 8 0 0 1-11-11 8.5 8.5 0 1 0 11 11Z"/></svg>';
    $('#theme-toggle').setAttribute('aria-label', t(dark ? 'light' : 'dark'));
    document.querySelector('meta[name="theme-color"]').content = dark ? '#141c18' : '#fafbf7';
  }
  function applyLanguage() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(element => { element.innerHTML = t(element.dataset.i18n); });
    $('#language-toggle').innerHTML = language === 'en' ? '中 <span>/</span> <b>EN</b>' : '<b>中</b> <span>/</span> EN';
    $('#language-toggle').setAttribute('aria-label', language === 'en' ? 'Switch to Chinese' : 'Switch to English');
    $('#publication-search').placeholder = t('search');
    $('#publication-search').setAttribute('aria-label', language === 'zh' ? '搜索论文' : 'Search publications');
    $('#close-citation').setAttribute('aria-label', t('closeCitation'));
    $('#menu-toggle').setAttribute('aria-label', t($('#mobile-nav').hidden ? 'menu' : 'closeMenu'));
    document.title = language === 'zh' ? `${data.profile.name}（${data.profile.nameZh}）· 学术主页` : `${data.profile.name} · Research & Ideas`;
    renderProfile(); renderFilters(); renderPublications(); syncTheme();
  }
  function bibEscape(value) { return String(value).replace(/\\/g, '\\textbackslash{}').replace(/[&%_#]/g, char => `\\${char}`); }
  function bibliography(paper) {
    const authors = paper.authors.map(author => { const names = author.split(' '); const last = names.pop(); return `${last}, ${names.join(' ')}`; }).join(' and ');
    const fields = {title: `{${bibEscape(paper.title)}}`, author: authors};
    if (paper.type === 'inproceedings') fields.booktitle = paper.venueFull;
    if (paper.type === 'article') fields.journal = paper.venueFull;
    fields.year = paper.year;
    if (paper.volume) fields.volume = paper.volume;
    if (paper.number) fields.number = paper.number;
    if (paper.pages) fields.pages = paper.pages;
    if (paper.articleNumber) fields.pages = paper.articleNumber;
    if (paper.doi) fields.doi = paper.doi;
    if (paper.eprint) { fields.eprint = paper.eprint; fields.archivePrefix = 'arXiv'; }
    fields.url = paper.url;
    return `@${paper.type}{${paper.id.replaceAll('-', '')}${paper.year},\n${Object.entries(fields).map(([key, value]) => `  ${key} = {${value}}`).join(',\n')}\n}`;
  }
  function toast(message) {
    clearTimeout(toastTimeout);
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 3200);
  }
  async function copy(text, success) {
    try { await navigator.clipboard.writeText(text); toast(success); }
    catch { toast(t('copyFailed')); }
  }
  function downloadBib(content, name) {
    const url = URL.createObjectURL(new Blob([content + '\n'], {type:'application/x-bibtex;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = name; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $('#language-toggle').addEventListener('click', () => { language = language === 'en' ? 'zh' : 'en'; save('shen-language', language); applyLanguage(); });
  $('#theme-toggle').addEventListener('click', () => { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; save('shen-theme', theme); syncTheme(); });
  $('#publication-filters').addEventListener('click', event => { const button = event.target.closest('[data-filter]'); if (!button) return; filter = button.dataset.filter; renderFilters(); renderPublications(); $(`[data-filter="${filter}"]`).focus({preventScroll:true}); });
  $('#publication-search').addEventListener('input', event => { query = event.target.value; renderPublications(); });
  $('#publication-list').addEventListener('click', event => {
    if (event.target.closest('#reset-search')) { query = ''; filter = 'all'; $('#publication-search').value = ''; renderFilters(); renderPublications(); $('#publication-search').focus({preventScroll:true}); return; }
    const button = event.target.closest('[data-cite]'); if (!button) return;
    activePaper = data.publications.find(paper => paper.id === button.dataset.cite); citationTrigger = button;
    $('#citation-paper-title').textContent = activePaper.title;
    $('#citation-code').textContent = bibliography(activePaper);
    $('#citation-dialog').showModal();
  });
  $('#close-citation').addEventListener('click', () => $('#citation-dialog').close());
  $('#citation-dialog').addEventListener('click', event => { if (event.target === $('#citation-dialog')) { const rect = event.target.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.target.close(); } });
  $('#citation-dialog').addEventListener('close', () => { if (citationTrigger?.isConnected) citationTrigger.focus({preventScroll:true}); });
  $('#copy-citation').addEventListener('click', () => activePaper && copy(bibliography(activePaper), t('copiedCitation')));
  $('#download-citation').addEventListener('click', () => activePaper && downloadBib(bibliography(activePaper), `${activePaper.id}.bib`));
  $('#download-bib').addEventListener('click', () => downloadBib(data.publications.map(bibliography).join('\n\n'), 'shen-hu-publications.bib'));
  $('#copy-email').addEventListener('click', () => copy(data.profile.email, t('copiedEmail')));
  const closeMenu = () => { $('#mobile-nav').hidden = true; $('#menu-toggle').setAttribute('aria-expanded', 'false'); $('#menu-toggle').setAttribute('aria-label', t('menu')); };
  $('#menu-toggle').addEventListener('click', () => { const open = $('#mobile-nav').hidden; $('#mobile-nav').hidden = !open; $('#menu-toggle').setAttribute('aria-expanded', String(open)); $('#menu-toggle').setAttribute('aria-label', t(open ? 'closeMenu' : 'menu')); });
  $('#mobile-nav').addEventListener('click', event => { if(event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if(event.key === 'Escape' && !$('#mobile-nav').hidden) { closeMenu(); $('#menu-toggle').focus(); } });
  window.matchMedia('(min-width: 561px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) document.querySelectorAll('.desktop-nav a').forEach(link => { const active = link.getAttribute('href') === `#${entry.target.id}`; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); }); }); }, {rootMargin:'-15% 0px -65% 0px', threshold:0});
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
  const structured = document.createElement('script'); structured.type = 'application/ld+json'; structured.textContent = JSON.stringify({'@context':'https://schema.org','@type':'Person',name:data.profile.name,alternateName:data.profile.nameZh,affiliation:{'@type':'Organization',name:data.profile.affiliation.en},email:data.profile.email,sameAs:[data.profile.scholar,data.profile.github,data.profile.institution].filter(Boolean),knowsAbout:['AI scientist agent systems','LLM-driven evolutionary data intelligence','Multi-view learning','Signal processing']}); document.head.append(structured);
  applyLanguage();
})();
