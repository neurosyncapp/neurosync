// Designed empty state. Used wherever the registry has no rows yet so a
// first-time visitor sees intent and a next step, never a blank panel.
const ICONS = {
  explore: '<circle cx="24" cy="24" r="16"/><path d="M24 14v20M14 24h20" stroke-linecap="round"/>',
  trophy: '<path d="M16 12h16v6a8 8 0 01-16 0v-6z"/><path d="M16 15h-4a3 3 0 003 5M32 15h4a3 3 0 01-3 5" stroke-linecap="round"/><path d="M24 26v6M18 36h12M21 32h6" stroke-linecap="round"/>',
  activity: '<path d="M8 24h8l4-12 6 24 4-12h10" stroke-linecap="round" stroke-linejoin="round"/>',
};

export function emptyState({ icon = 'explore', title, text, ctaLabel, ctaHref }) {
  return `
    <div class="fade-in" style="display:flex; flex-direction:column; align-items:center; text-align:center; padding:72px 24px;">
      <div style="position:relative; margin-bottom:22px;">
        <div style="position:absolute; inset:-18px; background:radial-gradient(circle, rgba(139,92,246,0.18), transparent 70%);"></div>
        <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="#a78bfa" stroke-width="1.6" style="position:relative;">${ICONS[icon] || ICONS.explore}</svg>
      </div>
      <h3 style="font-size:18px; font-weight:600; color:#e4e4e7; margin-bottom:8px;">${title}</h3>
      <p class="muted" style="font-size:14px; max-width:360px; line-height:1.6; margin-bottom:${ctaLabel ? '22px' : '0'};">${text}</p>
      ${ctaLabel ? `<a href="${ctaHref}" data-link class="btn btn-primary" style="padding:11px 22px;">${ctaLabel}</a>` : ''}
    </div>`;
}
