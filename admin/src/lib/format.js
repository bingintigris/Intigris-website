export function timeAgo(dateish) {
  const d = new Date(dateish);
  if (isNaN(d)) return '';
  const secs = Math.round((Date.now() - d.getTime()) / 1000);
  const table = [
    ['year', 31536000], ['month', 2592000], ['week', 604800],
    ['day', 86400], ['hour', 3600], ['minute', 60],
  ];
  for (const [unit, span] of table) {
    const val = Math.floor(secs / span);
    if (val >= 1) return `${val} ${unit}${val > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export function formatDate(dateish) {
  const d = new Date(dateish);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('') || '?';
}
