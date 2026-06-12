import { Calendar, Clock } from "lucide-react";
import { Button } from "../../ui/Button";
import type { ClinicDetail as ClinicDetailType } from "../../data/clinic-details";

// Eager-load all clinic images so filenames map to URLs at build time.
// To add a clinic: drop a photo in src/assets/services/clinics/ and add
// an entry to CLINIC_DETAILS with the matching filename.
const photos = import.meta.glob<{ default: string }>(
    "../../assets/services/clinics/*.{jpg,jpeg,png,webp}",
    { eager: true }
);
const photoByFile: Record<string, string> = {};
for (const [path, mod] of Object.entries(photos)) {
    const file = path.split("/").pop()!;
    photoByFile[file] = mod.default;
}

export default function ClinicDetail({ clinic }: { clinic: ClinicDetailType }) {
    const isImageRight = clinic.imagePosition === "right";
    const src = photoByFile[clinic.image];

    const imageOrder = isImageRight ? "lg:order-2" : "lg:order-1";
    const contentOrder = isImageRight ? "lg:order-1" : "lg:order-2";
    const imageRounded = isImageRight
        ? "lg:rounded-l-[2rem]"
        : "lg:rounded-r-[2rem]";

    return (
        <section
            id={clinic.slug}
            className="bg-[#f9f7f0]"
            aria-labelledby={`${clinic.slug}-heading`}
        >
            {/* 2-col grid on desktop, stacked on mobile. items-stretch (default) */}
            {/* makes both columns share the row height. */}
            <div className="lg:grid lg:grid-cols-2 lg:items-stretch lg:mt-18">
                {/* Image column. */}
                {/* Mobile/tablet: explicit pixel height. */}
                {/* Desktop (lg:h-auto): grid stretches the column to match the */}
                {/* content column's natural height — so the image never exceeds */}
                {/* the content's vertical extent. */}
                <div className={`h-72 sm:h-96 lg:h-auto ${imageOrder}`}>
                    {src ? (
                        <img
                            src={src}
                            alt=""
                            aria-hidden="true"
                            className={`block h-full w-full object-cover ${imageRounded}`}
                        />
                    ) : (
                        <div className="h-full w-full bg-neutral-200" />
                    )}
                </div>

                {/* Content column. */}
                <div
                    className={`px-6 py-12 sm:py-16 lg:px-10 lg:py-20 ${contentOrder}`}
                >
                    <div className="mx-auto max-w-xl">
                        {/* Schedule lines — calendar / clock icons in brand-red. */}
                        <ul className="space-y-1.5 text-xs text-brand-ink sm:text-sm">
                            {clinic.schedule.map(({ days, hours }) => (
                                <li
                                    key={`${days}-${hours}`}
                                    className="flex flex-wrap items-center gap-x-6 gap-y-1"
                                >
                  <span className="inline-flex items-center gap-2">
                    <Calendar
                        className="h-4 w-4 shrink-0 text-brand-red"
                        strokeWidth={2.5}
                    />
                    <span>{days}</span>
                  </span>
                                    <span className="inline-flex items-center gap-2">
                    <Clock
                        className="h-4 w-4 shrink-0 text-brand-red"
                        strokeWidth={2.5}
                    />
                    <span>{hours}</span>
                  </span>
                                </li>
                            ))}
                        </ul>

                        {/* Uppercase clinic name */}
                        <p className="mt-6 text-sm font-bold tracking-wide text-brand-ink">
                            {clinic.name}
                        </p>

                        {/* Green headline */}
                        <h2
                            id={`${clinic.slug}-heading`}
                            className="mt-2 text-3xl font-extrabold leading-tight text-brand-green sm:text-4xl"
                        >
                            {clinic.headline}
                        </h2>

                        {/* Body paragraphs — supports plain strings or { prefix, text } */}
                        {/* for paragraphs with a bold inline prefix (e.g. Urology). */}
                        <div className="mt-6 space-y-4 text-sm leading-relaxed text-brand-ink sm:text-base">
                            {clinic.body.map((p, i) =>
                                typeof p === "string" ? (
                                    <p key={i}>{p}</p>
                                ) : (
                                    <p key={i}>
                                        <strong className="font-extrabold">{p.prefix}</strong>{" "}
                                        {p.text}
                                    </p>
                                )
                            )}
                        </div>

                        {/* What we cover */}
                        <h3 className="mt-8 text-base font-extrabold text-brand-red">
                            What we cover:
                        </h3>
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-brand-ink sm:text-base">
                            {clinic.whatWeCover.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>

                        {/* What to expect — bold prefix, regular body */}
                        <p className="mt-6 text-sm leading-relaxed text-brand-ink sm:text-base">
                            <strong className="font-extrabold">What to expect:</strong>{" "}
                            {clinic.whatToExpect}
                        </p>

                        {/* CTA */}
                        <div className="mt-8">
                            <Button variant="primary" href="/patient-portal/login">
                                Book an appointment
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}