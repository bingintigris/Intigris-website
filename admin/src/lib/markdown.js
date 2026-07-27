// Tiny, dependency-free Markdown -> HTML renderer.
// Supports: #/##/### headings, ** bold **, * italic *, [text](url),
// - / • bullet lists, 1. ordered lists, --- rules, and paragraphs.
// Input is HTML-escaped first, so it's safe to render with dangerouslySetInnerHTML.

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function renderMarkdown(md = '') {
  const lines = escapeHtml(md).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let list = null; // 'ul' | 'ol'
  let para = [];

  const flushPara = () => {
    if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; }
  };
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flushPara(); closeList(); continue; }

    let m;
    if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
      flushPara(); closeList();
      const level = Math.min(m[1].length, 6);
      out.push(`<h${level}>${inline(m[2])}</h${level}>`);
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { flushPara(); closeList(); out.push('<hr/>'); continue; }
    if ((m = line.match(/^\s*[-•]\s+(.*)$/))) {
      flushPara();
      if (list !== 'ul') { closeList(); list = 'ul'; out.push('<ul>'); }
      out.push(`<li>${inline(m[1])}</li>`);
      continue;
    }
    if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      flushPara();
      if (list !== 'ol') { closeList(); list = 'ol'; out.push('<ol>'); }
      out.push(`<li>${inline(m[1])}</li>`);
      continue;
    }
    // plain text -> accumulate into a paragraph
    closeList();
    para.push(line.trim());
  }
  flushPara(); closeList();
  return out.join('\n');
}

export function slugify(s = '') {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function estimateReadMinutes(md = '') {
  const words = md.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 200));
}
