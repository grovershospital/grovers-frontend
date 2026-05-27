/**
 * Grover's Hospital — brand tokens
 *
 * Merge the contents of `theme.extend` below into your existing
 * tailwind.config.{js,ts}. These map the colours and font pulled from the
 * Figma design so components can use semantic classes like `text-brand-green`
 * or `bg-brand-red` instead of arbitrary `text-[#0ba84a]` values.
 *
 * If you're on Tailwind v4 (CSS-first config), the equivalent @theme block is
 * shown at the bottom of this file.
 */

// ----- Tailwind v3 (tailwind.config.ts) -----
export const groversThemeExtend = {
    extend: {
        colors: {
            brand: {
                green: "#0ba84a", // primary brand / headings, primary buttons
                red: "#d62427", // emergency / "specialist" accent
                blue: "#317de2", // health-screening accent
                ink: "#0a0a0a", // near-black body text
            },
        },
        fontFamily: {
            // The design uses Inter throughout (weights 400/700/800/900).
            sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        },
        maxWidth: {
            // The Figma frame is 1024px wide; use this as the content container.
            content: '1120px',
        },
    },
};

/*
----- Tailwind v4 (in your CSS entry, e.g. index.css) -----

@theme {
  --color-brand-green: #0ba84a;
  --color-brand-red:   #d62427;
  --color-brand-blue:  #317de2;
  --color-brand-ink:   #0a0a0a;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

Also make sure Inter is loaded — either via @fontsource/inter (npm i @fontsource/inter
then `import "@fontsource/inter/400.css"` etc.) or a Google Fonts <link> in index.html:
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap" rel="stylesheet">
*/