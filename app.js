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

  // Contract the fixed navigation, keeping body spacing and the sidebar stable.
  const header = document.querySelector('.site-header');
  if (header) {
    const scrollPosition = () => Math.max(0, Math.min(window.scrollY,
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight)));
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
      header.classList.toggle('is-scrolled', scroll > 1);
      // Keep the compact state while scrolling back; expand only at the top.
      if (scroll <= 1) setCompact(false);
      else if (scroll > 28) setCompact(true);
    };
    const resetHeader = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      // Restoring or resizing a scrolled page must not expand the navigation.
      setCompact(scrollPosition() > 1);
      updateHeader();
    };
    window.addEventListener('scroll', () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader);
    }, { passive: true });
    window.addEventListener('resize', resetHeader);
    window.addEventListener('pageshow', resetHeader);
    resetHeader();
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
    const arrow = '<span class="profile-link-arrow" aria-hidden="true">↗</span>';
    return `<li${icon === 'email' ? ' class="profile-email"' : ''}><a href="${escape(siteUrl(url))}" ${isExternal ? external : ''}><svg class="link-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[icon]}</svg><span class="profile-link-label">${escape(label)}</span>${arrow}</a></li>`;
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
    } else if (element.dataset.profile === 'affiliationEn') {
      // The final comma separates the institute from its university in this field.
      const boundary = profile.affiliation.en.lastIndexOf(',');
      element.innerHTML = boundary < 0 ? escape(profile.affiliation.en)
        : `<span class="affiliation-institute">${escape(profile.affiliation.en.slice(0, boundary).trim())}</span><span class="affiliation-university">${escape(profile.affiliation.en.slice(boundary + 1).trim())}</span>`;
    } else {
      element.textContent = fields[element.dataset.profile] ?? '';
    }
  });

  const links = [
    profileLink('Google Scholar', profile.scholar, 'scholar'),
    profile.github ? profileLink('GitHub', profile.github, 'github') : '',
    profileLink('University profile', profile.institution, 'university'),
    profile.cv ? profileLink('CV', profile.cv, 'cv') : '',
    profileLink(profile.email, `mailto:${profile.email}`, 'email', false)
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
    serviceList.innerHTML = [...data.services].sort((a, b) => b.year - a.year).map(service =>
      `<li><strong>${escape(service.venue)} ${escape(service.year)}</strong><span>${escape(service.role.en)}</span></li>`
    ).join('');
  }

  const awardList = document.querySelector('[data-awards]');
  if (awardList) {
    awardList.innerHTML = data.awards.map(award =>
      `<li class="award"><article>
        <h3 class="award-title"><a href="${escape(award.url)}" ${external}>${escape(award.title.en)}</a></h3>
        <p class="award-title-zh" lang="zh-CN">${escape(award.title.zh)}</p>
        <p class="award-honor">${escape(award.honor.en)}<span lang="zh-CN">${escape(award.honor.zh)}</span></p>
        ${award.detail.en || award.detail.zh ? `<p class="award-detail">${escape(award.detail.en)}<span lang="zh-CN">${escape(award.detail.zh)}</span></p>` : ''}
      </article></li>`
    ).join('');
  }

  const publicationList = document.querySelector('#publication-list');
  if (publicationList && window.SITE_PUBLICATIONS) {
    const markup = window.SITE_PUBLICATIONS.render(data, window.SITE_PEOPLE, siteBase.href);
    publicationList.innerHTML = markup.list;
    const yearNavigation = document.querySelector('#publication-years');
    if (yearNavigation) {
      yearNavigation.innerHTML = markup.years;
      yearNavigation.hidden = data.publications.length === 0;
    }
  }

  // Highlight the native year anchor without intercepting navigation or history.
  const updateYearNavigation = () => {
    const links = [...document.querySelectorAll('#publication-years a')];
    const current = links.find(link => link.hash === window.location.hash)
      || (!window.location.hash ? links[0] : null);
    links.forEach(link => { link.removeAttribute('aria-current'); });
    if (current) current.setAttribute('aria-current', 'location');
  };
  updateYearNavigation();
  window.addEventListener('hashchange', updateYearNavigation);
  window.addEventListener('pageshow', updateYearNavigation);

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
