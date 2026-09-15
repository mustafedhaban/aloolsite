# Alool Technologies Design System

## Reference

Brand source of truth: `BRAND/` — vector wordmark, favicon marks, and the `.ai` originals.
The site's section geometry derives from the approved agency prototype; the palette and
mark derive from `BRAND/`.

Note: `aloolweb/docs/brand/alool-brand-guidelines.html` (v1.0, 2026-07-17) describes a
different, earlier identity — black and orange with a square mark. It is superseded by
`BRAND/` and should not be used for this site.

## Direction

Premium agency/editorial composition expressed through restrained Swiss functionalism and a
warm, regionally grounded character. Use a strict grid, visible rules, purposeful accent,
large typography, deliberate light/dark transitions, and the Alool Weave or system orbit to
visualize connected systems.

## Color

Taken from the logo gradient endpoints and its neutral plate.

- Ink: `#121016`
- Off-white: `#F4F2F5`
- Paper: `#FAF9FB`
- Stone: `#D9D5DE`
- Muted: `#5A5560`
- Alool Purple: `#7703A7`
- Purple Lift: `#B15FE0` — full-strength purple goes muddy on ink; use this on dark surfaces
- Alool Orange: `#FF4B00`

### Application

The mark is purple arches punctuated by a single small orange square. The interface follows
the same ratio: **purple carries structure** — rules, orbit, weave bands, the contact field,
focus rings on light. **Orange is rare punctuation** — eyebrow rules, node dots, link hover
on ink. Never a large orange field, and never orange body copy.

Orange measures 3.36:1 on the off-white ground, which is below AA for normal text. It is
permitted only as a graphic element or on ink, where it reaches 5.63:1.

## Typography

Space Grotesk for display, Inter for body and UI, loaded through `next/font` as variable
fonts. Oversized, tight display type carries the hierarchy. Display tracking is tuned for
Space Grotesk's sidebearings — do not reuse tracking values from a system-sans fallback.

## Layout

Mobile-first four-column logic expanding to a 12-column desktop grid. Use editorial spacing,
thin structural borders, large media areas, modest radii, and minimal shadows. Interior pages
must share the same visual grammar as the homepage.

## Motion

Short opacity and transform reveals only, driven by GSAP + ScrollTrigger in
`components/Reveal.tsx`. No bounce, perpetual motion, scroll hijacking, pinning, scrubbing, or
cursor gimmicks. The hidden state is set from JavaScript, never CSS, so a failed script leaves
content visible. Reduced motion is handled by `gsap.matchMedia()`.

## Accessibility

Target WCAG 2.2 AA, full keyboard access, visible focus, semantic structure, sufficient
contrast, touch targets of at least 44 pixels, 200 percent zoom resilience, and reduced-motion
support. Focus rings recolour per surface: purple on light, Purple Lift on ink, white on the
purple field.
