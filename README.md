# RoboSoc Website

The official website for **RoboSoc (EXRS)**, the Robotics Society at the University of Exeter.

Built with [Astro](https://astro.build/), plain CSS, and zero frameworks. Designed to be readable and contributable by any CS student.

## Local development

Prerequisites: [Node.js 20+](https://nodejs.org/)

```bash
git clone https://github.com/Exeter-Robotics/robosoc-website.git
cd robosoc-website
npm install
npm run dev
```

The dev server starts at `http://localhost:4321/robosoc-website/`.

To build for production:

```bash
npm run build
npm run preview
```

The build output goes to `dist/`.

## Editing content

All site content lives in JSON files under `src/data/`. No database, no CMS.

### Add a team member

Edit `src/data/team.json`. Add an entry:

```json
{
  "name": "Your Name",
  "role": "Your Role",
  "bio": "Short bio goes here.",
  "image": "/images/team/yourname.jpg",
  "socials": {
    "github": "https://github.com/yourhandle",
    "linkedin": "https://linkedin.com/in/yourhandle"
  }
}
```

Place the photo in `public/images/team/`. If no image is provided, initials are shown as a placeholder.

### Add an event

Edit `src/data/events.json`:

```json
{
  "id": 3,
  "title": "Event Title",
  "date": "2026-06-15T18:00:00Z",
  "location": "Building, Campus",
  "coords": null,
  "tag": "workshop",
  "short": "One-line summary.",
  "description": "Full description for the detail page.",
  "image": "/images/events/event-slug.jpg",
  "signupUrl": "https://..."
}
```

Events with dates in the future appear under "Upcoming". Past dates appear under "Past events".

### Add a project

Edit `src/data/projects.json`:

```json
{
  "slug": "project-slug",
  "name": "Project Name",
  "category": "Hardware",
  "short": "One-line summary.",
  "description": "Full description.",
  "tags": ["ROS 2", "Python"],
  "image": "/images/projects/project-slug.jpg",
  "links": { "github": "https://github.com/..." },
  "featured": false,
  "contributors": ["Name One", "Name Two"]
}
```

Set `"featured": true` to show the project on the home page. Valid categories: Hardware, Software, Research, Competition.

## Customizing the palette

All colors are defined as CSS custom properties in `src/styles/global.css`:

```css
:root {
  --navy-deep:    #1a2332;   /* background */
  --navy:         #2e4057;   /* cards */
  --navy-light:   #3d536e;   /* borders, hover */
  --orange:       #e8742c;   /* accent */
  --orange-hover: #d4641e;   /* hover state */
  --text-strong:  #f5f2ec;   /* headings */
  --text-mid:     #c9c4ba;   /* body text */
  --text-dim:     #8a8578;   /* subtle text */
}
```

Change these values and the entire site updates.

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

To set up deployment for the first time:

1. Push the repo to GitHub
2. Go to Settings > Pages
3. Set source to "GitHub Actions"
4. Push to `main` and the workflow runs

The site will be available at `https://exeter-robotics.github.io/robosoc-website/`.

If a custom domain is added later, remove `base: '/robosoc-website'` from `astro.config.mjs` and update `site` to the custom domain.

## Project structure

```
src/
  pages/         File-based routing (.astro files become URLs)
  layouts/       BaseLayout wraps every page (TopBar + Footer)
  components/    Reusable UI pieces (TopBar, Footer, cards, etc.)
  data/          JSON content (team, events, projects)
  styles/        global.css with CSS custom properties
  scripts/       Vanilla JS (particle animation, typewriter)
public/
  fonts/         Self-hosted JetBrains Mono + Inter
  images/        Team photos, event images, project images
```

## Adding a new page

1. Create a new `.astro` file in `src/pages/` (e.g., `src/pages/sponsors.astro`)
2. Import and wrap with `BaseLayout`
3. Add a nav link in `src/components/TopBar.astro` and `src/components/Footer.astro`

## Constraints

- No em dashes in any copy
- No TypeScript
- No Tailwind or CSS-in-JS
- No CMS or database
- All images need alt text
- Keep components small and readable
