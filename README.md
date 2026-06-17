# ndkoval.github.io

Source for [nikitakoval.org](https://nikitakoval.org) — a [Jekyll](https://jekyllrb.com/)
site built on the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme.

## Prerequisites

- Ruby 3.1+ (with RubyGems)
- Bundler (`gem install bundler`)

## Run locally

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Build and serve the site:
   ```bash
   bundle exec jekyll serve
   ```

3. Open <http://localhost:4000>.

The theme is pinned via the `minimal-mistakes-jekyll` gem (see `Gemfile`), so the
local build matches what is deployed — no extra configuration is required.

> Optional: an admin UI is available at <http://localhost:4000/admin> while the
> server is running (provided by the `jekyll-admin` plugin).

## Deployment

Pushing to `master` triggers the GitHub Actions workflow at
`.github/workflows/jekyll.yml`, which builds the site with this exact Gemfile
(Jekyll 4) and publishes it to GitHub Pages. The live site uses the custom
domain in `CNAME` (`nikitakoval.org`).

> One-time setup: in the repository **Settings → Pages**, set **Source** to
> **GitHub Actions**.

## Troubleshooting

- Always run Jekyll through Bundler (`bundle exec jekyll ...`) so the pinned gem
  versions are used.
- Changes to `_config.yml` require restarting the server to take effect.
- Port already in use? Serve on another port: `bundle exec jekyll serve --port 4001`.
