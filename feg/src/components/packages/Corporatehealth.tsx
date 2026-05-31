import { Button } from "../../ui/Button";
import wwo from "../../assets/packages-page/wwo.jpg";

const WHAT_WE_OFFER = [
    "Pre-employment screening for new hires",
    "Annual health checks for existing staff",
    "On-site satellite clinic setup inside your headquarters",
    "Corporate health retainerships",
    "HMO coordination and support",
] as const;

export default function CorporateHealth() {
    return (
        <section
            id="corporate-health"
            className="bg-[#f9f7f0] pb-16 sm:pb-20 lg:pb-32"
            aria-labelledby="corporate-health-heading"
        >
            {/* 2-col grid lives on the section directly so the image column can */}
            {/* bleed flush to the left viewport edge — same approach as the */}
            {/* Victoria Island section on the About page. */}
            <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
                {/* Image column — left side, bleeds to viewport edge. */}
                {/* Rounded corner on the right (facing the content). */}
                <div className="h-72 sm:h-96 lg:h-auto">
                    <img
                        src={wwo}
                        alt=""
                        aria-hidden="true"
                        className="block h-full w-full object-cover lg:rounded-r-[2rem]"
                    />
                </div>

                {/* Content column — right side. */}
                <div className="px-6 py-12 sm:py-16 lg:px-10 lg:py-20">
                    <div className="mx-auto max-w-xl lg:ml-0">
                        <h2
                            id="corporate-health-heading"
                            className="text-3xl font-extrabold leading-tight text-brand-green sm:text-4xl"
                        >
                            A dedicated healthcare partner for your business.
                        </h2>

                        <div className="mt-6 space-y-4 text-sm leading-relaxed text-brand-ink sm:text-base">
                            <p>
                                We work directly with organisations across Lagos to make
                                healthcare accessible to their workforce with a dedicated
                                retainer. From pre-employment screening to annual health
                                checks and on-site satellite clinics, we take the health
                                management of your team seriously so you can focus on running
                                your business.
                            </p>
                            <p>
                                We operate satellite clinics inside KPMG, Seplat Energy and
                                Tek Experts and are trusted by Dangote, FirstBank, BUA Group,
                                the High Commission of India and many others.
                            </p>
                        </div>

                        <h3 className="mt-8 text-base font-extrabold text-brand-red">
                            What we offer:
                        </h3>
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-brand-ink sm:text-base">
                            {WHAT_WE_OFFER.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>

                        <div className="mt-8">
                            <Button variant="primary" href="/contact" className={"lg:px-10"}>
                                Talk To Us
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}