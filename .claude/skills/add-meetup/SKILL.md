---
description: Add a new DevOps Porto meetup event file from a meetup.com URL. Use when the user wants to create a new meetup, schedule an event, or add a meetup entry.
disable-model-invocation: true
arguments: [url]
allowed-tools: Read Bash Write Edit WebFetch WebSearch
---

You are helping add a new meetup event to the DevOps Porto Jekyll site.

**Prerequisites:** `gh` (GitHub CLI) must be installed and authenticated. If it is not available, complete all steps up to the PR and tell the user to open it manually.

## Current repo state

Available hosts:
!`ls _data/hosts/ | sed 's/.yml//'`

Most recent meetup for reference:
!`cat _data/events/$(ls _data/events/*.yml | grep -E '/[0-9]+\.yml$' | sort -t/ -k3 -V | tail -1 | xargs basename)`

## Your task

Work through these steps in order.

### Step 1 — Fetch the meetup page

Fetch `$url` with WebFetch and extract:
- **Meetup number** — look for a pattern like "#89" or "Meetup 89" in the event title or description; this is the DevOps Porto sequential number used as the filename
- Event date → convert to YYYY-MM-DD
- Event title
- Venue / host name → match to the closest available host key above; if none match, flag it as a new venue and follow **Step 1b** before continuing
- Full agenda with timing — note every segment (opening/intro, talks, breaks, networking, Q&A, wrapup) and map them to the valid agenda types below
- Each talk: title, abstract (use source wording as closely as possible, including direct quotes), speaker name, speaker bio, speaker LinkedIn URL (meetup pages often link directly to speaker profiles — always extract these first before considering a search), speaker Twitter/X handle

### Step 1b — New venue (only if no host match was found)

Ask the user:
> "The venue **{venue name}** doesn't exist yet. Please provide a URL for their website so I can create the host file."

Once the user provides the URL:
1. Fetch it with WebFetch and extract the company display name, canonical website URL, and logo image URL (look for the logo in the header/navbar).
2. Download the logo with `curl -L -o "assets/images/hosts/{key}.{ext}" "{logo_url}"`. Derive the extension from the URL (svg, png, jpg). If the download fails, tell the user to add it manually to `assets/images/hosts/`.
3. WebSearch for `"{venue name}" Porto site:google.com/maps OR maps.google.com` to find the venue on Google Maps and convert the link to an embed URL (`https://www.google.com/maps/embed?pb=...`). If coordinates are found but no direct embed link, construct the embed URL from the coordinates. If not found at all, leave `maplink` blank — but warn the user that a blank `maplink` will cause a broken iframe on the homepage when this event becomes the latest meetup.
4. Derive a `key`: lowercase, hyphens for spaces, no special characters (e.g. "Bright Pixel" → `bright-pixel`).
5. Create `_data/hosts/{key}.yml`:

```yaml
key: {key}
name: {Full Display Name}
link: {website URL}
logo: {key}.{ext}
maplink: {google maps embed URL or blank}
```

### Step 2 — Enrich each speaker

For every speaker, run the following sub-steps in order, stopping as soon as you have enough data:

**2a. Check existing event files**
- Run `grep -ril "{speaker name}" _data/events/` to find any existing event that mentions this speaker.
- If found, read that file, extract the speaker's `name`, `image`, `twitter`, `linkedin`, and `bio`, reuse them as-is, and skip steps 2b–2d.

**2b. LinkedIn URL**
- If a LinkedIn URL was extracted from the meetup page in Step 1, use it directly and skip to 2c. Do not search.
- Otherwise, try up to three attempts (stop as soon as the user confirms a match):
  1. WebSearch for `"{speaker name}" site:linkedin.com/in` — present results (name, headline, URL) and ask the user to confirm.
  2. If no match, WebSearch for `"{speaker name}" "{company}" site:linkedin.com` — present results and ask again.
  3. If still no match, ask the user: "I couldn't find {speaker name}'s LinkedIn profile. Could you provide the URL?"
- If the user can't provide a URL either, skip LinkedIn enrichment and flag it.

**2c. LinkedIn profile**
- Fetch the confirmed LinkedIn URL with WebFetch.
- Extract headline, about/summary, and profile photo URL.
- Use the summary to write or improve the `bio`; use the headline to complement if useful.
- Only use what the LinkedIn profile itself contains — do not follow other links.

**2d. Speaker image**
- LinkedIn profile photos require authentication and cannot be downloaded automatically.
- Set the `image` field to `m{NUMBER}_{firstnamelastname}.jpg` (lowercase, no spaces or special characters).
- Tell the user: "Please visit {linkedin_url} to download the photo and save it as `assets/images/speakers/m{NUMBER}_{firstnamelastname}.jpg`."

### Step 3 — Write the event file

Create `_data/events/{NUMBER}.yml` using the schema below with all enriched data.

### Step 4 — Commit and open a draft PR

1. Create a new branch: `git checkout -b add-meeting-{NUMBER}`
2. Stage all new files: `git add -A`
3. Commit: `git commit -m "Meetup {NUMBER} @ {host display name}"`
4. Push: `git push -u origin add-meeting-{NUMBER}`
5. Open a draft PR:
   ```
   gh pr create --draft --title "Meetup {NUMBER} @ {host display name}" --body "$(cat <<'EOF'
   {$url}

   ---
   🤖 Automated with the `add-meetup` Claude Code skill.
   EOF
   )"
   ```

### Step 5 — Verify the preview

After the PR is open, check the PR comments for a Netlify deploy preview URL (`gh pr view {NUMBER} --comments`). Once found:

1. Fetch `/meetups.html` of the preview URL and verify:
   - Meetup #{NUMBER} appears in the correct year section
   - Talk title, abstract, speaker name, and bio are correct
   - The speaker image and host logo `src` attributes reference the expected filenames (note: WebFetch cannot verify whether images actually load — only that the paths are correct in the HTML)
2. Check the homepage map embed using Bash (WebFetch strips iframes and cannot see them):
   ```
   curl -s {preview_url} | grep -o 'iframe src="[^"]*"'
   ```
   Verify the `src` contains a Google Maps embed URL. A blank or missing `src` means `maplink` is empty and the homepage will show a broken map section.
3. Report any issues found to the user.

If the preview comment is not yet available, wait 30 seconds and retry (`gh pr view {NUMBER} --comments`) up to 3 times.

### Step 6 — Report to the user

- The PR URL
- Any issues found in the preview
- Any assets that still need to be added manually (speaker photos at `assets/images/speakers/`, host logos at `assets/images/hosts/`)

## YAML schema

```yaml
type: meetup
number: {N}
date: YYYY-MM-DD
host: {host-key}
title: ""  # leave empty to auto-join talk titles; set if the event has an explicit umbrella title
agenda:
  - type: intro
  - type: talk
    title: |
      Talk Title Here
    abstract: >
      Talk abstract here.
    speakers:
      - name: Speaker Name
        image: m{N}_{firstnamelastname}.jpg   # file goes in assets/images/speakers/
        twitter:                       # handle only, no @; leave blank if none
        linkedin:                      # full profile URL
        bio: >
          Speaker bio here.
    slides:
    youtube:
  - type: qa
  - type: wrapup
```

Valid agenda types: `intro`, `talk`, `break`, `openspace`, `qa`, `wrapup`, `networking`

## Rules

- Use the meetup number extracted from the page (e.g. "#89") as the filename, not an auto-incremented value.
- Use `type: meetup` unless the event is clearly something else (e.g. `bootcamp`).
- Use `>` (folded scalar) for abstract/bio; use `|` (literal) for talk titles that span multiple lines. Wrap all text at 80 characters.
- Leave any unknown or missing field as a blank value (e.g. `twitter:`) — never use null, never omit the key.
- Quote any string value that contains a colon (e.g. `title: "Foo: Bar"`).
- Bios should read as a short professional paragraph — do not copy raw LinkedIn bullet lists verbatim; synthesise them into prose.
- Never fabricate details. If something cannot be found after the steps above, leave it blank and flag it.
- Always create the PR in draft mode (`--draft`), with title `Meetup {NUMBER} @ {host display name}`, the meetup URL, and an automated note crediting the `add-meetup` skill in the body.
