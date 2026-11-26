# devopsporto.github.io

Source for the [DevOps Porto](https://devopsporto.com) community website. Built with Jekyll and served by GitHub Pages.

## Local development

Requires Ruby and Bundler.

    bundle install
    bundle exec jekyll serve

The site is then available at http://localhost:4000. Jekyll rebuilds on save, so edits show up on refresh.

## Checking the build

Build the site and check the output for broken links and images with
[html-proofer](https://github.com/gjtorikian/html-proofer) (installed separately,
so it stays out of the site's bundle):

    bundle exec jekyll build
    gem install html-proofer
    htmlproofer ./_site --only-4xx --check-favicon --check-html

## Adding a meetup

Each meetup is a YAML file in `_data/events/`, named by its number (e.g. `92.yml`). The Meetups page builds itself from these files, newest first. Copy the annotated example at [`_templates/event.yml`](_templates/event.yml) and fill it in.

Notes:

- Agenda item types: `intro`, `talk`, `break`, `openspace`, `qa`, `networking`, `wrapup`.
- `type: online` renders "Meetup Online #N" and takes no `host`; put the recording in a top-level `youtube:` field (shown as a Video in the left column). A `youtube:` field works on any event.
- `type: bootcamp` renders a plain title with no "Meetup #" (used for the Global DevOps Bootcamps).
- Co-hosts / partners: add `partners: [key, ...]` referencing files in `_data/partners/`.
- Quote a YAML value only when it needs it — i.e. it contains a colon or is empty.

Venues live in `_data/hosts/` and partners in `_data/partners/`. Both take `key`, `name`, `link` and `logo`; hosts also take a `maplink` (a Google Maps embed URL). Add a file there and reference its key from the event.

## Layout

- `_data/events/` — one file per meetup (plus the bootcamps)
- `_data/hosts/` — venue details (logo, link, map)
- `_data/partners/` — co-host / partner details (logo, link)
- `_includes/components/` — reusable pieces for events, speakers, hosts and partners
- `_layouts/default.html` — the page shell
- `index.md`, `meetups.html`, `team.html`, `callforspeakers.html`, `codeofconduct.html` — the pages
