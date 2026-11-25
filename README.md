# devopsporto.github.io

Source for the [DevOps Porto](https://devopsporto.com) community website. Built with Jekyll and served by GitHub Pages.

## Local development

Requires Ruby and Bundler.

    bundle install
    bundle exec jekyll serve

The site is then available at http://localhost:4000. Jekyll rebuilds on save, so edits show up on refresh.

## Checking the build

Build once and check the output for broken links and images:

    bundle exec jekyll build
    bundle exec htmlproofer ./_site --only-4xx --check-favicon --check-html

## Adding a meetup

Each meetup is a YAML file in `_data/events/`, named by its number (e.g. `92.yml`). Copy `_data/events/template.yml` and fill it in. The Meetups page builds itself from these files.

Venues live in `_data/hosts/`. If a meetup is at a new venue, add a host file there first and reference its key from the event's `host` field.

## Layout

- `_data/events/` — one file per meetup
- `_data/hosts/` — venue details (logo, link, map)
- `_includes/components/` — reusable pieces for events, speakers and hosts
- `_layouts/default.html` — the page shell
- `index.md`, `meetups.html`, `team.html`, `callforspeakers.html`, `codeofconduct.html` — the pages
