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
    const text = icon === 'email'
      ? `<span class="profile-email-address">${escape(label)}</span><span class="profile-email-short">Email</span>`
      : escape(label);
    const description = icon === 'email' ? ` aria-label="Email: ${escape(label)}" title="${escape(label)}"` : '';
    return `<li${icon === 'email' ? ' class="profile-email"' : ''}><a href="${escape(siteUrl(url))}"${description} ${isExternal ? external : ''}><svg class="link-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[icon]}</svg><span class="profile-link-label">${text}</span>${arrow}</a></li>`;
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
    profileLink('Google Scholar', profile.scholar, 'scholar'),
    profile.github ? profileLink('GitHub', profile.github, 'github') : '',
    profileLink('University profile', profile.institution, 'university'),
    profileLink(profile.email, `mailto:${profile.email}`, 'email', false),
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

  // Follow the reading position; native links still own scrolling and history.
  const yearNavigation = document.querySelector('#publication-years');
  if (yearNavigation) {
    const years = [...yearNavigation.querySelectorAll('a')].map(link => ({
      link, heading: document.getElementById(link.hash.slice(1))
    })).filter(year => year.heading);
    const headerInner = document.querySelector('.header-inner');
    const horizontalYears = window.matchMedia('(max-width: 1099px)');
    let currentYear = null;
    let targetYear = null;
    let targetTimer = 0;
    let yearFrame = 0;
    let revealYear = () => {};
    let updateYearDock = () => {};

    const clearYearTarget = () => {
      targetYear = null;
      window.clearTimeout(targetTimer);
    };
    const selectYear = (year, force = false) => {
      if (year !== currentYear || force) {
        years.forEach(({ link }) => { link.removeAttribute('aria-current'); });
        year.link.setAttribute('aria-current', 'location');
        currentYear = year;
        revealYear(year, force);
      }
      updateYearDock();
    };

    const updateYearNavigation = () => {
      yearFrame = 0;
      if (!years.length) return;
      const headerBottom = headerInner?.getBoundingClientRect().bottom || 0;
      const yearBounds = yearNavigation.getBoundingClientRect();
      const joined = horizontalYears.matches && headerBottom > 0
        && Math.abs(yearBounds.top - headerBottom) <= 1;
      // One backdrop spans both rows once they meet; separate blur edges leave a seam.
      if (joined) {
        yearNavigation.style.setProperty('--joined-navigation-offset', `${yearBounds.top}px`);
        yearNavigation.style.setProperty('--joined-navigation-left', `${yearBounds.left}px`);
        yearNavigation.style.setProperty('--joined-navigation-width', `${document.documentElement.clientWidth}px`);
      } else {
        ['--joined-navigation-offset', '--joined-navigation-left', '--joined-navigation-width']
          .forEach(property => yearNavigation.style.removeProperty(property));
      }
      document.body.classList.toggle('has-joined-navigation', joined);
      const obstruction = headerBottom + (horizontalYears.matches ? yearNavigation.offsetHeight : 0);
      const readingLine = Math.max(obstruction + 16, window.innerHeight * .35);
      let current = years[0];
      for (const year of years) {
        if (year.heading.getBoundingClientRect().top <= readingLine) current = year;
      }
      // The final group may be too short to reach the reading line.
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 1 && window.scrollY >= maxScroll - 2) current = years.at(-1);
      // A native smooth jump passes other groups before reaching its target.
      // Keep its selected number and center together during that transition.
      if (current === targetYear) clearYearTarget();
      selectYear(targetYear || current);
    };
    const scheduleYearNavigation = () => {
      if (!yearFrame) yearFrame = window.requestAnimationFrame(updateYearNavigation);
    };
    const cancelYearJump = () => {
      clearYearTarget();
      scheduleYearNavigation();
    };
    const jumpToYear = year => {
      if (!year) return;
      clearYearTarget();
      targetYear = year;
      selectYear(year, true);
      // Also recover if a browser cancels the native jump or cannot scroll.
      targetTimer = window.setTimeout(() => {
        clearYearTarget();
        scheduleYearNavigation();
      }, 1500);
    };
    window.addEventListener('scroll', scheduleYearNavigation, { passive: true });
    window.addEventListener('hashchange', () => {
      const target = years.find(year => year.link.hash === window.location.hash);
      if (target) jumpToYear(target);
      else clearYearTarget();
      scheduleYearNavigation();
    });
    ['pageshow', 'resize', 'load'].forEach(event => {
      window.addEventListener(event, () => { clearYearTarget(); scheduleYearNavigation(); });
    });
    // Manual browsing takes precedence over a pending anchor animation.
    window.addEventListener('wheel', cancelYearJump, { passive: true });
    window.addEventListener('touchmove', cancelYearJump, { passive: true });
    window.addEventListener('pointerdown', event => {
      if (!yearNavigation.contains(event.target)) cancelYearJump();
    }, { passive: true });
    window.addEventListener('keydown', event => {
      if (event.defaultPrevented || event.target.closest('input, textarea, select, [contenteditable]')) return;
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancelYearJump();
    });
    window.addEventListener('pagehide', clearYearTarget);
    if (typeof ResizeObserver !== 'undefined') {
      const yearLayoutObserver = new ResizeObserver(scheduleYearNavigation);
      if (publicationList) yearLayoutObserver.observe(publicationList);
      if (headerInner) yearLayoutObserver.observe(headerInner);
    }
    document.fonts?.ready.then(scheduleYearNavigation);
    // Enhance the real anchor list without changing the no-script version.
    const yearList = yearNavigation.querySelector('ul');
    if (yearList && years.length) {
      let revealPausedUntil = 0;
      let pendingClick = 0;
      let returnFocus = null;
      let drag = null;
      let suppressClickUntil = 0;
      let lastTouch = null;
      let centeredDock = window.scrollY > 1;
      let horizontalWindowed = false;
      yearNavigation.classList.add('is-enhanced');
      yearNavigation.style.setProperty('--year-slots', Math.min(years.length, 5));
      const cancelPendingClick = () => {
        window.clearTimeout(pendingClick);
        pendingClick = 0;
      };
      const pauseReveal = () => { revealPausedUntil = Date.now() + 1500; };
      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'year-edit-button';
      editButton.setAttribute('aria-label', 'Jump to year');
      editButton.setAttribute('aria-controls', 'publication-year-jump');
      editButton.setAttribute('aria-expanded', 'false');
      editButton.title = 'Enter a year';
      editButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5M4 20l4-1 12-12a2 2 0 0 0-5-5L3 14l-1 6Z"/></svg>';
      const form = document.createElement('form');
      form.id = 'publication-year-jump';
      form.className = 'year-jump';
      form.hidden = true;
      form.noValidate = true;
      form.setAttribute('aria-label', 'Jump to publication year');
      form.innerHTML = `<label for="publication-year-input">Jump to year</label>
        <div class="year-jump-fields"><input id="publication-year-input" type="text" inputmode="numeric" enterkeyhint="go" autocomplete="off" maxlength="4" placeholder="YYYY" aria-describedby="publication-year-message"><button type="submit">Go</button><button type="button" data-year-cancel aria-label="Cancel year entry">×</button></div>
        <p id="publication-year-message" role="status" aria-live="polite"></p>`;
      yearNavigation.append(editButton, form);
      const input = form.querySelector('input');
      const message = form.querySelector('[role="status"]');
      const available = years.map(year => year.link.textContent.trim());
      const availableText = available.join(', ');
      const closeEditor = (restoreFocus = true) => {
        form.hidden = true;
        editButton.setAttribute('aria-expanded', 'false');
        if (restoreFocus) (returnFocus || currentYear?.link || years[0].link).focus({ preventScroll: true });
      };
      const openEditor = trigger => {
        cancelPendingClick();
        returnFocus = trigger?.matches('a, button') ? trigger : currentYear?.link || years[0].link;
        input.value = trigger?.matches('a') ? trigger.textContent.trim() : currentYear?.link.textContent.trim() || available[0];
        input.removeAttribute('aria-invalid');
        message.textContent = `Publication years: ${availableText}.`;
        form.hidden = false;
        editButton.setAttribute('aria-expanded', 'true');
        input.focus({ preventScroll: true });
        input.select();
      };
      editButton.addEventListener('click', () => form.hidden ? openEditor(editButton) : closeEditor());
      form.querySelector('[data-year-cancel]').addEventListener('click', () => closeEditor());
      form.addEventListener('submit', event => {
        event.preventDefault();
        const value = input.value.trim();
        const target = /^\d{4}$/.test(value) && years.find(year => year.link.textContent.trim() === value);
        if (!target) {
          input.setAttribute('aria-invalid', 'true');
          message.textContent = /^\d{4}$/.test(value)
            ? `No publications in ${value}. Available years: ${availableText}.`
            : `Enter a four-digit year. Available years: ${availableText}.`;
          input.focus({ preventScroll: true });
          return;
        }
        closeEditor(false);
        revealPausedUntil = 0;
        target.link.click();
        target.heading.focus({ preventScroll: true });
      });
      input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); });
      yearNavigation.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !form.hidden) {
          event.preventDefault();
          closeEditor();
          return;
        }
        const index = years.findIndex(year => year.link === event.target);
        if (index < 0) return;
        if (event.key === 'F2') {
          event.preventDefault();
          openEditor(event.target);
          return;
        }
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        const previousKey = horizontalYears.matches ? 'ArrowLeft' : 'ArrowUp';
        const nextKey = horizontalYears.matches ? 'ArrowRight' : 'ArrowDown';
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? years.length - 1
          : event.key === previousKey ? Math.max(0, index - 1)
          : event.key === nextKey ? Math.min(years.length - 1, index + 1) : -1;
        if (next < 0) return;
        event.preventDefault();
        pauseReveal();
        years[next].link.focus({ preventScroll: true });
        revealYear(years[next], true);
      });
      document.addEventListener('pointerdown', event => {
        if (!form.hidden && !yearNavigation.contains(event.target)) closeEditor(false);
      });
      yearNavigation.addEventListener('focusout', event => {
        if (!form.hidden && event.relatedTarget && !yearNavigation.contains(event.relatedTarget)) closeEditor(false);
      });
      years.forEach(({ link }) => {
        link.title = 'Click to jump; double-click or press F2 to enter a year';
        link.setAttribute('aria-keyshortcuts', 'F2');
        link.setAttribute('aria-controls', form.id);
        link.draggable = false;
      });
      yearNavigation.addEventListener('dblclick', event => {
        if (form.contains(event.target) || editButton.contains(event.target)) return;
        event.preventDefault();
        openEditor(event.target.closest('a'));
      });
      yearNavigation.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (!link || !yearList.contains(link) || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
        if (event.detail === 0) {
          cancelPendingClick();
          revealPausedUntil = 0;
          jumpToYear(years.find(year => year.link === link));
          return;
        }
        event.preventDefault();
        cancelPendingClick();
        if (Date.now() < suppressClickUntil || !form.hidden) return;
        // A short pointer-only delay keeps the bar still for double-click/tap.
        if (event.detail > 1) return;
        pendingClick = window.setTimeout(() => {
          pendingClick = 0;
          revealPausedUntil = 0;
          link.click();
        }, 400);
      });
      yearList.addEventListener('pointerdown', event => {
        pauseReveal();
        cancelPendingClick();
        if (!event.isPrimary || event.button !== 0) return;
        drag = { id: event.pointerId, type: event.pointerType, x: event.clientX, y: event.clientY,
          left: yearList.scrollLeft, top: yearList.scrollTop, moved: false, captured: false };
      });
      yearList.addEventListener('pointermove', event => {
        if (!drag || drag.id !== event.pointerId) return;
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        const distance = horizontalYears.matches ? dx : dy;
        if (Math.hypot(dx, dy) > 6) drag.moved = true;
        if (drag.type !== 'mouse' || !drag.moved) return;
        if (!drag.captured) {
          yearList.setPointerCapture(event.pointerId);
          drag.captured = true;
          yearList.classList.add('is-dragging');
        }
        event.preventDefault();
        if (horizontalYears.matches) yearList.scrollLeft = drag.left - distance;
        else yearList.scrollTop = drag.top - distance;
      });
      const endDrag = event => {
        if (!drag || drag.id !== event.pointerId) return;
        if (drag.moved) {
          suppressClickUntil = Date.now() + 500;
          lastTouch = null;
        } else if (drag.type === 'touch' && event.type === 'pointerup') {
          const link = event.target.closest('a');
          const now = Date.now();
          if (link && lastTouch?.link === link && now - lastTouch.time < 400) {
            suppressClickUntil = now + 500;
            lastTouch = null;
            openEditor(link);
          } else lastTouch = { link, time: now };
        }
        if (drag.captured && yearList.hasPointerCapture(drag.id)) yearList.releasePointerCapture(drag.id);
        drag = null;
        yearList.classList.remove('is-dragging');
      };
      window.addEventListener('pointerup', endDrag);
      window.addEventListener('pointercancel', endDrag);
      window.addEventListener('blur', () => {
        cancelPendingClick();
        if (drag?.captured && yearList.hasPointerCapture(drag.id)) yearList.releasePointerCapture(drag.id);
        drag = null;
        lastTouch = null;
        yearList.classList.remove('is-dragging');
      });
      yearList.addEventListener('lostpointercapture', () => { drag = null; yearList.classList.remove('is-dragging'); });
      yearNavigation.addEventListener('wheel', event => {
        pauseReveal();
        if (!horizontalYears.matches || !form.hidden || event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
        const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? yearList.clientWidth : 1);
        const max = yearList.scrollWidth - yearList.clientWidth;
        if (max <= 0 || delta < 0 && yearList.scrollLeft <= 0 || delta > 0 && yearList.scrollLeft >= max - 1) return;
        event.preventDefault();
        yearList.scrollLeft += delta;
      }, { passive: false });
      revealYear = (year, force = false) => {
        if (!year || !force && (!form.hidden || drag || Date.now() < revealPausedUntil)) return;
        const area = yearList.getBoundingClientRect();
        const item = year.link.getBoundingClientRect();
        if (horizontalYears.matches) {
          yearList.scrollLeft += (item.left + item.right - area.left - area.right) / 2;
        } else {
          yearList.scrollTop += (item.top + item.bottom - area.top - area.bottom) / 2;
        }
      };
      updateYearDock = () => {
        if (horizontalYears.matches) {
          const bounds = yearNavigation.getBoundingClientRect();
          const contentBounds = (publicationList || yearNavigation).getBoundingClientRect();
          const center = (contentBounds.left + contentBounds.right) / 2;
          const listBounds = yearList.getBoundingClientRect();
          const activeBounds = (currentYear || years[0]).link.getBoundingClientRect();
          const anchor = horizontalWindowed ? listBounds.width / 2
            : activeBounds.left - listBounds.left + activeBounds.width / 2;
          yearNavigation.style.setProperty('--year-list-offset',
            `${center - bounds.left - anchor}px`);
        }
        if (window.scrollY <= 1) centeredDock = false;
        else if (window.scrollY > 28) centeredDock = true;
        const floating = !horizontalYears.matches && centeredDock;
        if (floating) {
          const bounds = yearNavigation.parentElement.getBoundingClientRect();
          const width = yearNavigation.offsetWidth;
          const headerBottom = headerInner?.getBoundingClientRect().bottom || 0;
          const navBounds = yearNavigation.getBoundingClientRect();
          const listBounds = yearList.getBoundingClientRect();
          const activeBounds = (currentYear || years[0]).link.getBoundingClientRect();
          const overflowing = yearList.scrollHeight > yearList.clientHeight + 1;
          // Short lists move as a whole, keeping every year visible without empty slots.
          // Overflowing lists keep a steady window while the active year scrolls inside it.
          const anchor = overflowing
            ? listBounds.top - navBounds.top + listBounds.height / 2
            : activeBounds.top - navBounds.top + activeBounds.height / 2;
          const readingCenter = (headerBottom + window.innerHeight) / 2;
          const top = Math.max(headerBottom + 12, Math.min(readingCenter - anchor,
            window.innerHeight - yearNavigation.offsetHeight - 12));
          yearNavigation.style.setProperty('--year-dock-left', `${bounds.right - width}px`);
          yearNavigation.style.setProperty('--year-dock-top', `${top}px`);
        }
        yearNavigation.classList.toggle('is-floating', floating);
      };
      const measureYearWindow = () => {
        if (horizontalYears.matches) yearNavigation.classList.remove('is-floating');
        // Clear padding from the previous axis before measuring after a resize.
        yearList.style.setProperty('--year-center-space', '0px');
        const item = years[0].link.getBoundingClientRect();
        if (horizontalYears.matches) {
          // Center the current year on the paper column, independently of the edit button.
          const bounds = yearNavigation.getBoundingClientRect();
          const contentBounds = (publicationList || yearNavigation).getBoundingClientRect();
          const center = (contentBounds.left + contentBounds.right) / 2;
          const listGap = parseFloat(getComputedStyle(yearList).columnGap) || 0;
          const controlGap = parseFloat(getComputedStyle(yearNavigation).columnGap) || 0;
          const sideRoom = Math.min(center - bounds.left, bounds.right - center - editButton.offsetWidth - controlGap);
          const slots = Math.min(years.length, 5);
          const width = Math.min(slots * item.width + (slots - 1) * listGap, Math.max(item.width, sideRoom * 2));
          yearNavigation.style.setProperty('--year-list-width', `${width}px`);
          // A compact list may move into the column gap, but never over the profile.
          // Check both end years so changing the active year cannot change modes.
          const profileBounds = document.querySelector('.profile')?.getBoundingClientRect();
          const safeLeft = profileBounds && profileBounds.right < bounds.left
            ? Math.max(12, profileBounds.right + 2) : 12;
          const safeRight = document.documentElement.clientWidth - 12;
          const naturalWidth = years.length * item.width + (years.length - 1) * listGap;
          const canMoveWholeList = center - naturalWidth + item.width / 2 >= safeLeft
            && center - item.width / 2 + naturalWidth + editButton.offsetWidth + controlGap <= safeRight;
          horizontalWindowed = naturalWidth > width + 1 || !canMoveWholeList;
        }
        const size = horizontalYears.matches ? yearList.clientWidth : yearList.clientHeight;
        const itemSize = horizontalYears.matches ? item.width : item.height;
        // Only lists that can move safely as a whole omit the centering space.
        const needsCentering = horizontalYears.matches
          ? horizontalWindowed
          : yearList.scrollHeight > yearList.clientHeight + 1;
        const space = needsCentering ? Math.max(0, (size - itemSize) / 2) : 0;
        yearList.style.setProperty('--year-center-space', `${space}px`);
        updateYearDock();
        revealYear(currentYear);
      };
      if (typeof ResizeObserver !== 'undefined') {
        const windowObserver = new ResizeObserver(measureYearWindow);
        windowObserver.observe(yearList, { box: 'border-box' });
      }
      window.addEventListener('resize', measureYearWindow);
      window.addEventListener('pageshow', measureYearWindow);
      document.fonts?.ready.then(measureYearWindow);
      measureYearWindow();
      window.addEventListener('pagehide', cancelPendingClick);
    }

    updateYearNavigation();
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
