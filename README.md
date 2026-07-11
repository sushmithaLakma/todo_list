# yet to-do

A fun, glanceable to-do list browser extension (Chrome MV3), styled after the
Umi reference collage: warm paper background, cream/lime/sky-blue cards,
serif italic headline accents, and bold black pill controls.

## Load it

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select this folder
4. Click the toolbar icon to open the popup

## Design system (extracted from the reference)

**Color**
- `--color-bg` `#faf8f1` warm paper background
- `--color-surface-cream` `#f1ecdd` default card
- `--color-surface-blue` `#cfe8f6` activity card
- `--color-surface-lime` `#dcf454` goal / accent card
- `--color-surface-dark` `#17170f` ink pills (icon buttons, checked state)
- `--color-ink` `#17170f`, `--color-muted` `#918d7c` for eyebrow/meta text

**Type**
- Display: italic serif (Georgia) for the headline, with the emphasis word
  underlined in a lime highlight — mirrors the "healthy habits" treatment.
- UI: system sans, bold uppercase 10px eyebrow labels with wide tracking
  (category tags), 14.5px semibold titles, 11.5px meta text.

**Shape**
- Cards: 18px radius, soft two-layer shadow, 1px hairline border.
- Controls: fully pill/circular (tabs underline, chips, checkboxes, add
  button) — no square buttons anywhere, matching the reference's rounded,
  playful geometry.

**Layout**
- Header → serif tagline → progress chip/bar → pill tab filters (All /
  Goals / Activities / Tasks) → scrollable card list with a "Done today"
  section → pill composer bar fixed at the bottom.

Illustrations from the reference were intentionally skipped; the system is
carried entirely by color, type, and shape.
