# BARNES Moscow — Design Audit

## Page

- URL: https://barn-estate.ru/
- Local clone: http://127.0.0.1:8888/
- Page: homepage.
- Last updated: 2026-10-05.
- Method: hydrated DOM, CSS/media-query inspection, computed styles, bounding boxes, Playwright screenshots, keyboard/pointer checks and source-page comparison.

## Audit Scope

Проведён полный проход страницы сверху вниз: DOM, landmarks, размеры, computed styles, containers, grid/flex, typography, colors, images, forms, buttons, links, responsive behavior, media queries, промежуточные widths, overflow, viewport height, focus, modal/menu/accordion/tab/slider states, SEO и accessibility semantics. Production-код не изменялся; обновлён только этот документ.

## Executive Summary

Визуальная система цельная: Tilda Sans, бело-графитовая база, бордовый CTA, крупные light-заголовки, media-first hero и повторяющиеся card/slider patterns.

Главный runtime-дефект локальной копии: при viewport 390px мобильное меню открывается, но не закрывается Escape и не содержит доступной кнопки закрытия внутри overlay. На source-странице Escape закрывает меню.

Найдено 19 открытых проблем: P1 — 1, P2 — 8, P3 — 8, P4 — 2. Предыдущие проблемы с hydration и локальными ассетами считаются FIXED отдельными commit и в открытые дефекты не включены.

## Page Structure

| № | Секция | Тип | Основные элементы | Контейнер | Фон |
|---:|---|---|---|---|---|
| 1 | Header | fixed/absolute | logo, nav, phone, menu, callback | base-container | transparent → white |
| 2 | Hero / filters | full-bleed media + form | video, tabs, filters, search, submit | full width + base | video + overlay |
| 3 | Services | section/cards | eyebrow, H2, description, 3 cards | base-container | white |
| 4 | По рекомендации BARNES | catalog slider | tabs, property cards, CTA, arrows | base-container | white |
| 5 | About company | editorial grid | H2, copy, statistics, expand | custom grid | white |
| 6 | Departments | category catalog | H2, 7 cards | inner container override | white |
| 7 | Projects | project slider | 2 slides, media, arrows | section container | image/media |
| 8 | Reviews | quote slider | eyebrow, H2, quote, author | base-container | white |
| 9 | Video | media block | native controls | base-container | white |
| 10 | Team | people slider | eyebrow, H2, 24 cards | inner container | white |
| 11 | Partners | logo marquee | eyebrow, H2, body, 56 logos | base-container | white |
| 12 | Office/contact | contact block | image, email, address, socials | two-column | white |
| 13 | News | card slider | eyebrow, H2, 10 cards, CTA | base-container | white |
| 14 | Newsletter CTA | form section | heading, email, submit | footer grid | #262626 |
| 15 | Footer | navigation/contact | logo, links, phone, legal | footer container | #262626 |
| 16 | Floating expert | fixed CTA/modal | card, close, dialog | viewport-fixed | card surface |

DOM note: review author metadata is a nested footer, creating an unnecessary extra footer landmark.

## DOM Inventory

Desktop 1440px after hydration: h1 = 0; images = 126; images without alt = 32; buttons = 36 (77 at 390px); links = 121 (111 at 390px); forms = 2 initially; inputs = 2 initially; videos = 2; tab-like controls = 12 desktop / 53 mobile; dialogs are created on interaction.

## Breakpoints

Фактические CSS boundaries: 540, 541, 560, 640, 768, 860, 900/901, 1024/1025, 1280, 1440, 1920/1921, plus prefers-reduced-motion.

| Breakpoint | Изменение | Проблема | Рекомендация |
|---:|---|---|---|
| 540/541 | service card 198px → 264px; services 945.78px → 1514.38px | page height jumps 568.59px | content height, aspect-ratio or clamp |
| 560 | mobile/tablet card/media rules | duplicate contract near 541 | one tablet token |
| 640 | small-mobile rules | no standalone contract | retain only with content rationale |
| 768 | tablet typography/grid/container | department/team gutter override | one container token |
| 860 | compact controls | collision zone | measured breakpoint |
| 900/901 | navigation/control variants | undocumented tiny split | document or remove |
| 1024/1025 | office grid/desktop rules | possible reflow jump | verify adjacent widths |
| 1280/1281 | nav hidden → flex; header 111px → 153px | abrupt 42px increase | available-space breakpoint |
| 1440 | wide spacing/type | literal values | desktop-wide token |
| 1920/1921 | container cap | expected content cap | preserve max-width 1920 |

Boundary checks completed: 539/540/541, 559/560/561, 639/640/641, 767/768/769, 859/860/861, 899/900/901, 1023/1024/1025, 1279/1280/1281, 1439/1440/1441, 1919/1920/1921.

## Responsive Matrix

All widths were rendered with hydrated DOM. No global horizontal overflow: documentElement.scrollWidth was never greater than innerWidth.

| Widths | Result |
|---|---|
| 320, 360, 375, 390, 414, 430, 480 | mobile one-column; hero 560px; no overflow |
| 576, 600, 640, 720 | tablet-small; service cards 264px; no overflow |
| 768, 800, 834 | tablet one-column services/departments; no overflow |
| 900, 960 | compact tablet; no overflow |
| 1024 | office two-column; no overflow |
| 1100, 1152, 1200, 1280 | compact desktop; nav hidden at 1280 |
| 1366, 1440 | desktop; nav visible at 1440; no overflow |
| 1536, 1600, 1728 | desktop-wide; no overflow |
| 1920, 2048, 2560 | 1920px content cap; no overflow |

Height checks: 1366×768, 1440×900, 1920×1080, 2560×1440, 390×844, 375×667, 430×932. Hero = 820px at 1366–1440, 960px at 1920–2560, 560px mobile. No strict 100vh hero. Fixed/floating controls do not use safe-area-inset variables.

## Containers

Actual base container: width 100%; max-width 1920px; margin-inline auto; padding 100px; at max-width 1920px: calc(-26.66667px + 6.59722vw); at max-width 768px: calc(8.94118px + 1.96078vw).

| Viewport | Container | Left/right padding |
|---:|---:|---:|
| 320 | 320 | 15.22 / 15.22 |
| 360 | 360 | 16.00 / 16.00 |
| 375 | 375 | 16.29 / 16.29 |
| 390 | 390 | 16.59 / 16.59 |
| 414 | 414 | 17.06 / 17.06 |
| 430 | 430 | 17.37 / 17.37 |
| 480 | 480 | 18.35 / 18.35 |
| 576 | 576 | 20.24 / 20.24 |
| 640 | 640 | 21.49 / 21.49 |
| 768 | 768 | 24.00 / 24.00 |
| 800 | 800 | 26.11 / 26.11 |
| 900 | 900 | 32.71 / 32.71 |
| 1024 | 1024 | 40.89 / 40.89 |
| 1152 | 1152 | 49.33 / 49.33 |
| 1280 | 1280 | 57.78 / 57.78 |
| 1440 | 1440 | 68.33 / 68.33 |
| 1600 | 1600 | 78.89 / 78.89 |
| 1728 | 1728 | 87.33 / 87.33 |
| 1920 | 1920 | 100 / 100 |
| 2048 | 1920 + 64 outer margin | 100 / 100 |
| 2560 | 1920 + 320 outer margin | 100 / 100 |

Departments/team override this system: 768px width 713px vs base content about 705px; 1024px width 969px vs base about 927.25px. Drift: 8px and 41.75px.

## Grid

| Component | 390px | 768px | 1024px | 1280–1440px | 1920px |
|---|---|---|---|---|---|
| Services | 1 col, rows 198px, gap 20px | 1 col, rows 264px | same | 2 cols, gap 20px, third spans | 2 cols, rows 352px |
| Departments | 1 col, 7 rows 220px, gap 12px | 1 col, rows 280px | same | 6 cols, gap 2px, 3 rows 340px | 6 cols, rows 399px |
| About | 1 col, 220px + 751.09px, gap 48px | 334px + 621.94px, gap 52px | same | 2 cols, gap 115.2–129.6px | gap 160px |
| Office/newsletter | stacked | stacked | 0.9fr 1.1fr, row 540px | same | same |
| Team/news | responsive slider | responsive slider | responsive slider | horizontal slider | horizontal slider |

CSS Grid is used for section layouts, Flexbox/slider tracks for repeated cards. Many contracts are media-specific literals rather than named minmax/auto-fit tokens.

## Typography

Font: Tilda Sans. Declared weights 300/400/500/600/700/800/900; observed roles mainly 300/400/500.

| Type | 390px | 768–1440px | 1920px | Weight | Color |
|---|---|---|---|---:|---|
| Services eyebrow | 16/16, tracking 2.24 | 13/13, 1.82 | same | 400 | rgba(30,30,30,.5) |
| Services title | 22/26.4 | 38/45.6 | 44/52.8 | 300 | #1E1E1E |
| Services description | 14/21 | 22/33 | 22/33 | 300 | #000000 |
| Barnes title | 22/22 | 38/38 | 44/44 | 300 | #1E1E1E |
| About title | 22/26.4, tracking -.77 | 44/43.12, -1.54 | same | 300 | #1D1D1B |
| About intro | 15/19.2 | 22/28.16 | same | 300 | #1E1E1E |
| Team title | 22/22 | 38/38 | 44/44 | 300 | #1E1E1E |
| News eyebrow | 12/12, 1.44 | 22/22, 2.64 | 24/24, 2.88 | 400 | #CACACA |
| UI button | 16/17.6 | 16/17.6 | 18/19.8 | 500 | white/dark |
| More link | 14/16.8, tracking 1.68 | same | same | 300 | #8B1D25 |
| Footer link | 11/11 | 16/16 | 18/18 | 300/400 | rgba(255,255,255,.8) |

Issues: no page H1; same eyebrow role is 12/13/16/22/24px; #CACACA News eyebrow fails contrast; footer links are 11px/11px mobile; heading steps are independent media literals.

## Spacing

| Section | 390px | 768px | 1024px | 1280px | 1440px | 1920px |
|---|---|---|---|---|---|---|
| Header | 69 | 111 | 111 | 111 | 153 | 155 |
| Hero | 560 | 820 | 820 | 820 | 820 | 960 |
| Services | 1035, padding 42/24 | 1370, 70/35 | 1304 | 1108 | 1108 | 1236, 80/40 |
| Barnes choice | 684, 35/35 | 973, 60/60 | 991 | 997 | 1043 | 1153, 75/75 |
| About | 1119, 50/50 | 1136, 64/38.4 | 1236, 81.92/51.2 | 963 | 917 | 951 |
| Departments | 1759, 35/35 | 2283, 60/60 | 2238 | 1230 | 1230 | 1454 |
| Project | 830 | 880 | 880 | 1073 | 1073 | 1103 |
| Reviews | 529 | 771 | 657 | 469 | 469 | 489 |
| Video | 310 | 442 | 551 | 661 | 729 | 950 |
| Team | 719 | 884 | 1057 | 566 | 566 | 614 |
| Partners | 476 | 658 | 658 | 658 | 658 | 758 |
| Office | 494 | 677 | 642 | 668 | 684 | 716 |
| News | 611 | 788 | 889 | 757 | 799 | 1001 |

Observed values include 12, 20, 24, 35, 50, 60, 64, 70, 72, 75, 80, 96, 100, 115.2, 132px; no documented spacing scale exists.

## Colors

| Role | Color | Usage / result |
|---|---|---|
| Primary text | #1E1E1E | headings/body, strong on white |
| Alternate dark | #1D1D1B | about title; unify unless intentional |
| Black | #000000 | service description |
| Dark surface | #262626 | footer/dark blocks |
| Brand red | #8B1D25 | CTA/links; about 9.13:1 on white |
| Gold | #E7C88F | brand accent |
| Secondary dark | #4F4D49 | muted text; about 8.43:1 |
| Secondary grey | #656462 | metadata/icons |
| Low grey | #7F7D7A | about 4.10:1 on white; fails normal AA |
| Very low grey | #CACACA | about 1.64:1 on white; fails normal AA |
| Surface | #F1F1F1 | cards/inputs |
| Borders | #E4E4E4, rgba(30,30,30,.12) | inputs/dividers |
| Overlay | rgba(0,0,0,.28) | media overlay |

## Buttons, Links and Cards

Primary hero submit: 390px = 341.84×58px, padding 10px 24px, radius 3px; tablet/desktop height 70px; 1920px = 241.45×70px, padding 0 47px. Filter fields: height 70px, padding 20px, radius 14px. Slider arrows: 48×48 mobile, 56×56 desktop, 68×68 wide. Footer callback: 293.84×50 mobile and 293.88×56 desktop. Text CTA: 14/16.8px, tracking 1.68px, red underline.

Default, disabled and keyboard focus were inspected. Hover transitions exist; no loading state is rendered. Most controls use outline: none without a visible focus-visible replacement. Slider arrow target is 48px mobile; menu/close controls need a guaranteed 44×44px parent.

Cards: 3 services, 15 recommendation cards desktop / 5 mobile rendered, 7 departments, 24 team, 56 partner logos, 10 news, 2 project slides. No crop/clipping overflow found. Slider families use separate spacing/control contracts.

## Images, Media and Forms

126 images desktop, 116 at 320–430px; 32 lack alt. Most are partner/logo SVGs or decorative office assets; classify each as informative alt or decorative alt empty.

Hero and content video are present. Hero uses preload auto; earlier mobile transfer measurement was approximately 9.77MB. Use poster, metadata preload or mobile-specific lazy strategy and define one below-fold loading policy.

Hero search is type search with placeholder “Поиск по ID, названию ЖК, адресу”. DOM contains an empty label, so the accessible name depends on placeholder. Add a real label tied to input. Newsletter has #newsletter-email and label “Ваш email”. Feedback modal opens with four inputs, consent and submit/close controls. Test invalid, valid, submitting, success and server-error states; trap and return focus in dialogs.

## Header, Navigation and Interactions

Header is transparent over hero and fixed white after scroll. Heights: 69px at 390px, 111px at 768–1280px, 153px at 1440px, 155px at 1920px. At 1280px nav is hidden; at 1281px it appears and header grows 42px. At 1440px nine items fit in one row, nav width about 1106.94px.

Mobile menu changes aria-label but lacks aria-expanded and aria-controls. Add both, visible close control, Escape handling, focus trap and focus return. About expand, feedback popup, hero filter and slider disabled/next states work in the inspected clone. Header scroll state is fixed white with shadow 0 4px 24px rgba(0,0,0,.08), z-index 200.

## Accessibility and SEO

Accessibility: missing H1; empty html lang; incomplete menu/tab relationships; invisible focus ring; unnamed hero search; 32 images without alt classification; extra footer landmark; contrast failures for #CACACA and #7F7D7A.

SEO: title is descriptive but long; description is present; lang empty; H1 absent; canonical absent locally; JSON-LD includes WebSite/WebPage/Organization/LocalBusiness/RealEstateAgent/ImageObject; local robots/sitemap return 404; production robots/sitemap use legacy barnes-moscow.com and sitemap contains a duplicate entry. Use barn-estate.ru consistently.

## Master Issue Table

| ID | Status | Viewport | Section / element | Current | Problem | Recommendation | Priority |
|---|---|---|---|---|---|---|---|
| UI-001 | OPEN | 390px | Mobile menu | Escape leaves overlay; no close button | cannot reliably close | close control, Escape, focus return, aria-expanded/controls | P1 |
| UI-002 | OPEN | all | Document / H1 | count 0 | no page heading | add semantic H1 | P2 |
| UI-003 | OPEN | all | Controls / focus | outline none | focus invisible | 2px focus-visible ring | P2 |
| UI-004 | OPEN | all | Hero search | empty label | name depends on placeholder | real bound label | P2 |
| UI-005 | OPEN | 540–541px | Services card | 198px → 264px; section +568.59px | discontinuous page height | aspect-ratio/content height/clamp | P2 |
| UI-006 | OPEN | 768/1024px | Departments/team | 713/969 vs base 705/927.25px | guide drift | remove gutter override | P2 |
| UI-007 | OPEN | all | Text colors | #CACACA 1.64:1; #7F7D7A 4.10:1 | fails AA | darker text tokens | P2 |
| UI-008 | OPEN | production | Robots/sitemap | legacy host; duplicate | split crawl signals | current host, remove duplicate | P2 |
| UI-009 | OPEN | mobile | Hero video | preload auto; ≈9.77MB earlier | high initial payload | poster/metadata/lazy strategy | P2 |
| UI-010 | OPEN | all | html | lang empty | language missing | set lang=ru | P3 |
| UI-011 | OPEN | all | SEO | canonical absent | duplicate URL risk | add canonical | P3 |
| UI-012 | OPEN | all | Images | 32/126 no alt | missing semantics | classify decorative/informative | P3 |
| UI-013 | OPEN | 390px | Footer | 11/11px links | readability/tap risk | 13/18px token and hit area | P3 |
| UI-014 | OPEN | all | Eyebrows | 12/13/16/22/24px | no shared role token | unify 12–14px | P3 |
| UI-015 | OPEN | all | Dark text | #1E1E1E/#1D1D1B/#000 | redundant roles | consolidate tokens | P3 |
| UI-016 | OPEN | all | Review author | nested footer | extra landmark | div/p citation wrapper | P3 |
| UI-017 | OPEN | mobile/tabs | ARIA | missing menu/tab relations | incomplete semantics | add relationships | P3 |
| UI-018 | OPEN | 1280–1281px | Header nav | hidden → flex; 111→153px | abrupt step | content-safe breakpoint | P4 |
| UI-019 | OPEN | local deploy | robots/sitemap | both 404 | not independently crawlable | add if deployment needs indexing | P4 |

## Recommended Design System

Typography: Tilda Sans, weights 300/400/500. Display clamp(48px, 5.4vw, 104px); H1 clamp(36px, 4.2vw, 84px); H2 clamp(22px, 2.65vw, 44px); body-large clamp(15px, 1.35vw, 22px)/1.5; body 16/1.4; small 13/1.4; eyebrow 12/1.15.

Colors: background #FFFFFF; surface #F1F1F1; text #1E1E1E; muted #656462; subtle #4F4D49; brand #8B1D25; accent #E7C88F; dark #262626; border #E4E4E4; overlay rgba(0,0,0,.28).

Spacing: 2, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 60, 64, 72, 80, 96, 100, 120, 128, 150px. Use named section-sm/md/lg tokens.

Containers: max 1920px; mobile 16–20px; tablet 24–41px; desktop 40–68px; wide 100px. Responsive contracts: ≤540 mobile, 541–1024 tablet, 1025–1280 compact desktop, 1281–1440 desktop, ≥1441 wide.

Components: buttons 58px mobile / 70px desktop; radius 3px CTA/input, 14px filter, 50% circles; icon hit area 44×44px minimum; arrows 48/56/68px; visible 2px focus ring; forms with explicit label, invalid, valid, loading, success, error and disabled states.

## Actionable Checklist

### P1

- [ ] Fix local mobile menu at 390px: close button, Escape, focus trap/return, aria-expanded and aria-controls.

### P2

- [ ] Add one page H1.
- [ ] Replace outline suppression with focus-visible ring.
- [ ] Add real hero-search label.
- [ ] Remove 540→541 fixed-height jump; retest 539/540/541/560/768.
- [ ] Remove departments/team gutter overrides; retest 768/1024.
- [ ] Replace low-contrast text colors with AA-safe tokens.
- [ ] Correct production robots/sitemap host and duplicate entry.
- [ ] Reduce hero mobile preload and measure LCP/CLS.

### P3/P4

- [ ] Set html lang=ru and add canonical.
- [ ] Classify 32 image alts.
- [ ] Raise mobile footer link typography.
- [ ] Unify eyebrow/dark-text tokens.
- [ ] Remove nested review footer landmark.
- [ ] Add menu/tab ARIA relationships.
- [ ] Test feedback/newsletter invalid, valid, submit, error and success states.
- [ ] Revisit 1280/1281 navigation breakpoint.
- [ ] Add local robots/sitemap only if clone is independently indexed.

## Verification Matrix for Follow-up

Rerun 320, 360, 375, 390, 414, 430, 480, 576, 600, 640, 720, 768, 800, 834, 900, 960, 1024, 1100, 1152, 1200, 1280, 1366, 1440, 1536, 1600, 1728, 1920, 2048, 2560px; boundaries 539/540/541 and 1279/1280/1281; all seven viewport-height pairs above.

## Audit History

### 2026-10-05

- Replaced the 2026-09-28 baseline with a full hydrated DOM/CSS/responsive audit.
- Added required widths 320–2560px, boundary checks, height checks and overflow verification.
- Added current component, container, grid, typography, color, button, form, media, SEO and accessibility measurements.
- Found 19 open issues: 1 P1, 8 P2, 8 P3, 2 P4.
- Confirmed previous hydration/asset-loading work as completed outside this audit.

### 2026-09-28

- Previous baseline audit superseded by this revision.
