// The web view: the scanned repository's skills with a filter, and a SKILL.md
// viewer with the skills most like it. Text from SKILL.md files enters the page
// only as text nodes, or through the Markdown renderer, which escapes it.
import { skill as loadSkill, skills as loadSkills, subscribe } from './api.js';
import { renderMarkdown } from './markdown.js';

const repository = document.getElementById('repository');
const filter = document.getElementById('filter');
const list = document.getElementById('skills');
const viewer = document.getElementById('viewer');
let atlas = { repository: null, skills: [] };
let selected; // the id of the open skill

filter.addEventListener('input', render);
list.addEventListener('keydown', moveSelection);
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
  render();
}

/** The skills that have every word of the filter in their name or description, as `skill-atlas list <words>` shows them. */
function render() {
  const words = filter.value.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = atlas.skills.filter((skill) =>
    words.every((word) => `${skill.name} ${skill.description}`.toLowerCase().includes(word)),
  );
  const total = count(atlas.skills.length);
  repository.replaceChildren(
    ...(atlas.repository
      ? [
          h('span', { class: 'repository-name' }, atlas.repository.id),
          h('span', { class: 'count' }, words.length ? `${shown.length} of ${total}` : total),
        ]
      : []),
  );
  list.replaceChildren(...shown.map((skill) => h('li', {}, skillButton(skill))));
  if (atlas.skills.length && shown.length === 0) list.append(h('li', { class: 'empty' }, `No skills match “${filter.value.trim()}”.`));
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
    h('div', { class: 'file' }, h('span', { class: 'file-name' }, 'SKILL.md'), h('span', { class: 'file-path' }, skill.path), githubLink(skill.link)),
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
 * The skills with the most similar SKILL.md files, as chips with their scores as whole
 * percentages, as `similar` prints them; a chip opens its skill.
 */
function similar(skill) {
  const chips = skill.similar.map((other) => {
    const button = h(
      'button',
      { type: 'button', class: 'similar-skill' },
      other.name,
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

/** Only http(s) links; a local skill has a file:// URL and no link. */
function githubLink(url) {
  if (!/^https?:\/\//.test(url)) return null;
  return h('a', { class: 'open', href: url, target: '_blank', rel: 'noopener noreferrer' }, 'Open on GitHub ↗');
}

/** Arrow keys, Home and End move through the list and open the skill. */
function moveSelection(event) {
  const buttons = [...list.querySelectorAll('.skill')];
  const index = buttons.indexOf(document.activeElement);
  const next = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: buttons.length - 1 }[event.key];
  if (index < 0 || next === undefined || !buttons[next]) return;
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

function count(n) {
  return `${n} ${n === 1 ? 'skill' : 'skills'}`;
}

/** An element with attributes and children; strings become text, never HTML. */
function h(tag, attributes, ...children) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  element.append(...children.filter((child) => child !== null));
  return element;
}
