source "https://rubygems.org"

# Jekyll static-site generator.
# Run the site locally with: bundle exec jekyll serve
gem "jekyll", "~> 4.4"

# Theme (pinned via the gem so local and CI builds are reproducible).
gem "minimal-mistakes-jekyll", "~> 4.28"

# Plugins. These are auto-loaded by Jekyll because they live in the
# :jekyll_plugins group; the active set is also listed in _config.yml.
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-include-cache"
  gem "jekyll-archives"
  gem "jekyll-paginate"
  gem "jekyll-sitemap"
  gem "jemoji"

  # Local admin UI (http://localhost:4000/admin). Not used by the build.
  gem "jekyll-admin"
end

# Retry middleware for Faraday v2, used by octokit (pulled in via the theme's
# jekyll-gist dependency). Avoids a startup notice and enables request retries.
gem "faraday-retry"

# Windows and JRuby do not ship zoneinfo files, so bundle the data gem there.
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Boot Jekyll's built-in development server.
gem "webrick"
