import { CLINICS } from "../../data/site";
import { Button } from "../../ui/Button";

// Clinic card images. Export one photo per clinic from Figma into
// src/assets/clinics/ and match the filenames below. import.meta.glob eager-
// loads the folder so we reference by filename rather than nine imports.
const clinicImages = import.meta.glob<{ default: string }>(
    "../../assets/clinics/*.{jpg,png,webp}",
    { eager: true }
);

// Map each clinic name to its image filename.
const IMAGE_FOR: Record<string, string> = {
    "Family Medicine": "family-medicine.png",
    "Obstetrics and Gynaecology": "obgyn.png",
    ENT: "ent.png",
    Physiotherapy: "physiotherapy.png",
    Cardiology: "cardiology.png",
    Paediatrics: "paediatrics.png",
    "Mental Health Clinic": "mental-health.png",
    "Internal Medicine": "internal-medicine.png",
};

function imageFor(name: string): string | undefined {
    const filename = IMAGE_FOR[name];
    if (!filename) return undefined;
    const entry = Object.entries(clinicImages).find(([path]) =>
        path.endsWith(`/${filename}`)
    );
    return entry?.[1].default;
}

export function Services() {
    return (
        <section className="w-full bg-[#f7f4ef] py-16 md:py-24">
            <div className="mx-auto max-w-content px-4 md:px-8">
                {/* Heading */}
                <h2 className="text-center text-3xl font-extrabold text-brand-red sm:text-4xl">
                    We have the right specialist for you.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-brand-ink/70">
                    Our consultants cover 19 departments across the week. From routine family
                    medicine to complex surgery, the right doctor is available.
                </p>

                {/* Clinic grid: 1 col mobile, 2 cols from md */}
                <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
                    {CLINICS.map((clinic) => {
                        const img = imageFor(clinic.name);
                        return (
                            <article key={clinic.name} className="flex gap-4">
                                {/* Thumbnail */}
                                <div className="h-30 w-26 shrink-0 overflow-hidden rounded-md bg-brand-ink/5">
                                    {img ? (
                                        <img
                                            src={img}
                                            alt={clinic.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : null}
                                </div>

                                {/* Text */}
                                <div className="min-w-0">
                                    <h3 className="text-base font-bold text-brand-ink">
                                        {clinic.name}
                                    </h3>
                                    <p className="mt-1 text-xs leading-relaxed text-brand-ink/70">
                                        {clinic.blurb}
                                    </p>
                                    <p className="mt-3 text-xs font-bold text-brand-ink">
                                        {clinic.days}
                                        <br />
                                        {clinic.hours}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Footer line + CTA */}
                <p className="mx-auto mt-14 max-w-md text-center text-sm leading-relaxed text-brand-ink/70">
                    See our full clinic schedule and book an appointment with a specialist
                    anytime you want.
                </p>
                <div className="mt-6 flex justify-center">
                    <Button href="/book" variant="primary">
                        Book an Appointment
                    </Button>
                </div>
            </div>
        </section>
    );
}