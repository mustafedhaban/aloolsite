# Alool — section-by-section review
Date: 14 September 2026

## Result
The supplied HTML prototype is now the homepage layout authority. Its nine sections retain their individual grids, large typography, outer spacing, image proportions, light/dark changes, and woven motif. Interior routes extend that design system; the prototype itself does not contain separate interior-page designs.

The original Next.js / React / TypeScript / Tailwind / npm stack remains unchanged. No application dependencies were added.

## Corrections made
- Removed three competing layers of layout overrides and the Arial Narrow font override.
- Fixed a nested two-column grid that squeezed the problem heading and six workflow blocks.
- Restored the prototype's full-width system diagram, capability rows, five-stage method, project composition, and woven grid.
- Restored the green homepage contact section.
- Aligned the header container with the page grid.
- Corrected light-background system-diagram contrast.
- Fixed tablet orbit-label overflow and phone/tablet legal-page overflow.
- Fixed mobile project images collapsing to zero height.
- Added case-page links to all work and the next illustrative concept.
- Corrected mobile-menu focus, focus trapping, Escape handling, and route-change closure.
- Disabled transitions entirely for reduced-motion users.
- Kept portfolio concepts explicitly illustrative and the local-only form status visible.

## Verification
- Production build, TypeScript, lint, and whitespace checks passed.
- 21 content routes rendered at 1440, 1024, 768, and 390 pixels: 84 route/width captures.
- Route checks verify HTTP status, one H1, horizontal overflow, image loading and nonzero image height, and browser console/runtime errors.
- All 21 discovered internal destinations returned HTTP 200.
- Keyboard skip link, mobile menu focus loop, Escape, menu route changes, and next-case navigation were exercised.
- Contact validation and local success state were exercised without transmitting information.
- Dark/light header changes were checked with normal motion.
- Homepage content was checked with JavaScript disabled and without animation.
- Desktop outer padding matches the supplied prototype in all nine homepage sections. Content-dependent height differences remain for revised copy, illustrative labels, added navigation, and form fields.
- Browser coverage: Chromium. This is not a formal WCAG certification or a Safari/Firefox certification.

## Architecture and changed areas
- app/globals.css: prototype-derived homepage system.
- app/interior.css: shared defaults and interior route layouts.
- app/page.tsx: nine homepage sections.
- app/layout.tsx: stylesheet integration.
- components/Header.tsx and Footer.tsx: shared navigation and footer.
- components/Blocks.tsx: services, systems, projects, case navigation, and proof notice.
- components/Weave.tsx: original woven-grid geometry.
- components/ContactForm.tsx: preview disclosure.
- app/about/how-we-work/page.tsx: approved five-stage method.
- app/work/[slug]/page.tsx: case navigation and concept labeling.
- lib/content.ts remains the shared service, industry, and project data source.
- work/visual-qa.cjs and .design/alool-site/screenshots/: repeatable local QA and evidence.

## Run and preview
From /Users/dhaban/Desktop/poc/aloolsite:
- Development: npm run dev
- Checks: npm run lint
- Production build: npm run build
- Production preview: npm run start -- --port 4173

Production preview was left running at http://localhost:4173. The user's existing development server was not stopped. Nothing was deployed or committed.

## Still required before public launch
- Approved contact destination/backend; the current form only validates locally.
- Approved client evidence, real project assets, and permission to publish. Current work is conceptual, not proof of delivery.
- Approved privacy and terms text.
- Confirmation of the production domain used in metadata, sitemap, and structured data.
- Insights remains intentionally empty until real articles are approved.
- Cross-browser and assistive-technology checks beyond this Chromium pass.
