// src/components/home/TrustBar.tsx
//
// Infinite auto-scrolling logo strip ("marquee").
//
// How the seamless loop works: we render the SAME list of logos TWICE, back to
// back, inside a flex track. The track animates from translateX(0) to
// translateX(-50%) — i.e. it scrolls left by exactly one full copy's width.
// At -50% the second copy sits precisely where the first started, so when the
// animation resets to 0 it's visually identical = no jump. The keyframes live
// in index.css (see note at the bottom of this file).
//
// Export each partner logo from Figma into src/assets/logos/ and list them below.
// Keeping them as separate <img>s (rather than one wide strip image) means they
// stay crisp and you can add/remove partners without re-exporting everything.

const LOGOS = [
    { src: "morgan.png", alt: "Morgan Holdings" },
    { src: "firstbank.png", alt: "FirstBank" },
    { src: "kpmg.png", alt: "KPMG" },
    { src: "seplat.png", alt: "Seplat Energy" },
    { src: "bua.png", alt: "BUA Group" },
    { src: "dangote.png", alt: "Dangote" },
    { src: "zenith.png", alt: "Zenith Bank" },
    { src: "leadway.png", alt: "Leadway Health" },
    { src: "avon.png", alt: "Avon HMO" },
    {src: "avon-hmo.png", alt: "Avon-hmo" },
    {src: "axa-mansard.png", alt: "AxaMansard" },
    {src: "bastion-health.png", alt: "Bastion Health" },
    {src: "high-commission-of-india.png", alt: "High commission of India" },
    {src: "palton-morgan.png", alt: "Palton Morgan"},
    {src: "reliance-hmo.png", alt: "Reliance Hmo" },
    {src: "sanlam.png", alt: "Sanlam" },
    {src: "verteville-energy.png", alt: "Verteville Energy" },
];

// Vite: import.meta.glob eager-loads every file in the logos folder so we can
// reference them by filename. Adjust the path if your assets live elsewhere.
const logoModules = import.meta.glob<{ default: string }>(
    "../../assets/logos/*.{svg,png}",
    { eager: true }
);

function resolve(filename: string): string | undefined {
    const entry = Object.entries(logoModules).find(([path]) =>
        path.endsWith(`/${filename}`)
    );
    return entry?.[1].default;
}

export function TrustBar() {
    // Duplicate the list so the track is two identical halves.
    const loop = [...LOGOS, ...LOGOS];

    return (
        <section className="w-full overflow-hidden bg-white py-10">
            <p className="mb-8 text-center text-sm font-bold text-brand-ink">
                Trusted by Nigeria&apos;s leading organisations and HMOs.
            </p>

            {/* group enables pause-on-hover via the index.css rule */}
            <div className="group relative flex overflow-hidden">
                {/* soft fade on the edges so logos enter/exit gently */}
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

                <ul className="flex shrink-0 animate-marquee items-center gap-16 pr-16 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
                    {loop.map((logo, i) => {
                        const src = resolve(logo.src);
                        return (
                            <li key={`${logo.src}-${i}`} className="shrink-0">
                                {src ? (
                                    <img
                                        src={src}
                                        alt={logo.alt}
                                        // grayscale-by-default → color on hover is a common tasteful
                                        // treatment for partner strips; delete the grayscale classes
                                        // if the design wants full colour always.
                                        className="h-7 w-auto object-contain"
                                        // aria-hidden on the duplicated half would be ideal, but since
                                        // resolve() may miss during setup we keep alts; screen readers
                                        // reading twice is a minor cost.
                                    />
                                ) : (
                                    // Fallback so layout doesn't collapse before assets are added
                                    <span className="text-xs text-brand-ink/40">{logo.alt}</span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}

/*
ADD TO src/index.css (inside the file, after the @theme block):

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

Notes:
- 30s = speed. Lower = faster. Tune to taste.
- Because the track is two identical halves, translateX(-50%) scrolls exactly
  one half-width, giving a seamless loop.
- group-hover:[animation-play-state:paused] pauses on hover (nice for letting
  users read a logo). Remove that class if you want it to never stop.
- motion-reduce:animate-none respects users who've asked for reduced motion —
  the strip simply sits still for them. Good accessibility default.
*/