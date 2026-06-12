import React, {useState} from "react";
import {NAV_LINKS} from "../../data/site.ts";
import {ChevronDown} from 'lucide-react';
import {Button} from "../../ui/Button";
import logo from "../../assets/logo.png";

function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith('#')) {
        e.preventDefault();
        document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }
}

export function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className={'w-full border-b sticky top-0 z-50 border-black/5 bg-white'}>
            <nav className={"mx-auto flex max-w-content items-center justify-between px-4 py-4 md:px-8"}>
                {/*  Logo  */}
                <a href="/" className={"flex items-center"} aria-label={`Grover's Hospital home`}>
                    <img src={logo} alt="Grover's Hospital" className={'h-12 w-auto'}/>
                </a>

                {/* Desktop links   */}
                <ul className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => (
                        <li
                            key={link.label}
                            className="group relative"
                        >
                            <a
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="flex items-center gap-1 text-sm text-brand-ink/90 transition-colors hover:text-brand-green"
                            >
                                <span>{link.label}</span>

                                {"children" in link && (
                                    <ChevronDown
                                        className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                                        strokeWidth={2.5}
                                    />
                                )}
                            </a>

                            {"children" in link && (
                                <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                                    <div className="min-w-[220px] rounded-xl border border-black/5 bg-white p-2 shadow-lg">
                                        {link.children.map((child) => (
                                            <a
                                                key={child.label}
                                                href={child.href}
                                                className="block rounded-lg px-4 py-3 text-sm text-brand-ink transition-colors hover:bg-brand-green/5 hover:text-brand-green"
                                            >
                                                {child.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/*  Desktop CTA  */}
                <div className={'hidden md:block'}>
                    <Button href={'/patient-portal'} variant={"primary"} className={'px-5 py-2.5 text-xs'}>
                        Patient Portal
                    </Button>
                </div>

                {/* Mobile hamburger */}
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                    aria-expanded={open}
                    className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
                >
          <span className="relative block h-4 w-6">
            <span
                className={`absolute left-0 block h-0.5 w-6 bg-brand-ink transition-transform duration-200 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                }`}
            />
            <span
                className={`absolute left-0 top-1.5 block h-0.5 w-6 bg-brand-ink transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                }`}
            />
            <span
                className={`absolute left-0 block h-0.5 w-6 bg-brand-ink transition-transform duration-200 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                }`}
            />
          </span>
                </button>
            </nav>

            {/*    Mobile dropdown panel */}
            {open && (
                <div className={'border-t border-black/5 md:hidden'}>
                    <ul className={'mx-auto flex max-w-content flex-col gap-1 px-4 py-3'}>
                        {NAV_LINKS.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    onClick={(e) => {
                                        handleNavClick(e, link.href);
                                        setOpen(false);
                                    }}
                                    className="block rounded-md px-2 py-2.5 text-sm text-brand-ink/90 hover:bg-brand-green/5 hover:text-brand-green"
                                >
                                    {link.label}
                                </a>

                                {"children" in link &&
                                    link.children.map((child) => (
                                        <a
                                            key={child.label}
                                            href={child.href}
                                            onClick={() => setOpen(false)}
                                            className="ml-4 block rounded-md px-2 py-2 text-sm text-brand-ink/70 hover:bg-brand-green/5 hover:text-brand-green"
                                        >
                                            {child.label}
                                        </a>
                                    ))}
                            </li>
                        ))}
                        <li className={'pt-2'}>
                            <Button href={'/patient-portal'} variant={'primary'} className={"w-full"}>
                                Patient Portal
                            </Button>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    )
}