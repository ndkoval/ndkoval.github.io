# Running the Website Locally

This is a [Jekyll](https://jekyllrb.com/) site (Jekyll 4, Minimal Mistakes theme).

## Prerequisites
- Ruby 3.1+ and RubyGems
- Bundler (`gem install bundler`)

## Steps

1. **Install dependencies**
   ```bash
   bundle install
   ```

2. **Run the server**
   ```bash
   bundle exec jekyll serve
   ```

3. **Open** <http://localhost:4000>

The theme is pinned via the `minimal-mistakes-jekyll` gem in the `Gemfile`, so no
manual `_config.yml` changes are needed before building.

## Notes
- Always use `bundle exec` so the locked gem versions are used.
- Restart the server after editing `_config.yml`.
- Port in use? `bundle exec jekyll serve --port 4001`.
- Deployment is automated via GitHub Actions (`.github/workflows/jekyll.yml`) on
  every push to `master`. See `README.md` for details.
