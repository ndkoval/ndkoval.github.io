// A small Markdown renderer for SKILL.md bodies. They come from other people's
// repositories, so every piece of text is escaped, raw HTML shows as text, and
// only http(s) URLs become links.

const FENCE = /^(\s*)(`{3,}|~{3,})/;
const HEADING = /^(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/;
const RULE = /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/;
const ITEM = /^\s*([-*+]|\d{1,9}[.)])\s+(.*)$/;
const QUOTE = /^\s{0,3}>\s?/;
const TABLE = /^\s*\|/;
const INLINE = /(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)|\[([^\]]*)\]\(\s*<?((?:[^\s()<>]|\([^\s()<>]*\))+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;
const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Markdown as HTML that is safe to put into the page. */
export function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) i++;
    else if (FENCE.test(line)) i = code(lines, i, blocks);
    else if (HEADING.test(line)) i = heading(lines, i, blocks);
    else if (RULE.test(line)) i = rule(i, blocks);
    else if (ITEM.test(line)) i = list(lines, i, blocks);
    else if (QUOTE.test(line)) i = quote(lines, i, blocks);
    else if (TABLE.test(line)) i = table(lines, i, blocks);
    else i = paragraph(lines, i, blocks);
  }
  return blocks.join('\n');
}

// Each block reader appends its HTML and returns the index of the line after it.

function code(lines, start, blocks) {
  const [, indent, fence] = FENCE.exec(lines[start]);
  const close = new RegExp(`^\\s*${fence[0]}{${fence.length},}\\s*$`);
  const outdent = new RegExp(`^ {0,${indent.length}}`);
  const text = [];
  let i = start + 1;
  while (i < lines.length && !close.test(lines[i])) text.push(lines[i++].replace(outdent, ''));
  blocks.push(`<pre><code>${escape(text.join('\n'))}</code></pre>`);
  return i + 1;
}

function heading(lines, start, blocks) {
  const [, hashes, text] = HEADING.exec(lines[start]);
  blocks.push(`<h${hashes.length}>${inline(text)}</h${hashes.length}>`);
  return start + 1;
}

function rule(start, blocks) {
  blocks.push('<hr>');
  return start + 1;
}

/** A list, with nested lists and fenced code by indentation. */
function list(lines, start, blocks) {
  const indent = leading(lines[start]);
  const ordered = isOrdered(lines[start]);
  const items = [];
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    const item = ITEM.exec(line);
    const deeper = leading(line) > indent;
    if (item && leading(line) === indent && isOrdered(line) === ordered) {
      items.push({ text: [item[2]], children: [] });
      i++;
    } else if (item && deeper) {
      i = list(lines, i, items.at(-1).children);
    } else if (!item && deeper && FENCE.test(line)) {
      i = code(lines, i, items.at(-1).children);
    } else if (!item && deeper && line.trim()) {
      items.at(-1).text.push(line.trim());
      i++;
    } else if (!line.trim() && continues(lines, i, indent)) {
      i++;
    } else {
      break;
    }
  }
  const tag = ordered ? 'ol' : 'ul';
  const html = items.map((item) => `<li>${inline(item.text.join(' '))}${item.children.join('')}</li>`);
  blocks.push(`<${tag}>${html.join('')}</${tag}>`);
  return i;
}

function isOrdered(line) {
  return /\d/.test(ITEM.exec(line)[1]);
}

/** Whether a list goes on after the blank lines at `i`. */
function continues(lines, i, indent) {
  while (i < lines.length && !lines[i].trim()) i++;
  if (i === lines.length) return false;
  return ITEM.test(lines[i]) ? leading(lines[i]) >= indent : leading(lines[i]) > indent;
}

function quote(lines, start, blocks) {
  const text = [];
  let i = start;
  while (i < lines.length && QUOTE.test(lines[i])) text.push(lines[i++].replace(QUOTE, ''));
  blocks.push(`<blockquote>${renderMarkdown(text.join('\n'))}</blockquote>`);
  return i;
}

/** A table keeps its text layout: shown as it is, in monospace. */
function table(lines, start, blocks) {
  const rows = [];
  let i = start;
  while (i < lines.length && TABLE.test(lines[i])) rows.push(lines[i++].trim());
  blocks.push(`<pre class="table">${escape(rows.join('\n'))}</pre>`);
  return i;
}

function paragraph(lines, start, blocks) {
  const text = [];
  let i = start;
  while (i < lines.length && lines[i].trim() && !startsBlock(lines[i])) text.push(lines[i++].trim());
  blocks.push(`<p>${inline(text.join(' '))}</p>`);
  return i;
}

function startsBlock(line) {
  return [FENCE, HEADING, RULE, ITEM, QUOTE, TABLE].some((pattern) => pattern.test(line));
}

/** Code spans, links and emphasis; everything else is escaped text. */
function inline(text) {
  let html = '';
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    html += emphasis(escape(text.slice(last, match.index)));
    html += match[1] ? `<code>${escape(match[2].trim())}</code>` : link(match[3], match[4]);
    last = match.index + match[0].length;
  }
  return html + emphasis(escape(text.slice(last)));
}

/** Only http(s) URLs become links; any other link shows just its text. */
function link(label, href) {
  const text = label ? inline(label) : escape(href);
  const url = httpUrl(href);
  return url ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${text}</a>` : text;
}

function httpUrl(href) {
  try {
    const url = new URL(href);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** Bold and italics, over text that is already escaped. */
function emphasis(html) {
  return html
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\W)__(?=\S)([\s\S]*?\S)__(?!\w)/g, '$1<strong>$2</strong>')
    .replace(/(^|[^\w*])\*(?=[^\s*])([\s\S]*?[^\s*])\*(?![\w*])/g, '$1<em>$2</em>')
    .replace(/(^|\W)_(?=[^\s_])([\s\S]*?[^\s_])_(?!\w)/g, '$1<em>$2</em>');
}

function leading(line) {
  return /^\s*/.exec(line)[0].replace(/\t/g, '    ').length;
}

function escape(text) {
  return text.replace(/[&<>"']/g, (char) => ENTITIES[char]);
}
