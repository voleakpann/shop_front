# MiniStore — Next.js + Tailwind

A minimal ecommerce store template built from the *MiniStore* Figma design,
implemented with **Next.js (App Router)** and **Tailwind CSS**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Pages

| Route | Screen |
| --- | --- |
| `/` | Home (hero, features, product rows, sale banner, latest posts, testimonial) |
| `/shop` | Shop grid with sidebar filters + pagination |
| `/product/[slug]` | Product detail (gallery, color/size, quantity, tabs, related) |
| `/about` | About Us (story, video block, testimonial) |
| `/cart` | Cart (editable quantities, totals) |
| `/contact` | Contact info + form + map |
| `/blog` | Blog list with sidebar |
| `/blog/[slug]` | Blog detail (article, comments, related posts) |

## Project structure

```
app/                 # App Router pages + layout + globals.css
components/           # Navbar, Footer, ProductCard, ShopSidebar, ... (reusable UI)
lib/data.ts           # Mock products / posts / cart data
tailwind.config.ts    # Brand colors (teal accent, ink, band, charcoal ...) & Jost font
```

## Design tokens

Pulled from the Figma design and centralized in `tailwind.config.ts`:

- `brand` `#35b6c9` — teal accent (prices, links, primary buttons)
- `ink` `#1e1e1e` — near-black text / dark buttons
- `band` `#eef1f4` — light page-header band
- `charcoal` `#2b2b2b` — dark "Subscribe" band
- Font: **Jost** via `next/font/google`

## Images

The source Figma file is a view-only Community template, so product photos
could not be exported through the MCP connector. All imagery currently renders
through the `<Ph>` placeholder component (`components/Ph.tsx`), which shows a
tasteful grey box with a glyph.

To drop in real photos, add files under `public/` and set the `image` field in
`lib/data.ts` (e.g. `image: "/products/pink-watch.jpg"`). `<Ph>` automatically
switches to a real `next/image` whenever a `src` is provided — no other changes
needed. To get pixel-exact assets/spacing from Figma, duplicate the Community
file into your own account and re-share the editable URL.
