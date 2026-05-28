import aboutImg from "../../assets/aboutImg.png";

export function About() {
    return (
        <section className="w-full bg-white py-16 md:py-24">
            <div className="mx-auto grid w-[65%] grid-cols-1 items-center gap-10 px-4 md:px-8 lg:grid-cols-2 lg:gap-16">
                {/* Left: text column */}
                <div className={'text-left lg:text-right'}>
                    <p className="mb-4 text-xs font-bold leading-snug text-brand-ink/70">
                        Nigeria&apos;s premiere lifestyle clinic, built on over 20 years of
                        healthcare experience.
                    </p>

                    <h2 className="text-3xl font-extrabold leading-tight text-brand-green sm:text-4xl">
                        Good healthcare should keep you well, not just treat you when you are
                        not.
                    </h2>

                    <div className="mt-6 space-y-4 text-sm leading-relaxed text-brand-ink/80">
                        <p>
                            Grover&apos;s Hospital was founded in 2017 by Chief Dr. Anil Grover
                            and Dr. Arvinder Grover, after more than two decades of working in
                            Nigerian healthcare. They saw the same gap everywhere: hospitals
                            focused on illness, not prevention. Grover&apos;s was built to close
                            that gap.
                        </p>
                        <p>
                            Today, we care for individuals, families, expats and some of
                            Nigeria&apos;s most recognised organisations. We are a trusted
                            hospital for the expat community in Victoria Island and a preferred
                            healthcare partner for leading Lagos corporates. All from our facility
                            on Younis Bashorun Street, operated by LABACare.
                        </p>
                    </div>
                </div>

                {/* Right: building photo */}
                <div className="relative">
                    <img
                        src={aboutImg}
                        alt="Grover's Hospital building in Victoria Island, Lagos"
                        className="h-auto w-full rounded-lg object-cover shadow-sm"
                    />
                </div>
            </div>
        </section>
    );
}