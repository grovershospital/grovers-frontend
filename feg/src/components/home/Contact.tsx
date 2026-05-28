// src/components/home/Contact.tsx
import {SITE} from "../../data/site";
import {Button} from "../../ui/Button";
import emailIcon from "../../assets/emailIcon.png"
import clockIcon from "../../assets/clockIcon.png"
import callIcon from '../../assets/callIcon.png'
import callWhatsapp from '../../assets/callWhatsapp.png';

// Real hospital coordinates (from Google Places).
const LAT = 6.4298292;
const LNG = 3.43653;

// Google Maps embed pointing at the address — interactive, no API key needed.
const MAP_EMBED = `https://maps.google.com/maps?q=${LAT},${LNG}&z=16&output=embed`;
// "Get Directions" opens Google Maps directions to the hospital.
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}&destination_place_id=ChIJ33H0Iib1OxARfT_PHWk3T78`;

export function Contact() {
    return (
        <section className="w-full bg-white py-16 md:py-24">
            <div className="mx-auto grid max-w-content grid-cols-1 gap-10 px-4 md:px-8 lg:w-[80%] lg:grid-cols-2 lg:gap-16">
                {/* Left: details */}
                <div className={'lg:w-[60%]'}>
                    <h2 className="text-2xl font-extrabold text-left leading-tight text-brand-red sm:text-4xl">
                        We are easy to find and always available.
                    </h2>

                    {/* Address */}
                    <p className="mt-6 text-sm leading-relaxed text-brand-ink/80">
                        {/* Replace this emoji with your exported pin icon if you prefer */}
                        <span aria-hidden="true">📍</span>{" "}
                        <span className="font-bold">Address</span> {SITE.address.line1}{" "}
                        {SITE.address.line2}
                    </p>

                    {/* Landmarks */}
                    <div className="mt-5">
                        <p className="text-sm font-bold text-brand-ink">Landmarks:</p>
                        <div className="mt-2 space-y-0.5 text-sm text-brand-ink/80">
                            {SITE.address.landmarks.map((lm) => (
                                <p key={lm}>{lm}</p>
                            ))}
                        </div>
                    </div>

                    {/* Get Directions */}
                    <div className="mt-6">
                        <Button href={DIRECTIONS_URL} variant="red">
                            Get Directions
                        </Button>
                    </div>

                    {/* Emails */}
                    <div className="mt-8 flex items-start gap-2">
                        <img src={emailIcon} alt="" className={'mt-0.5 h-4 w-4 shrink-0 object-contain'}/>
                        <div className={'space-y-0.5 text-sm text-brand-ink/80'}>
                            {SITE.contactEmails.map((email) => (
                                <p key={email}>{email}</p>
                            ))}
                        </div>

                    </div>

                    {/* General Hours */}
                    <div className="mt-6 flex items-start gap-2">
                        <img src={clockIcon} alt="" className="mt-0.5 h-4 w-4 shrink-0 object-contain"/>
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-brand-ink">General Hours</p>
                            <p className="text-sm text-brand-ink/80">{SITE.generalHours}</p>
                        </div>
                    </div>

                    {/* Phones */}
                    <div className="mt-6 flex items-center gap-2">
                        <div className="flex gap-1">
                            <img src={callIcon} alt="" className="h-5 w-5 shrink-0 object-contain"/>
                            <img src={callWhatsapp} alt="" className="h-5 w-5 shrink-0 object-contain"/>
                        </div>
                        <div className="text-sm font-bold text-brand-ink">
                            <p>{SITE.emergencyPhone}</p>
                            <p>{SITE.altPhone}</p>
                        </div>
                    </div>
                </div>

                {/* Right: interactive map pointing to the address */}
                <div className="overflow-hidden rounded-lg border border-brand-ink/10">
                    <iframe
                        title="Grover's Hospital location"
                        src={MAP_EMBED}
                        className="h-full min-h-[360px] w-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    );
}