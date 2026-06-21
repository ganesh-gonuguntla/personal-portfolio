# Ganesh Gonuguntla — Portfolio

A redesigned personal portfolio. Design concept: **"Blueprint & Graphite"** — the precision of an engineer's blueprint paired with the warmth of a hand-drawn sketchbook, reflecting the dual identity of CS developer + pencil-sketch artist.

## Structure

```
portfolio/
├── index.html        → all page content/markup
├── css/style.css      → design system (colors, type, layout, animation)
├── js/script.js       → intro sequence, cursor, audio, nav, scroll reveal
├── profile.jpeg        → hero portrait
├── art1.jpeg, art2.jpeg, art3.jpeg → sketchbook gallery
└── README.md
```

## How to view it

Just open `index.html` in any modern browser — no build step, no server required.

To host it (GitHub Pages, Netlify, Vercel, etc.), upload the whole folder as-is; all paths are relative.

## What's new

- **Opening sequence** — your name fills the screen split across the horizontal equator. After a beat, the top half lifts away and the bottom half drops away, like a notebook opening down the middle, revealing the site underneath.
- **A synthesized welcome chime** plays the moment the page opens (no audio file needed — it's generated in the browser). There's a mute toggle in the top-right of the nav. If a browser blocks autoplay audio, the chime fires on the visitor's first click/scroll/key press instead.
- **Light "blueprint" backdrop** — a faint engineering grid sits behind everything, with two soft ambient glows that drift gently with the cursor.
- **The cursor motion is untouched** — same dot + lazy-following ring mechanic as before, just recolored for the light background.
- **Sketchbook section** — your pencil art is now presented as pinned, slightly rotated photographs with a washi-tape strip, like pages tacked to a board.
- **Fully responsive** — a proper slide-in mobile menu appears below 960px (your original simply hid the nav with no replacement); layouts adapt cleanly across phone, tablet, and desktop.
- **Reduced-motion support** — visitors with `prefers-reduced-motion` enabled get a much shorter, calmer intro.

All your original content — projects, skills, certifications, contact links — is unchanged.
