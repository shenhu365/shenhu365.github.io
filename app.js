(() => {
  'use strict';

  const data = window.SITE_DATA;
  if (!data) return;

  const profile = data.profile;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const external = 'target="_blank" rel="noopener noreferrer"';
  const icons = {
    email: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/>',
    scholar: '<path d="m2 9 10-5 10 5-10 5-10-5Zm4 3v6c4 3 8 3 12 0v-6M22 9v8"/>',
    github: '<path d="M9 20v-3c-4 1-4-2-6-2m12 5v-4c0-1-.3-2-1-2 4-.5 6-2 6-6 0-1-.5-2-1-3 0-1 0-2-.5-3-2 0-3 1-4 2a12 12 0 0 0-5 0C8 3 7 2 5 2c-.5 1-.5 2-.5 3-1 1-1.5 2-1.5 3 0 4 2 5.5 6 6-.7.5-1 1-1 2v4"/>',
    university: '<path d="m3 8 9-5 9 5H3Zm0 13h18M5 10v8m5-8v8m4-8v8m5-8v8M3 18h18"/>',
    cv: '<path d="M6 2h8l4 4v16H6V2Zm8 0v5h4M9 12h6m-6 4h6"/>'
  };

  function profileLink(label, url, icon, isExternal = true) {
    return `<li><a href="${escape(url)}" ${isExternal ? external : ''}><svg class="link-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[icon]}</svg><span>${escape(label)}</span></a></li>`;
  }

  const fields = {
    name: profile.name,
    nameZh: profile.nameZh,
    affiliationEn: profile.affiliation.en,
    affiliationZh: profile.affiliation.zh
  };
  document.querySelectorAll('[data-profile]').forEach(element => {
    if (element.dataset.profile === 'portrait') {
      element.src = profile.portrait;
      element.alt = `${profile.name} / ${profile.nameZh}`;
    } else {
      element.textContent = fields[element.dataset.profile] ?? '';
    }
  });

  const links = [
    profileLink(profile.email, `mailto:${profile.email}`, 'email', false),
    profileLink('Google Scholar', profile.scholar, 'scholar'),
    profile.github ? profileLink('GitHub', profile.github, 'github') : '',
    profileLink('University profile', profile.institution, 'university'),
    profile.cv ? profileLink('CV', profile.cv, 'cv') : ''
  ].join('');
  document.querySelectorAll('[data-profile-links]').forEach(element => { element.innerHTML = links; });
  document.querySelectorAll('[data-email]').forEach(element => {
    element.href = `mailto:${profile.email}`;
    element.textContent = profile.email;
  });
  document.querySelectorAll('[data-scholar]').forEach(element => { element.href = profile.scholar; });
  document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });

  document.querySelectorAll('[data-bio]').forEach(element => {
    const language = element.dataset.bio;
    let content = escape(profile.about[language]);
    const advisor = language === 'en' ? profile.advisor : profile.advisorZh;
    content = content.replace(escape(advisor), `<a href="${escape(profile.advisorUrl)}" ${external}>${escape(advisor)}</a>`);
    const keyTerms = language === 'en'
      ? ['LLM-driven evolutionary data intelligence', 'AI scientist agent systems']
      : ['大模型驱动的演化数据智能', 'AI 科学家智能体系统'];
    keyTerms.forEach(term => { content = content.replace(escape(term), `<strong>${escape(term)}</strong>`); });
    element.innerHTML = content;
  });
  document.querySelectorAll('[data-research-note]').forEach(element => {
    element.textContent = profile.researchNote[element.dataset.researchNote];
  });

  const serviceList = document.querySelector('[data-services]');
  if (serviceList) {
    serviceList.innerHTML = data.services.map(service =>
      `<li><strong>${escape(service.venue)} ${escape(service.year)}</strong><span>${escape(service.role.en)}</span></li>`
    ).join('');
  }

  function renderPaper(paper) {
    const authors = paper.authors.map(author => author === profile.name
      ? `<strong>${escape(author)}</strong>` : escape(author)).join(', ');
    const venue = paper.venue === 'arXiv'
      ? `arXiv preprint, ${escape(paper.year)}`
      : `<strong>${escape(paper.venue)}</strong> · ${escape(paper.venueFull)}, ${escape(paper.year)}`;
    return `<li class="publication" id="paper-${escape(paper.id)}">
      <article>
        <h4 class="paper-title"><a href="${escape(paper.url)}" ${external}>${escape(paper.title)}</a></h4>
        <p class="paper-authors">${authors}</p>
        <p class="paper-venue">${venue}</p>
        <div class="paper-links">
          <a href="${escape(paper.url)}" ${external}>Paper ↗</a>
          ${paper.pdf ? `<a href="${escape(paper.pdf)}" ${external}>PDF ↗</a>` : ''}
        </div>
      </article>
    </li>`;
  }

  const publicationList = document.querySelector('#publication-list');
  if (publicationList) {
    const years = [...new Set(data.publications.map(paper => paper.year))].sort((a, b) => b - a);
    publicationList.innerHTML = years.map(year => `<section class="publication-year" aria-labelledby="year-${year}">
      <h3 id="year-${year}">${year}</h3>
      <ol class="year-papers">${data.publications.filter(paper => paper.year === year).map(renderPaper).join('')}</ol>
    </section>`).join('');
  }

  const structured = document.createElement('script');
  structured.type = 'application/ld+json';
  structured.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Person',
    name: profile.name, alternateName: profile.nameZh,
    affiliation: { '@type': 'Organization', name: profile.affiliation.en },
    email: profile.email,
    sameAs: [profile.scholar, profile.github, profile.institution].filter(Boolean),
    knowsAbout: ['AI scientist agent systems', 'LLM-driven evolutionary data intelligence', 'Multi-view learning', 'Signal processing']
  });
  document.head.append(structured);
})();
