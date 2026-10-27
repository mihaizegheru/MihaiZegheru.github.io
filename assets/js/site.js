/* Progressive enhancements. Every page and link also works without JavaScript. */
(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  function syncTheme() {
    const dark = root.dataset.theme === 'dark';
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      toggle.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#14181d' : '#fafbfc');
  }
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (_) {}
      syncTheme();
    });
  }
  systemTheme.addEventListener('change', event => {
    let saved; try { saved = localStorage.getItem('portfolio-theme'); } catch (_) {}
    if (saved !== 'light' && saved !== 'dark') { root.dataset.theme = event.matches ? 'dark' : 'light'; syncTheme(); }
  });
  syncTheme();
  const filters = document.querySelector('[data-pr-filters]');
  if (filters) {
    filters.hidden = false;
    const buttons = filters.querySelectorAll('[data-filter]');
    const rows = document.querySelectorAll('[data-pr-status]');
    buttons.forEach(button => button.addEventListener('click', () => {
      const state = button.dataset.filter;
      let count = 0;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      rows.forEach(row => { row.hidden = state !== 'all' && row.dataset.prStatus !== state; if (!row.hidden) count++; });
      document.querySelectorAll('[data-pr-group]').forEach(group => {
        const groupRows = [...group.querySelectorAll('[data-pr-status]')];
        const shown = groupRows.filter(row => !row.hidden).length;
        group.hidden = shown === 0;
        group.querySelector('[data-group-count]').textContent = state === 'all' ? `${groupRows.length} pull requests` : `${shown} of ${groupRows.length} pull requests`;
      });
      filters.querySelector('[data-filter-result]').textContent = state === 'all' ? `Showing all ${count}` : `Showing ${count} ${state}`;
    }));
  }
})();
