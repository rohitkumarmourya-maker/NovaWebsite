---
name: Nova Ventures Graphite & Ember
description: Industrial editorial design with warm paper, graphite surfaces and amber accents.
colors:
  primary: "#1B2632"
  secondary: "#F7F4ED"
  accent: "#F5A425"
  accentText: "#B45309"
  text: "#3B372C"
typography:
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.618
  heading:
    fontFamily: Manrope
    fontSize: 42px
    fontWeight: 600
    lineHeight: 1.12
spacing:
  sm: 16px
  md: 24px
  lg: 48px
  section: 80px
rounded:
  md: 16px
  lg: 24px
  full: 9999px
components:
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
  section:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.text}"
  eyebrow:
    textColor: "{colors.accentText}"
  ctaBand:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.primary}"
---

## Overview
Visual thesis: graphite steel and warm paper frame practical engineering imagery with restrained ember accents.
Keep the existing identity and editorial rhythm. The site serves business partners and job applicants.

## Colors
Use graphite for structure, paper and sand for alternating sections, and ember for actions. Use the darker accentText token for text on light surfaces.

## Typography
Use self-hosted Manrope for headings and Inter for body text. Preserve the responsive sizes in tailwind.config.js. Careers copy uses standard hyphens, not em dashes.

## Layout
Content plan: a corporate vision hero, company introduction, one business showcase, capabilities and innovation, then careers and contact. About owns the interactive explorer and leadership. Applications have a dedicated route.
Vertical order: Manufacturing, IT, HEMM, Healthcare Products, Skill Development, Civil & Construction.
Business images always share a 3:2 frame with object-cover. Keep text columns readable and controls at least 44px tall.

## Elevation & Depth
Retain soft shadows for actionable cards. Use borders and section spacing for editorial material.

## Shapes
Rounded photographs and pill actions continue the original identity. Leadership uses 4:3 portrait frames.

## Components
Interaction thesis: retain the existing page entrance, scroll reveals and responsive business explorer transitions. All motion respects reduced-motion preferences.
Forms use persistent field errors, a dismissible live toast, locked controls while sending and a durable success reference. Never report dry-run mail as delivered.

## Do's and Don'ts
Do keep data separate from presentation. Do label unfinished leadership profiles and keep unverified case studies in draft. Do not imply that illustrative imagery documents a Nova facility.
