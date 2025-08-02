# Local Development Guide for ndkoval.github.io

This guide provides instructions for setting up and running this Jekyll-based website on your local machine.

## Prerequisites

- Ruby (version 2.5.0 or higher)
- RubyGems
- Bundler

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/ndkoval/ndkoval.github.io.git
   cd ndkoval.github.io
   ```

2. Install dependencies:
   ```
   bundle install
   ```

3. Make sure the theme is enabled for local build:
   In `_config.yml`, uncomment the line:
   ```
   theme: minimal-mistakes-jekyll
   ```
   (This line should be around line 27 in the file)

4. Build and serve the website:
   ```
   bundle exec jekyll serve
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:4000
   ```

## Troubleshooting

- If you encounter gem version conflicts, make sure to use `bundle exec` before any Jekyll commands.
- If you make changes to `_config.yml`, you'll need to restart the Jekyll server for changes to take effect.
- For more detailed Jekyll documentation, visit [Jekyll's official site](https://jekyllrb.com/docs/).

## Notes

- The site uses the Minimal Mistakes theme.
- When deploying to GitHub Pages, the theme configuration will be handled automatically by the remote_theme setting.