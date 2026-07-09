import { SITE, FOOTER_QUICK_LINKS, FOOTER_SERVICES } from "../../data/site";
import footerLogo from "../../assets/footerLogo.png";
import ig from "../../assets/ig.png"
import whatsapp from "../../assets/whatsapp.png"
import x from "../../assets/x.png"
import fb from '../../assets/fb.png'
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="w-full bg-brand-blue text-white">
            <div className="mx-auto lg:w-[80%] max-w-content px-4 py-14 md:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className={'lg:w-[60%]'}>
                        <img src={footerLogo} alt="Grover's Hospital" className="h-10 w-auto" />
                        <p className="mt-5 text-sm font-bold">{SITE.tagline}</p>
                        <p className="mt-2 text-sm text-white/80">
                            Private hospital in Victoria Island, Lagos. Since 2017.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold">Quick Links</h3>
                        <ul className="mt-4 space-y-2 text-sm text-white/80">
                            {FOOTER_QUICK_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Our Services */}
                    <div>
                        <h3 className="text-sm font-bold">Our Services</h3>
                        <ul className="mt-4 space-y-2 text-sm text-white/80">
                            {FOOTER_SERVICES.map((service) => (
                                <li key={service.label}>
                                    <Link
                                        to={service.href}
                                        className="transition-colors hover:text-white"
                                    >
                                        {service.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Get in Touch */}
                    <div>
                        <h3 className="text-sm font-bold">Get in Touch with us!</h3>
                        <p className="mt-4 text-sm text-white/80">
                            Email:{" "}
                            <a href={`mailto:${SITE.email}`} className="hover:text-white">
                                {SITE.email}
                            </a>
                        </p>
                        {/* Social icons — drop your exported icons in here */}
                        <div className="mt-4 flex gap-3 items-center">
                            {/* Replace these with your <img> icon exports */}
                            <a href="https://www.instagram.com/grovershospital/?hl=en" aria-label="Instagram" className="opacity-90 hover:opacity-100"><img src={ig}
                                                                                                             alt="" className={'h-4 w-4 object-contain'}/></a>
                            <a href="x.com/grovershospital" aria-label="X" className="opacity-90 hover:opacity-100"><img src={x} alt=""/></a>
                            <a href="https://www.facebook.com/GroversHospital/" aria-label="Facebook" className="opacity-90 hover:opacity-100"><img src={fb}
                                                                                                            alt=""/></a>
                            <a href="#" aria-label="WhatsApp" className="opacity-90 hover:opacity-100"><img src={whatsapp}
                                                                                                            alt="" className={'w-4 h-4 object-contain'}/></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright bar */}
            <div className="border-t border-white/20">
                <div className="mx-auto max-w-content px-4 py-5 text-center text-xs text-white/70 md:px-8">
                    © 2026 Grover&apos;s Hospital. Operated by LABACare. |{" "}
                    <a href="/legal" className="hover:text-white">Privacy Policy</a> |{" "}
                    <a href="/legal" className="hover:text-white">Terms of Use</a>
                </div>
            </div>
        </footer>
    );
}