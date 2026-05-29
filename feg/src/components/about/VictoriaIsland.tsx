import labacare from "../../assets/about-page/labacare.png";
import aerialView from "../../assets/about-page/aerialView.png";

export default function VictoriaIsland() {
    return (
        <section
            id="victoria-island"
            className="bg-[#f9f7f0]"
            aria-labelledby="victoria-island-heading"
        >
            {/* 2-col grid lives on the section directly so the photo column can */}
            {/* run flush to the viewport edge — no max-w-content wrapper here. */}
            <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
                {/* Left: text content */}
                <div className="px-6 py-16 sm:py-20 lg:px-10 lg:py-24">
                    <div className="mx-auto max-w-xl lg:ml-auto lg:mr-0">
                        <img
                            src={labacare}
                            alt="Operated by LABACare"
                            className="block h-10 w-auto"
                        />

                        <h2
                            id="victoria-island-heading"
                            className="mt-8 text-3xl font-extrabold leading-tight text-brand-blue sm:text-4xl lg:w-[80%]"
                        >
                            A private hospital in Victoria Island with a focus that sets us
                            apart.
                        </h2>

                        <div className="mt-8 space-y-5 text-sm leading-relaxed text-brand-ink sm:text-base">
                            <p>
                                We are Nigeria&rsquo;s first dedicated lifestyle disease
                                clinic. That means our work goes beyond diagnosing and
                                treating. We focus on the conditions that are quietly
                                reshaping health outcomes across Lagos: hypertension,
                                diabetes, obesity, heart disease and other lifestyle-related
                                illnesses. We catch them early, manage them properly and help
                                our patients live healthier, longer lives.
                            </p>
                            <p>
                                Since 2017 we have grown into a full-service private hospital
                                offering 19 specialist clinics, a 24/7 ICU and NICU, advanced
                                diagnostics and comprehensive health screening packages. We
                                serve individuals, families, expats and some of
                                Nigeria&rsquo;s most recognised organisations, all from our
                                facility on Younis Bashorun Street in Victoria Island.
                            </p>
                            <p>
                                We are operated by LABACare, a professional hospital
                                management company that brings world-class operational
                                standards to every part of how we run. That means the care
                                you receive at Grover&rsquo;s is backed not just by good
                                medicine, but by strong systems, trained teams and a genuine
                                commitment to your experience as a patient.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: aerial photo — fixed aspect on mobile/tablet so it has */}
                {/* a sensible height when stacked, stretches with the grid on lg+. */}
                <div className="relative aspect-[4/3] lg:aspect-auto">
                    <img
                        src={aerialView}
                        alt="Aerial view of Victoria Island, Lagos showing the bridge crossing the lagoon"
                        className="absolute inset-0 block h-full w-full object-cover"
                    />
                    {/* Photo credit, overlaid on the dark water area */}
                    <div className="absolute bottom-3 right-3 text-right text-[10px] leading-tight text-[#f9f7f0]/90">
                        <p>Creator: Olalekan Olafusi</p>
                        <p>Copyright: Olalekan Olafusi / Amazing Aerial Agency</p>
                    </div>
                </div>
            </div>
        </section>
    );
}