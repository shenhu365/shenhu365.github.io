(() => {
  'use strict';

  // Resolve shared data paths from this script, including on nested/project pages.
  const siteBase = new URL('.', document.currentScript.src);
  const siteUrl = value => new URL(value, siteBase).href;
  if (window.location.pathname.endsWith('/index.html')) {
    window.history.replaceState(null, '', `./${window.location.search}${window.location.hash}`);
  }

  // A section link is the current location even though it shares the home page.
  const navigationLinks = [...document.querySelectorAll('.site-nav a')].map(link => ({
    link, url: new URL(link.href)
  }));
  const updateNavigation = () => {
    const pageLinks = navigationLinks.filter(({ url }) =>
      url.origin === window.location.origin && url.pathname === window.location.pathname);
    const current = pageLinks.find(({ url }) => url.hash && url.hash === window.location.hash)
      || pageLinks.find(({ url }) => !url.hash);
    navigationLinks.forEach(({ link }) => { link.removeAttribute('aria-current'); });
    if (current) current.link.setAttribute('aria-current', current.url.hash ? 'location' : 'page');
  };
  updateNavigation();
  window.addEventListener('hashchange', updateNavigation);
  window.addEventListener('pageshow', updateNavigation);

  // Contract the navigation's surface, never its document space or the sidebar.
  const header = document.querySelector('.site-header');
  if (header) {
    const scrollPosition = () => Math.max(0, Math.min(window.scrollY,
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight)));
    let previousScroll = scrollPosition();
    let direction = 0;
    let travel = 0;
    let compact = false;
    let frame = 0;
    const setCompact = value => {
      if (compact === value) return;
      compact = value;
      header.classList.toggle('is-compact', value);
    };
    const updateHeader = () => {
      frame = 0;
      const scroll = scrollPosition();
      const delta = scroll - previousScroll;
      previousScroll = scroll;
      if (scroll <= 12) {
        direction = 0;
        travel = 0;
        setCompact(false);
      } else if (delta !== 0) {
        const nextDirection = Math.sign(delta);
        travel = nextDirection === direction ? travel + Math.abs(delta) : Math.abs(delta);
        direction = nextDirection;
        if (direction > 0 && scroll > 28 && travel >= 16) setCompact(true);
        else if (direction < 0 && travel >= 8) setCompact(false);
      }
    };
    const resetHeader = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      previousScroll = scrollPosition();
      direction = 0;
      travel = 0;
      setCompact(false);
    };
    window.addEventListener('scroll', () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader);
    }, { passive: true });
    window.addEventListener('resize', resetHeader);
    window.addEventListener('pageshow', resetHeader);
  }

  const data = window.SITE_DATA;
  if (!data) return;

  const profile = data.profile;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const external = 'target="_blank" rel="noopener noreferrer"';
  const personUrls = new Map();
  Object.entries(window.SITE_PEOPLE || {}).forEach(([name, person]) => {
    [name, ...(person.aliases || [])].forEach(alias => { personUrls.set(alias, person.url?.trim()); });
  });
  const personNames = [...personUrls.keys()].sort((a, b) => b.length - a.length).map(name => {
    const pattern = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return `${/^\w/.test(name) ? '\\b' : ''}${pattern}${/\w$/.test(name) ? '\\b' : ''}`;
  });
  const personPattern = personNames.length ? new RegExp(`(${personNames.join('|')})`, 'g') : null;

  function personLink(name, label = escape(name)) {
    const url = personUrls.get(name);
    return url ? `<a href="${escape(url)}" ${external}>${label}</a>` : label;
  }

  function linkPeople(text) {
    return personPattern ? text.split(personPattern).map(part => personLink(part)).join('') : escape(text);
  }

  const icons = {
    email: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/>',
    scholar: '<path d="m2 9 10-5 10 5-10 5-10-5Zm4 3v6c4 3 8 3 12 0v-6M22 9v8"/>',
    github: '<path d="M9 20v-3c-4 1-4-2-6-2m12 5v-4c0-1-.3-2-1-2 4-.5 6-2 6-6 0-1-.5-2-1-3 0-1 0-2-.5-3-2 0-3 1-4 2a12 12 0 0 0-5 0C8 3 7 2 5 2c-.5 1-.5 2-.5 3-1 1-1.5 2-1.5 3 0 4 2 5.5 6 6-.7.5-1 1-1 2v4"/>',
    university: '<path d="m3 8 9-5 9 5H3Zm0 13h18M5 10v8m5-8v8m4-8v8m5-8v8M3 18h18"/>',
    cv: '<path d="M6 2h8l4 4v16H6V2Zm8 0v5h4M9 12h6m-6 4h6"/>'
  };

  function profileLink(label, url, icon, isExternal = true) {
    return `<li><a href="${escape(siteUrl(url))}" ${isExternal ? external : ''}><svg class="link-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[icon]}</svg><span>${escape(label)}</span></a></li>`;
  }

  const fields = {
    name: profile.name,
    nameZh: profile.nameZh,
    affiliationEn: profile.affiliation.en,
    affiliationZh: profile.affiliation.zh
  };
  document.querySelectorAll('[data-profile]').forEach(element => {
    if (element.dataset.profile === 'portrait') {
      element.src = siteUrl(profile.portrait);
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
    let content = linkPeople(profile.about[language]);
    const keyTerms = language === 'en'
      ? ['LLM-driven evolutionary data intelligence', 'AI scientist agent systems']
      : ['大模型驱动的演化数据智能', 'AI 科学家智能体系统'];
    keyTerms.forEach(term => { content = content.replace(escape(term), `<strong>${escape(term)}</strong>`); });
    element.innerHTML = content;
  });

  const serviceList = document.querySelector('[data-services]');
  if (serviceList) {
    serviceList.innerHTML = data.services.map(service =>
      `<li><strong>${escape(service.venue)} ${escape(service.year)}</strong><span>${escape(service.role.en)}</span></li>`
    ).join('');
  }

  function renderPaper(paper) {
    const authors = paper.authors.map(author => {
      const name = author === profile.name ? `<strong>${escape(author)}</strong>` : escape(author);
      return personLink(author, name);
    }).join(', ');
    const venue = paper.venue === 'arXiv'
      ? `arXiv preprint, ${escape(paper.year)}`
      : `<strong>${escape(paper.venue)}</strong> · ${escape(paper.venueFull)}, ${escape(paper.year)}`;
    return `<li class="publication" id="paper-${escape(paper.id)}">
      <article>
        <h4 class="paper-title"><a href="${escape(siteUrl(paper.url))}" ${external}>${escape(paper.title)}</a></h4>
        <p class="paper-authors">${authors}</p>
        <p class="paper-venue">${venue}</p>
        <div class="paper-links">
          <a href="${escape(siteUrl(paper.url))}" ${external}>Paper ↗</a>
          ${paper.pdf ? `<a href="${escape(siteUrl(paper.pdf))}" ${external}>PDF ↗</a>` : ''}
        </div>
      </article>
    </li>`;
  }

  const publicationList = document.querySelector('#publication-list');
  if (publicationList) {
    const years = [...new Set(data.publications.map(paper => paper.year))].sort((a, b) => b - a);
    publicationList.innerHTML = years.map(year => `<section class="publication-year" aria-labelledby="year-${year}">
      <h3 id="year-${year}" tabindex="-1">${year}</h3>
      <ol class="year-papers">${data.publications.filter(paper => paper.year === year).map(renderPaper).join('')}</ol>
    </section>`).join('');
    const yearNavigation = document.querySelector('#publication-years');
    if (yearNavigation) {
      yearNavigation.innerHTML = `<ul>${years.map(year => `<li><a href="#year-${year}">${year}</a></li>`).join('')}</ul>`;
      yearNavigation.hidden = years.length === 0;
    }
  }

  document.querySelectorAll('[data-person]').forEach(element => {
    const name = element.dataset.person || element.textContent.trim();
    const url = personUrls.get(name);
    if (element.tagName === 'A') {
      if (url) {
        element.href = url;
        element.target = '_blank';
        element.rel = 'noopener noreferrer';
      } else {
        element.removeAttribute('href');
        element.removeAttribute('target');
        element.removeAttribute('rel');
      }
    } else {
      element.innerHTML = personLink(name, escape(element.textContent || name));
    }
  });

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
