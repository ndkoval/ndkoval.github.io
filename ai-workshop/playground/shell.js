// The playground terminal. It sends typed commands to a step's browser backend,
// the same commands the CLI runs, and shows the results the way the slides do:
// each repository with its skills, numbered, and a number opens a skill. Output
// enters the page only as text; http(s) URLs become links. The web view next to
// it reads the same backend through `parent.skillAtlasBackend`.

export async function startShell({ createBrowserBackend, config }) {
  const scroll = document.getElementById('scroll');
  const form = document.getElementById('prompt');
  const input = document.getElementById('input');
  const history = [];
  let back = 0; // how far ArrowUp went into the history
  let listing; // the latest list of skills, which a number opens

  // Alt+1…6 opens another step, from the terminal or from the web view.
  const switchStep = (event) => {
    const digit = /^Digit([1-9])$/.exec(event.code)?.[1];
    const step = digit && event.altKey && !event.ctrlKey && !event.metaKey && config.steps[digit - 1];
    if (!step) return false;
    event.preventDefault();
    if (step !== config.stage) location.href = `../${step}/`;
    return true;
  };
  document.addEventListener('keydown', switchStep);
  window.playgroundKey = switchStep;

  let backend;
  try {
    const load = (name) => fetch(`../fixtures/${name}`).then((response) => response.json());
    const fixtures = await Promise.all(config.fixtures.map(load));
    const claude = config.claude ? await load('cluster-response.json') : undefined;
    backend = createBrowserBackend({ fixtures, claude });
  } catch (error) {
    scroll.append(h('pre', { class: 'output is-bad' }, `Cannot load the recordings: ${error.message}`));
    return;
  }
  window.skillAtlasBackend = backend;
  const web = document.getElementById('web');
  if (web) web.src = 'web/index.html';

  for (const command of config.commands) {
    const chip = h('button', { type: 'button' }, command.replace(/^skill-atlas /, ''));
    chip.title = command;
    chip.addEventListener('click', () => run(command));
    document.getElementById('try').append(chip);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    run(input.value);
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      back = Math.max(0, Math.min(history.length, back + (event.key === 'ArrowUp' ? 1 : -1)));
      input.value = back ? history[history.length - back] : '';
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      clear();
    }
  });
  input.value = config.commands[0];
  input.disabled = false;
  input.focus();

  async function run(line) {
    const command = line.trim();
    if (!command || input.disabled) return;
    history.push(command);
    back = 0;
    input.value = '';
    if (command === 'clear') return clear();
    // A number opens or closes that skill of the latest list; 0 closes them all.
    if (/^\d+$/.test(command) && listing) return listing.toggle(Number(command));
    const entry = h('div', { class: 'entry' }, h('p', { class: 'command' }, h('span', { class: 'dollar' }, '$ '), command));
    const output = h('div', { class: 'output is-running' }, 'Running…');
    entry.append(output);
    scroll.append(entry);
    reveal(entry);
    input.disabled = true;
    try {
      output.replaceChildren(...(await view(command, await backend.run(command))));
    } catch (error) {
      output.replaceChildren(text(`Unexpected error: ${error.message}`, 'is-bad'));
    } finally {
      output.classList.remove('is-running');
      input.disabled = false;
      input.focus();
    }
    reveal(entry);
  }

  /** What a command printed, as the slides show it. */
  async function view(command, printed) {
    const [name, ...rest] = command.replace(/^(\$\s*)?(skill-atlas\s+)?/, '').split(/\s+/);
    if (name === 'scan' || name === 'list') {
      const repositories = parseListing(printed);
      if (repositories) return listingView(repositories, printed);
    }
    if (name === 'show' && !/^(No skill|Usage|Cannot|Unknown)/.test(printed)) {
      const skills = await details(rest.join(' '), printed);
      if (skills.length) return skills.map(skillView);
    }
    if (name === 'cluster') {
      const map = parseMap(printed);
      if (map) return mapView(map);
    }
    return [text(printed, /^(Cannot|Unknown|No skill|Usage|Unexpected)/.test(printed) ? 'is-bad' : '')];
  }

  function listingView(repositories, printed) {
    const rows = [];
    const nodes = [];
    for (const repository of repositories) {
      nodes.push(
        h(
          'p',
          { class: 'cli-summary' },
          h('strong', {}, repository.id),
          h('span', {}, `${repository.total === undefined ? '' : `${repository.count} of `}${repository.total ?? repository.count} ${(repository.total ?? repository.count) === 1 ? 'skill' : 'skills'}`),
        ),
      );
      const list = h('ol', { class: 'cli-skills' });
      for (const skill of repository.skills) {
        const number = rows.length + 1;
        const description = h('span', { class: 'cli-description' }, skill.summary);
        const toggle = h(
          'button',
          { type: 'button', class: 'cli-toggle', 'aria-expanded': 'false' },
          h('kbd', { class: 'cli-key' }, String(number)),
          h('span', { class: 'cli-chevron', 'aria-hidden': 'true' }, '›'),
          h('strong', { class: 'cli-name' }, skill.name),
          description,
        );
        const row = h('li', { class: 'cli-skill' }, toggle);
        if (skill.url) row.append(link(skill.url, 'SKILL.md ↗', 'cli-link'));
        toggle.addEventListener('click', () => open(number));
        list.append(row);
        rows.push({ skill, repository, row, toggle, description });
      }
      nodes.push(list);
    }
    const errors = printed.split('\n').filter((line) => /^(Cannot|Unknown|Usage)/.test(line));
    if (errors.length) nodes.push(text(errors.join('\n'), 'is-bad'));
    if (rows.length) nodes.push(h('p', { class: 'cli-hint' }, 'Type a number to open a skill, 0 to close all.'));

    async function open(number) {
      const target = rows[number - 1];
      if (!target) return;
      const expanded = target.toggle.getAttribute('aria-expanded') !== 'true';
      target.toggle.setAttribute('aria-expanded', String(expanded));
      target.row.classList.toggle('is-open', expanded);
      target.description.textContent = expanded ? await fullDescription(target) : target.skill.summary;
      if (expanded) target.row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    listing = {
      toggle(number) {
        if (number === 0) {
          for (const target of rows) {
            target.toggle.setAttribute('aria-expanded', 'false');
            target.row.classList.remove('is-open');
            target.description.textContent = target.skill.summary;
          }
        } else open(number);
      },
    };
    return nodes;
  }

  /** The whole description: from the web view's data, or from `show` in step 01. */
  async function fullDescription({ skill, repository }) {
    if (skill.full) return skill.full;
    if (backend.skills) {
      const { skills } = await backend.skills();
      const match = skills.find((other) => other.repository === repository.id && other.name === skill.name);
      skill.full = match?.description || skill.summary;
    } else {
      skill.full = parseShow(await backend.run(`show ${skill.name}`)).description || skill.summary;
    }
    return skill.full;
  }

  /** Every skill `show` printed: from the backend's data, or parsed in step 01, which has one repository. */
  async function details(query, printed) {
    if (!backend.skill) return [parseShow(printed)];
    const { skills } = await backend.skills();
    const found = await Promise.all(
      skills.filter((skill) => skill.name === query || skill.id === query).map((skill) => backend.skill(skill.id)),
    );
    return found.filter(Boolean).map((skill) => ({
      name: skill.name,
      description: skill.description,
      rows: [
        ['id', skill.id],
        ['repository', skill.repository],
        ['link', skill.link],
        ['commit', skill.commit],
        ...(skill.copies || []).map((copy) => ['copy', copy]),
        ...Object.entries(skill.properties || {}).map(([key, value]) => [key, typeof value === 'string' ? value : JSON.stringify(value)]),
      ].filter(([, value]) => value),
      body: skill.body || '',
    }));
  }

  function skillView(skill) {
    const rows = h('dl', { class: 'cli-details' });
    for (const [key, value] of skill.rows)
      rows.append(h('dt', {}, key), h('dd', {}, ...(/^https?:\/\//.test(value) ? [link(value, value)] : [value])));
    const nodes = [h('p', { class: 'cli-title' }, h('strong', { class: 'cli-name' }, skill.name)), h('p', { class: 'cli-text' }, skill.description), rows];
    if (skill.body) {
      const body = h('details', { class: 'cli-body' }, h('summary', {}, 'SKILL.md'), text(skill.body));
      nodes.push(body);
    }
    return h('div', { class: 'cli-skill-details' }, ...nodes);
  }

  function mapView(map) {
    const nodes = [h('p', { class: 'cli-summary' }, h('strong', {}, map.title), h('span', {}, map.count))];
    for (const cluster of map.clusters)
      nodes.push(
        h(
          'div',
          { class: 'cli-cluster' },
          h('p', { class: 'cli-title' }, h('strong', {}, cluster.name)),
          h('p', { class: 'cli-text' }, cluster.reason),
          h('p', { class: 'cli-chips' }, ...cluster.skills.map((skill) => h('span', {}, skill))),
        ),
      );
    nodes.push(h('p', { class: 'cli-hint' }, 'The web view shows the same map: open Map.'));
    return nodes;
  }

  function clear() {
    scroll.querySelectorAll('.entry').forEach((entry) => entry.remove());
    listing = undefined;
  }

  function reveal(entry) {
    scroll.scrollTop = entry.offsetTop - scroll.offsetTop - 12;
  }
}

/** `owner/repo · N skills`, or `N of M skills` when filtered, then each skill with its first sentence, link and copies. */
function parseListing(printed) {
  const repositories = [];
  for (const line of printed.split('\n')) {
    const head = /^(\S+) · (\d+)(?: of (\d+))? skills?$/.exec(line);
    if (head) {
      repositories.push({ id: head[1], count: Number(head[2]), total: head[3] === undefined ? undefined : Number(head[3]), skills: [] });
      continue;
    }
    const repository = repositories.at(-1);
    const last = repository?.skills.at(-1);
    if (!repository) continue;
    if (last && /^\s+https?:\/\/\S+$/.test(line)) last.url = line.trim();
    else if (last && /^\s+also in /.test(line)) last.copies = line.trim();
    else {
      const skill = /^([\w.-]+)(?: — (.*))?$/.exec(line);
      if (skill) repository.skills.push({ name: skill[1], summary: skill[2] || 'No description' });
    }
  }
  return repositories.length ? repositories : undefined;
}

/** One skill as `show` prints it: name, description, then `key  value` rows. */
function parseShow(printed) {
  const [name = '', description = '', ...rest] = printed.split('\n');
  const rows = rest.map((line) => /^\s{2}(\S+)\s{2,}(.+)$/.exec(line)).filter(Boolean).map((row) => [row[1], row[2]]);
  return { name, description, rows, body: '' };
}

/** `N clusters · …`, then each cluster: `Name — reason` and its skills. */
function parseMap(printed) {
  const [head, ...blocks] = printed.split(/\n{2,}/);
  const summary = /^(\d+ clusters?) · (.+)$/.exec(head);
  if (!summary) return undefined;
  const clusters = blocks.map((block) => {
    const [title, skills = ''] = block.split('\n');
    const [name, reason = ''] = title.split(' — ');
    return { name, reason, skills: skills.trim().split(/,\s+/).filter(Boolean) };
  });
  return { title: summary[1], count: summary[2], clusters };
}

/** Text with its http(s) URLs as links; everything else stays text. */
function text(value, tone = '') {
  return h(
    'pre',
    { class: `output-text ${tone}`.trim() },
    ...value.split(/(https?:\/\/[^\s<>"']+)/g).map((part, index) => (index % 2 ? link(part, part) : document.createTextNode(part))),
  );
}

function link(href, label, className) {
  return h('a', { href, target: '_blank', rel: 'noopener noreferrer', ...(className ? { class: className } : {}) }, label);
}

function h(tag, attributes, ...children) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  element.append(...children);
  return element;
}
