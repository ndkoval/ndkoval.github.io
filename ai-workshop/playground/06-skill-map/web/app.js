// The web view: the skills of every scanned repository with a search, a SKILL.md
// viewer with the skills most like it, and the skill map. Text from SKILL.md files
// and from the model enters the page only as text nodes, or through the Markdown
// renderer, which escapes it.
import { map as loadMap, skill as loadSkill, skills as loadSkills, subscribe } from './api.js';
import { renderMarkdown } from './markdown.js';

const tabs = { skills: document.getElementById('skills-tab'), map: document.getElementById('map-tab') };
const views = { skills: document.getElementById('skills-view'), map: document.getElementById('map-view') };
const search = document.getElementById('search');
const summary = document.getElementById('summary');
const list = document.getElementById('skills');
const viewer = document.getElementById('viewer');
let atlas = { repositories: [], skills: [] };
let view = 'skills';
let selected; // the id of the open skill

tabs.skills.addEventListener('click', () => show('skills'));
tabs.map.addEventListener('click', () => show('map'));
search.addEventListener('input', render);
search.addEventListener('keydown', searchKeys);
list.addEventListener('keydown', listKeys);
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !event.target.closest('input, textarea')) {
    event.preventDefault();
    search.focus();
  }
});
window.addEventListener('hashchange', openLinked);
subscribe(refresh);
refresh();

async function refresh() {
  try {
    atlas = await loadSkills();
  } catch (error) {
    return problem(`Cannot load the skills: ${error.message}`);
  }
  if (!atlas.skills.some((skill) => skill.id === selected)) {
    selected = undefined;
    viewer.replaceChildren(
      h('p', { class: 'placeholder' }, atlas.skills.length ? 'Select a skill to read its SKILL.md.' : 'No skills yet. Scan a repository: skill-atlas scan <GitHub URL>'),
    );
  }
  if (view === 'map') await renderMap();
  else render();
  if (!selected) openLinked();
}

/** The skill named by the page's link, `#<id>`: it opens, or the viewer says it is not in the atlas. */
async function openLinked() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id || id === selected || !atlas.skills.length) return;
  if (view !== 'skills') await show('skills');
  if (atlas.skills.some((skill) => skill.id === id)) open(id);
  else problem('This link names a skill that is not in the atlas.');
}

async function show(next) {
  view = next;
  for (const name of ['skills', 'map']) {
    tabs[name].setAttribute('aria-pressed', String(name === next));
    views[name].hidden = name !== next;
  }
  search.closest('.search').hidden = next !== 'skills';
  if (next === 'map') await renderMap();
  else render();
}

/** The clusters as boxes of the same size; a chip opens its skill. */
async function renderMap() {
  let map;
  try {
    map = await loadMap();
  } catch (error) {
    return views.map.replaceChildren(h('p', { class: 'problem' }, `Cannot load the map: ${error.message}`));
  }
  const placed = map.clusters.reduce((sum, cluster) => sum + cluster.skills.length, 0);
  summary.textContent = `${count(map.clusters.length, 'cluster')} · ${placed} of ${count(atlas.skills.length, 'skill')}`;
  if (map.clusters.length === 0) {
    return views.map.replaceChildren(h('p', { class: 'placeholder' }, 'No map yet. Group the skills: skill-atlas cluster'));
  }
  views.map.replaceChildren(
    h(
      'ul',
      { class: 'clusters' },
      ...map.clusters.map((cluster) =>
        h(
          'li',
          { class: 'cluster' },
          h('h2', {}, cluster.name),
          h('p', {}, cluster.reason),
          h('ul', { class: 'chips', 'aria-label': `Skills in ${cluster.name}` }, ...cluster.skills.map((skill) => h('li', {}, chip(skill)))),
        ),
      ),
    ),
  );
}

function chip(skill) {
  const button = h('button', { type: 'button', class: 'chip', title: skill.repository }, skill.name);
  button.addEventListener('click', async () => {
    search.value = '';
    await show('skills');
    await open(skill.id);
    list.querySelector(`[data-id="${CSS.escape(skill.id)}"]`)?.scrollIntoView({ block: 'nearest' });
  });
  return button;
}

/**
 * The skills that have every word of the search in their name, description or repository,
 * as `skill-atlas list <words>` shows them, grouped by repository.
 */
function render() {
  const words = search.value.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = atlas.skills.filter((skill) =>
    words.every((word) => `${skill.name} ${skill.description} ${skill.repository}`.toLowerCase().includes(word)),
  );
  const total = count(atlas.skills.length, 'skill');
  summary.textContent = words.length
    ? `${shown.length} of ${total}`
    : `${count(atlas.repositories.length, 'repository', 'repositories')} · ${total}`;
  const groups = atlas.repositories
    .map((repository) => ({ repository, skills: shown.filter((skill) => skill.repository === repository.id) }))
    .filter((group) => group.skills.length > 0);
  list.replaceChildren(
    ...groups.map(({ repository, skills }) =>
      h(
        'section',
        { class: 'group', 'aria-label': repository.id },
        h('h2', { class: 'group-name' }, h('span', {}, ...ownerAndName(repository.id)), ' ', h('span', { class: 'group-count' }, String(skills.length))),
        h('ul', {}, ...skills.map((skill) => h('li', {}, skillButton(skill)))),
      ),
    ),
  );
  if (atlas.skills.length && shown.length === 0) list.append(h('p', { class: 'empty' }, `No skills match “${search.value.trim()}”.`));
}

function skillButton(skill) {
  const button = h(
    'button',
    { type: 'button', class: 'skill', 'data-id': skill.id, 'aria-current': String(skill.id === selected) },
    h('span', { class: 'skill-name' }, skill.name),
    h('span', { class: 'skill-description' }, skill.description || 'No description'),
  );
  button.addEventListener('click', () => open(skill.id));
  return button;
}

async function open(id) {
  selected = id;
  // The page's link names the open skill, so it can be shared; no history entry per skill.
  history.replaceState(null, '', `#${encodeURIComponent(id)}`);
  for (const button of list.querySelectorAll('.skill')) button.setAttribute('aria-current', String(button.dataset.id === id));
  let skill;
  try {
    skill = await loadSkill(id);
  } catch (error) {
    if (selected === id) problem(`Cannot load this skill: ${error.message}`);
    return;
  }
  if (selected !== id) return; // another skill was opened meanwhile
  if (!skill) return problem('This skill is no longer in the atlas.');
  viewer.replaceChildren(
    h(
      'div',
      { class: 'file' },
      h('span', { class: 'file-name' }, 'SKILL.md'),
      h('span', { class: 'file-path' }, `${skill.repository} / ${skill.path}`),
      copyLink(),
      githubLink(skill.link),
    ),
    properties(skill),
    similar(skill),
    markdown(skill.body),
  );
  viewer.scrollTop = 0;
}

/** The front matter as a card: values as rows, `true` flags as chips. */
function properties(skill) {
  const rows = [
    ['name', skill.name],
    ['description', skill.description || '—'],
  ];
  if (skill.copies.length) rows.push(['copies', skill.copies.join('\n'), 'path']);
  const flags = [];
  for (const [key, value] of Object.entries(skill.properties)) {
    if (value === true) flags.push(key);
    else rows.push([key, format(value)]);
  }
  return h(
    'section',
    { class: 'properties', 'aria-label': 'Front matter' },
    h('dl', {}, ...rows.flatMap(([key, value, style]) => [h('dt', {}, key), h('dd', style ? { class: style } : {}, value)])),
    flags.length ? h('ul', { class: 'flags' }, ...flags.map((flag) => h('li', {}, flag))) : null,
  );
}

/**
 * The skills with the most similar SKILL.md files, in any repository, as chips with
 * their scores as whole percentages, as `similar` prints them; a chip names the repository
 * when it is not this one, and opens its skill.
 */
function similar(skill) {
  const chips = skill.similar.map((other) => {
    const button = h(
      'button',
      { type: 'button', class: 'similar-skill', title: other.repository },
      other.name,
      other.repository === skill.repository ? null : h('span', { class: 'similar-repository' }, other.repository.split('/').at(-1)),
      h('span', { class: 'score' }, `${Math.round(other.score * 100)}%`),
    );
    button.addEventListener('click', async () => {
      await open(other.id);
      list.querySelector(`.skill[data-id="${CSS.escape(other.id)}"]`)?.scrollIntoView({ block: 'nearest' });
    });
    return h('li', {}, button);
  });
  return h(
    'section',
    { class: 'similar', 'aria-label': 'Similar skills' },
    h('span', { class: 'similar-label' }, 'Similar'),
    chips.length ? h('ul', {}, ...chips) : h('span', { class: 'similar-none' }, 'No other SKILL.md shares enough words'),
  );
}

function markdown(body) {
  const container = h('div', { class: 'markdown' });
  container.innerHTML = renderMarkdown(body); // escaped by the renderer
  return container;
}

/** Copies the page's link to this skill. */
function copyLink() {
  const button = h('button', { type: 'button', class: 'copy' }, 'Copy link');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Cannot copy';
    }
    setTimeout(() => (button.textContent = 'Copy link'), 1500);
  });
  return button;
}

/** Only http(s) links; a local skill has a file:// URL and no link. */
function githubLink(url) {
  if (!/^https?:\/\//.test(url)) return null;
  return h('a', { class: 'open', href: url, target: '_blank', rel: 'noopener noreferrer' }, 'Open on GitHub ↗');
}

/** Escape clears the search; the down arrow and Enter go to the results. */
function searchKeys(event) {
  const first = list.querySelector('.skill');
  if (event.key === 'Escape' && search.value) {
    search.value = '';
    render();
  } else if (event.key === 'ArrowDown' && first) {
    event.preventDefault();
    first.focus();
  } else if (event.key === 'Enter' && first) {
    first.click();
  }
}

/** Arrow keys, Home and End move through the results and open the skill; up from the top returns to the search. */
function listKeys(event) {
  const buttons = [...list.querySelectorAll('.skill')];
  const index = buttons.indexOf(document.activeElement);
  if (index < 0) return;
  if (event.key === 'ArrowUp' && index === 0) {
    event.preventDefault();
    return search.focus();
  }
  const next = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: buttons.length - 1 }[event.key];
  if (next === undefined || !buttons[next]) return;
  event.preventDefault();
  buttons[next].focus();
  buttons[next].click();
}

function problem(message) {
  viewer.replaceChildren(h('p', { class: 'problem' }, message));
}

function format(value) {
  if (Array.isArray(value)) return value.map(format).join(', ');
  return typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
}

function count(n, noun, plural = `${noun}s`) {
  return `${n} ${n === 1 ? noun : plural}`;
}

/** An element with attributes and children; strings become text, never HTML. */
/** A repository's owner and name, as `JetBrains/` in a span of its own and `MPS`. */
function ownerAndName(id) {
  const slash = id.lastIndexOf('/');
  return slash < 0 ? [id] : [h('span', { class: 'group-owner' }, id.slice(0, slash + 1)), id.slice(slash + 1)];
}

function h(tag, attributes, ...children) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  element.append(...children.filter((child) => child !== null));
  return element;
}
