/* Shared by the browser and scripts/sync-publications.mjs. Keep rendering deterministic. */
(() => {
  'use strict';

  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const external = 'target="_blank" rel="noopener noreferrer"';
  const arrow = '<span class="link-arrow" aria-hidden="true">↗</span>';

  function linkUrl(value, base) {
    const url = String(value ?? '').trim();
    if (!url) return '';
    if (/[\u0000-\u001f\u007f\\]/.test(url)) throw new Error(`Invalid publication URL: ${url}`);
    if (/^https?:\/\//i.test(url)) {
      new URL(url);
      return url;
    }
    if (/^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith('/')) {
      throw new Error(`Use an HTTP(S) URL or a site-relative path: ${url}`);
    }
    return /^https?:\/\//i.test(base)
      ? new URL(url, base).href
      : `${base}${url.replace(/^(?:\.\/)+/, '')}`;
  }

  function render(data, people = {}, base = './') {
    if (!data?.profile || !Array.isArray(data.publications)) {
      throw new Error('Publications require SITE_DATA.profile and SITE_DATA.publications.');
    }
    base = String(base);
    const personUrls = new Map();
    Object.entries(people).forEach(([name, person]) => {
      const url = String(person.url ?? '').trim();
      if (url && !/^https?:\/\//i.test(url)) throw new Error(`Use an HTTP(S) homepage URL for ${name}.`);
      [name, ...(person.aliases || [])].forEach(alias => { personUrls.set(alias, linkUrl(url, base)); });
    });
    const papers = data.publications;
    const years = [...new Set(papers.map(paper => paper.year))].sort((a, b) => b - a);

    function renderPaper(paper) {
      const authors = paper.authors.map(author => {
        const isOwner = author === data.profile.name || author === data.profile.nameZh;
        const label = isOwner ? `<strong>${escape(author)}</strong>` : escape(author);
        const url = personUrls.get(author);
        return url ? `<a href="${escape(url)}" ${external}>${label}</a>` : label;
      }).join(', ');
      const venue = paper.venue === 'arXiv'
        ? `arXiv preprint, ${escape(paper.year)}`
        : `<strong>${escape(paper.venue)}</strong> · ${escape(paper.venueFull)}, ${escape(paper.year)}`;
      const paperUrl = linkUrl(paper.url, base);
      const pdfUrl = linkUrl(paper.pdf, base);
      const title = paperUrl
        ? `<a href="${escape(paperUrl)}" ${external}>${escape(paper.title)}</a>`
        : escape(paper.title);
      const links = [
        paperUrl ? `<a href="${escape(paperUrl)}" ${external}>Paper ${arrow}</a>` : '',
        pdfUrl ? `<a href="${escape(pdfUrl)}" ${external}>PDF ${arrow}</a>` : ''
      ].filter(Boolean);
      return `<li class="publication" id="paper-${escape(paper.id)}">
  <article>
    <h4 class="paper-title">${title}</h4>
    <p class="paper-authors">${authors}</p>
    <p class="paper-venue">${venue}</p>
    <div class="paper-links">${links.join(' ')}</div>
  </article>
</li>`;
    }

    return {
      years: `<ul>${years.map(year => `<li><a href="#year-${escape(year)}">${escape(year)}</a></li>`).join('')}</ul>`,
      list: years.map(year => `<section class="publication-year" aria-labelledby="year-${escape(year)}">
  <h3 id="year-${escape(year)}" tabindex="-1">${escape(year)}</h3>
  <ol class="year-papers">
${papers.filter(paper => paper.year === year).map(renderPaper).map(paper => paper.split('\n').map(line => `    ${line}`).join('\n')).join('\n')}
  </ol>
</section>`).join('\n')
    };
  }

  window.SITE_PUBLICATIONS = Object.freeze({ render });
})();
