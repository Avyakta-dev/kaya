---
name: Warm Tactile Neubrutalism
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#56423f'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#89726e'
  outline-variant: '#dcc0bc'
  surface-tint: '#9d4235'
  primary: '#9d4235'
  on-primary: '#ffffff'
  primary-container: '#ee8070'
  on-primary-container: '#681a12'
  inverse-primary: '#ffb4a8'
  secondary: '#894f3b'
  on-secondary: '#ffffff'
  secondary-container: '#feb198'
  on-secondary-container: '#79422e'
  tertiary: '#74584f'
  on-tertiary: '#ffffff'
  tertiary-container: '#b9988d'
  on-tertiary-container: '#483129'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#7e2b20'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59c'
  on-secondary-fixed: '#370e02'
  on-secondary-fixed-variant: '#6d3826'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#e3bfb3'
  on-tertiary-fixed: '#2a1710'
  on-tertiary-fixed-variant: '#5a4138'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  display:
    fontFamily: Nunito Sans
    fontSize: 38px
    fontWeight: '900'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Nunito Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 30px
  headline-sm:
    fontFamily: Nunito Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
  body-sm:
    fontFamily: Nunito Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-lg:
    fontFamily: Nunito Sans
    fontSize: 15px
    fontWeight: '800'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Nunito Sans
    fontSize: 13px
    fontWeight: '800'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Nunito Sans
    fontSize: 11px
    fontWeight: '900'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers a friendly, non-clinical aesthetic tailored for a personal wellness companion. By marrying the structural clarity of neubrutalism with ultra-soft geometry and warm flesh-toned hues, the interface removes medical anxiety and replaces it with approachable, grounding optimism. 

Key attributes:
- **Style Definition:** Soft Neubrutalism. Characterized by high-contrast ink-black structural borders and unblurred offset cast shadows, balanced strictly by deeply rounded contours and a gentle, skin-toned palette.
- **Tone:** Empathetic, supportive, conversational, and uplifting. It completely discards sterile clinical tropes (cold blues, sterile whites, hyper-minimalist thin rules) in favor of chunky, tactile, toy-like physical affordances.
- **Target Audience:** Modern women and menstruating individuals seeking an intuitive, non-judgmental daily companion for holistic wellness, cycle tracking, and symptom logging across diverse cultural and linguistic backgrounds.

## Colors

The palette utilizes pure flat fills with zero color blending, zero transparencies, and zero gradients. Every boundary is defined strictly by black structural framing.

- **Primary (`#EE8070` - Coral):** Used for primary conversion points, cycle wheels, hero actions, voice-entry surfaces, and active/selected states.
- **Secondary (`#F4A990` - Peach):** Deployed on secondary structural cards, interactive quick-log chips, and critical data markers.
- **Tertiary (`#F6D1C5` - Light Peach):** Serves as surface backgrounds for contextual cards, highlight containers, and grouped list bays.
- **Neutral / Structural (`#000000` - Solid Black):** Powers all 2.5px strokes, 4px unblurred hard shadows, and typography. No gray text is permitted; visual hierarchy is dictated by weight and scale rather than muted shades.
- **Base Canvas (`#FFFFFF` - Pure White):** The core canvas background, text inputs, and contrast utility panels.

## Typography

Typography prioritizes chunky, geometric, and ultra-friendly rounded letterforms. Nunito Sans anchors the hierarchy across Latin, Kannada, and Devanagari multi-script environments due to its warm terminals, high x-height, and robust multi-weight optical stability.

Rules for implementation:
- Avoid weights lighter than `600` (SemiBold) to ensure text maintains balanced contrast against 2.5px solid borders and bold shadow fills.
- All copy is rendered in full `#000000`. Hierarchy is controlled exclusively through sizing adjustments and shifts between `600`, `800`, and `900` font weights.
- Ensure Kannada and Devanagari script renders use equivalent bold/black weights with appropriate line-height expansion (1.3x to 1.4x body size) to accommodate complex conjuncts without clipping.

## Layout & Spacing

The layout is optimized for single-hand mobile usage via a 4-column fluid mobile grid anchored to a standard canvas margin.

- **Canvas & Gutters:** Base screen padding defaults to `1.25rem` (20px) on mobile viewports with an internal column gutter of `1rem` (16px).
- **Physical Rhythm:** Every interactive element with a shadow requires dedicated visual clearance. Components must be offset with sufficient margin (`space-md` or `space-lg`) to prevent hard drop shadows from colliding with adjacent element strokes.
- **Component Padding:** Generous internal padding ensures text does not crowd the heavy 2.5px borders. Minimum tap targets strictly adhere to 48px heights, padded vertically by `space-sm` and horizontally by `space-md` or `space-lg`.

## Elevation & Depth

This design system uses physical graphic projection rather than realistic lighting. It rejects soft, diffused ambient blurs in favor of crisp, directional offset planes.

- **Hard Shadow Specification:** 
  - Offsets: `4px` horizontal (X), `4px` vertical (Y).
  - Blur Radius: Strictly `0px`.
  - Spread: `0px`.
  - Color: `#000000` (100% opacity).
- **Stroke Layering:** Every floating element with an elevation shadow must also feature a `2.5px solid #000000` outline. The shadow is positioned directly beneath the fill and border, creating a tactile cutout effect.
- **Active / Pressed State:** On tap or press, the element translates down and to the right by `2px` or `4px` (`transform: translate(4px, 4px)`), while the drop shadow collapses to `0px 0px 0px #000000`. This provides an immediate, mechanical stamp-like feedback.
- **Layer Stacking (Flat Tiers):** For nested content inside a card, nested containers omit drop shadows and rely solely on contrasting background fills (`#FFFFFF`, `#F6D1C5`, or `#F4A990`) bound by the mandatory `2.5px` border.

## Shapes

The design system utilizes exaggerated, hyper-friendly curves to temper the aggressive structure of thick black borders.

- **Pill Geometry (`9999px`):** Fully rounded pill curves are mandatory for all interactive buttons, status badges, symptom chips, action sheets, and progress pills.
- **Card Geometry (`24px`):** Applied uniformly to all data modules, calendar blocks, bottom sheet headers, and conversational insight panels.
- **Form Controls (`16px` to `20px`):** Input containers and secondary selection frames feature slightly reduced rounding to provide sufficient text entry area while remaining cohesive with parent cards.
- **Inner Corner Harmony:** When components are nested inside a 24px card, inner child elements must use either a fully rounded pill form or scaled radii (12px to 16px) to avoid concentric corner distortion.

## Components

### Buttons
- **Primary Action (Coral):** Background `#EE8070`, outline `2.5px solid #000000`, shadow `4px 4px 0px #000000`, border-radius `9999px`. Label in bold `#000000`. Active state collapses shadow with a `translate(4px, 4px)`.
- **Secondary Action (Peach / White):** Background `#FFFFFF` or `#F4A990`, border `2.5px solid #000000`, shadow `4px 4px 0px #000000`, border-radius `9999px`.
- **Voice Action Button:** Circular button (`56px x 56px`), background `#EE8070`, border `2.5px solid #000000`, shadow `4px 4px 0px #000000`. Features high-contrast black microphone iconography.

### Chips & Quick-Log Pills
- **Resting State:** Background `#FFFFFF` or `#F6D1C5`, border `2.5px solid #000000`, shadow `2px 2px 0px #000000`, radius `9999px`, height `36px`.
- **Selected State:** Background `#EE8070`, shadow `0px 0px 0px #000000` (sunken/pressed profile), outline `2.5px solid #000000`. Font weight shifts to `800`.

### Cards & Modules
- **Standard Card:** Background `#F6D1C5` or `#FFFFFF`, border `2.5px solid #000000`, shadow `4px 4px 0px #000000`, corner radius `24px`, padding `1.25rem`.
- **Hero Cycle Ring Card:** Outer surface `#FFFFFF` with `2.5px solid #000000` border and `4px` drop shadow. Contains an oversized circular cycle diagram drawn with heavy black boundary strokes and filled with `#EE8070` (flow), `#F4A990` (fertile), and `#F6D1C5` (luteal).

### Form Inputs
- **Text Entry Fields:** Background `#FFFFFF`, border `2.5px solid #000000`, shadow `3px 3px 0px #000000`, corner radius `16px`. Active focus shifts border fill without softening; no blue or glow rings are permitted. Placeholder text rendered in solid `#000000` with 50% opacity or italicized styling.

### Checkboxes & Radios
- **Checkboxes:** Base square (`24px x 24px`), border `2.5px solid #000000`, border-radius `8px`, shadow `2px 2px 0px #000000`. Unchecked: `#FFFFFF`. Checked: `#EE8070` background with a thick black checkmark glyph.
- **Radio Buttons:** Outer circle (`24px x 24px`), border `2.5px solid #000000`, shadow `2px 2px 0px #000000`. Selected: `#FFFFFF` base with a centered solid black inner disc (`10px`).

### Lists & Navigation Bars
- **List Items:** Individual pill or card items floating over `#FFFFFF` canvas, separated by `space-sm` gaps, each holding independent `2.5px` borders and `2px` or `4px` offset shadows.
- **Bottom Navigation Dock:** Fixed floating pill bar, background `#FFFFFF`, border `2.5px solid #000000`, shadow `0px -4px 0px #000000` or anchored floating container with `4px 4px 0px #000000` shadow. Active tab indicators use an `#EE8070` filled pill background.