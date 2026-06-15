import { Helmet } from "react-helmet-async";
import React from 'react';

export default function Legal() {
    return (
        <>
            <Helmet>
                <title>Legal, Privacy and Terms of Use | Grover's Hospital</title>
                <meta
                    name="description"
                    content="Privacy policy and terms of use for Grover's Hospital Lagos. How we collect, use and protect your information and the terms governing use of our website and portal."
                />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <section className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24">
                <div className="mx-auto w-full max-w-3xl px-6 lg:px-10">
                    <header className="mb-12">
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">
                            Version 1.0 · May 2026
                        </p>
                        <h1 className="mt-3 text-3xl font-extrabold text-brand-ink sm:text-4xl">
                            Legal, Privacy and Terms of Use
                        </h1>
                        <p className="mt-3 text-sm italic text-brand-ink/70">
                            Last updated: May 2026
                        </p>
                    </header>

                    <article className="space-y-10 text-sm leading-relaxed text-brand-ink sm:text-base">
                        <p>
                            This page sets out the Privacy Policy and Terms of Use for
                            the Grover's Hospital website at grovershospital.com.ng and
                            the Grover's Hospital Patient Portal. It is governed by the
                            laws of the Federal Republic of Nigeria, including the
                            Nigeria Data Protection Act 2023. By accessing or using our
                            website or Patient Portal, you confirm that you have read,
                            understood and agreed to the terms set out on this page. If
                            you do not agree, please discontinue use immediately.
                        </p>

                        <Section title="About Us">
                            <p>
                                Grover's Hospital and Lifestyle Clinic is a private
                                hospital located at 81A Younis Bashorun Street,
                                Victoria Island, Lagos, Nigeria. The hospital is
                                operated by LABACare. References to "Grover's
                                Hospital", "we", "us" and "our" in this document refer
                                collectively to Grover's Hospital and Lifestyle Clinic
                                and LABACare. For data protection and legal enquiries,
                                contact us at{" "}
                                <a
                                    href="mailto:clo@grovershospital.com.ng"
                                    className="font-semibold text-brand-blue underline underline-offset-2 hover:no-underline"
                                >
                                    clo@grovershospital.com.ng
                                </a>
                                .
                            </p>
                        </Section>

                        <Section title="Information We Collect">
                            <p>
                                We collect personal and health information through
                                direct interactions and through automated means when
                                you use our website or Patient Portal.
                            </p>
                            <p>
                                Information you provide directly includes your full
                                name, date of birth, gender, contact details including
                                phone number and email address, residential address,
                                medical history, health conditions and medications,
                                appointment details, laboratory results, payment
                                information and any communications you send to us.
                            </p>
                            <p>
                                Information collected automatically includes your IP
                                address, browser type, device identifiers, operating
                                system, pages visited, time spent on each page and
                                referring URLs. This information is collected through
                                cookies and similar tracking technologies.
                            </p>
                        </Section>

                        <Section title="How We Use Your Information">
                            <p>We use the information we collect for the following purposes:</p>
                            <p>
                                To provide, manage and improve your healthcare,
                                including processing appointments, issuing laboratory
                                results and maintaining your medical records. To
                                operate and administer our Patient Portal and website.
                                To communicate with you regarding your appointments,
                                test results, care and any updates to our services. To
                                comply with our legal and regulatory obligations under
                                Nigerian law, including the Nigeria Data Protection Act
                                2023 and applicable healthcare regulations. To
                                investigate complaints, enforce our terms and protect
                                the rights, property or safety of Grover's Hospital,
                                LABACare, our staff and our patients.
                            </p>
                            <p>
                                We do not sell your personal information to third
                                parties under any circumstances. We do not use your
                                health information for marketing or commercial purposes
                                without your explicit written consent.
                            </p>
                        </Section>

                        <Section title="Legal Basis for Processing">
                            <p>
                                We process your personal information on the following
                                legal bases as recognised under the Nigeria Data
                                Protection Act 2023: the performance of a contract,
                                specifically the provision of healthcare services to
                                you; compliance with a legal obligation; the protection
                                of your vital interests or those of another person; and
                                where you have given your explicit consent for a
                                specific purpose.
                            </p>
                        </Section>

                        <Section title="How We Share Your Information">
                            <p>
                                We may share your personal and health information in
                                the following circumstances:
                            </p>
                            <p>
                                With members of our clinical and administrative team
                                directly involved in your care and treatment. With
                                LABACare personnel in the course of managing hospital
                                operations, subject to strict confidentiality
                                obligations. With third-party service providers engaged
                                to support our operations, including laboratory
                                partners, diagnostic facilities, technology providers,
                                payment processors and communication platforms, all of
                                whom are bound by confidentiality agreements and data
                                processing terms consistent with this policy. With
                                regulatory authorities, law enforcement agencies or
                                courts where we are required to do so by applicable
                                Nigerian law, a valid court order or a lawful
                                regulatory directive.
                            </p>
                            <p>
                                We do not disclose your health information to
                                employers, insurers, family members or any other third
                                parties without your explicit written consent, except
                                where required or permitted by law.
                            </p>
                        </Section>

                        <Section title="Data Security">
                            <p>
                                We implement appropriate technical and organisational
                                measures to protect your personal and health
                                information against unauthorised access, disclosure,
                                alteration, loss or destruction. These measures include
                                SSL encryption for all data transmitted through our
                                website and Patient Portal, role-based access controls
                                restricting patient record access to authorised
                                personnel only, audit logging of all access to patient
                                records, regular security assessments and staff
                                training on data protection obligations.
                            </p>
                            <p>
                                No method of transmission over the internet or
                                electronic storage is completely secure. While we take
                                all reasonable steps to protect your information, we
                                cannot guarantee absolute security.
                            </p>
                        </Section>

                        <Section title="Patient Portal">
                            <p>
                                Access to our Patient Portal is restricted to
                                registered patients of Grover's Hospital. By creating a
                                Patient Portal account, you confirm that the
                                information you provide is accurate, current and
                                complete. You are solely responsible for maintaining
                                the confidentiality of your login credentials. You must
                                not share your credentials with any third party. You
                                must notify us immediately at{" "}
                                <a
                                    href="mailto:frontdesk@grovershospital.com.ng"
                                    className="font-semibold text-brand-blue underline underline-offset-2 hover:no-underline"
                                >
                                    frontdesk@grovershospital.com.ng
                                </a>{" "}
                                if you believe your account has been accessed without
                                authorisation.
                            </p>
                            <p>
                                We reserve the right to suspend or terminate Patient
                                Portal access at our discretion where we have
                                reasonable grounds to believe an account has been
                                compromised, misused or is being used in a manner
                                inconsistent with these terms.
                            </p>
                        </Section>

                        <Section title="Cookies">
                            <p>
                                Our website uses cookies and similar tracking
                                technologies to improve functionality, analyse traffic
                                and understand user behaviour. By continuing to use our
                                website, you consent to the use of cookies in
                                accordance with this policy. You may manage or disable
                                cookies through your browser settings. Please note that
                                disabling certain cookies may affect the functionality
                                of parts of our website.
                            </p>
                        </Section>

                        <Section title="Retention of Information">
                            <p>
                                We retain personal and health information for as long
                                as necessary to fulfil the purposes for which it was
                                collected and to comply with our legal and regulatory
                                obligations. Medical records are retained in accordance
                                with Nigerian healthcare regulations and applicable
                                professional standards. Where information is no longer
                                required, it is securely deleted or irreversibly
                                anonymised.
                            </p>
                        </Section>

                        <Section title="Your Rights">
                            <p>
                                Under the Nigeria Data Protection Act 2023, you have
                                the following rights in relation to your personal
                                information:
                            </p>
                            <p>
                                The right to be informed about how your information is
                                collected and used. The right to access the personal
                                information we hold about you. The right to request
                                correction of inaccurate or incomplete information. The
                                right to request erasure of your information where it
                                is no longer necessary for the purposes for which it
                                was collected, subject to our legal obligations. The
                                right to object to or restrict certain processing of
                                your information. The right to data portability in
                                certain circumstances. The right to withdraw consent at
                                any time where processing is based on consent, without
                                affecting the lawfulness of processing carried out
                                prior to withdrawal. The right to lodge a complaint
                                with the Nigeria Data Protection Commission if you
                                believe your rights under the Nigeria Data Protection
                                Act 2023 have been violated.
                            </p>
                            <p>
                                To exercise any of the rights listed above, submit a
                                written request to{" "}
                                <a
                                    href="mailto:clo@grovershospital.com.ng"
                                    className="font-semibold text-brand-blue underline underline-offset-2 hover:no-underline"
                                >
                                    clo@grovershospital.com.ng
                                </a>
                                . We will respond within the timeframe required by
                                applicable law.
                            </p>
                        </Section>

                        <Section title="Use of Our Website">
                            <p>
                                Our website is provided for informational and
                                healthcare access purposes. All content published on
                                this website, including blog articles, service
                                descriptions and health information, is intended for
                                general informational purposes only. It does not
                                constitute medical advice, diagnosis or treatment and
                                should not be relied upon as a substitute for
                                professional medical consultation with a qualified
                                healthcare provider.
                            </p>
                            <p>
                                You may use our website for lawful purposes only. You
                                may not use our website to transmit any unlawful,
                                harmful, defamatory or otherwise objectionable content.
                                You may not attempt to gain unauthorised access to any
                                part of our website or Patient Portal. You may not
                                engage in any activity that interferes with or disrupts
                                the operation of our digital infrastructure.
                            </p>
                        </Section>

                        <Section title="Intellectual Property">
                            <p>
                                All content on this website, including text, graphics,
                                logos, images, data and the overall design, is the
                                property of Grover's Hospital and Lifestyle Clinic and
                                LABACare and is protected by applicable Nigerian and
                                international intellectual property laws. No part of
                                this website may be reproduced, distributed, modified,
                                transmitted or used in any form without our prior
                                written permission, except as expressly permitted by
                                law.
                            </p>
                        </Section>

                        <Section title="Third Party Links">
                            <p>
                                Our website may contain links to third party websites
                                for reference or convenience. These links do not
                                constitute an endorsement of the content, products or
                                services offered by those websites. We have no control
                                over the content or practices of third party websites
                                and accept no responsibility or liability for any loss
                                or damage arising from your use of them.
                            </p>
                        </Section>

                        <Section title="Medical Information Disclaimer">
                            <p>
                                The health information published on this website,
                                including all blog content, is produced for general
                                educational purposes only. It is not a substitute for
                                professional medical advice, diagnosis or treatment.
                                Always seek the advice of a qualified medical
                                professional with any questions you may have regarding
                                a medical condition. Never disregard professional
                                medical advice or delay seeking it based on information
                                you have read on this website. In the event of a
                                medical emergency, call our emergency line immediately
                                on{" "}
                                <a
                                    href="tel:+2349022012109"
                                    className="font-semibold text-brand-blue underline underline-offset-2 hover:no-underline"
                                >
                                    0902 201 2109
                                </a>{" "}
                                or contact the nearest emergency medical facility.
                            </p>
                        </Section>

                        <Section title="Limitation of Liability">
                            <p>
                                To the fullest extent permitted by the laws of the
                                Federal Republic of Nigeria, Grover's Hospital and
                                LABACare shall not be liable for any indirect,
                                incidental, special, consequential or punitive loss or
                                damage of any kind arising out of or in connection with
                                your use of, or inability to use, our website or
                                Patient Portal, including but not limited to loss of
                                data, loss of revenue or loss of business opportunity.
                                Our total aggregate liability to you in connection with
                                these terms shall not exceed the total amount paid by
                                you to Grover's Hospital for the specific services
                                directly giving rise to the claim.
                            </p>
                        </Section>

                        <Section title="Governing Law and Jurisdiction">
                            <p>
                                These terms and any dispute or claim arising out of or
                                in connection with them, whether contractual or
                                non-contractual, shall be governed by and construed in
                                accordance with the laws of the Federal Republic of
                                Nigeria. The parties irrevocably submit to the
                                exclusive jurisdiction of the courts of the Federal
                                Republic of Nigeria for the resolution of any such
                                dispute or claim.
                            </p>
                        </Section>

                        <Section title="Changes to This Page">
                            <p>
                                We reserve the right to update this page at any time.
                                The date at the top of this page reflects the most
                                recent revision. Your continued use of our website or
                                Patient Portal following any update constitutes your
                                acceptance of the revised terms. We encourage you to
                                review this page periodically.
                            </p>
                        </Section>

                        <Section title="Contact">
                            <p>
                                For all legal, privacy and data protection enquiries:
                            </p>
                            <ul className="space-y-2 pl-0 list-none">
                                <li>
                                    📧{" "}
                                    <a
                                        href="mailto:clo@grovershospital.com.ng"
                                        className="font-semibold text-brand-blue underline underline-offset-2 hover:no-underline"
                                    >
                                        clo@grovershospital.com.ng
                                    </a>
                                </li>
                                <li>
                                    📞{" "}
                                    <a
                                        href="tel:+2349022012109"
                                        className="font-semibold text-brand-blue underline underline-offset-2 hover:no-underline"
                                    >
                                        0902 201 2109
                                    </a>
                                </li>
                                <li>
                                    📍 81A Younis Bashorun Street, Victoria Island,
                                    Lagos, Nigeria.
                                </li>
                            </ul>
                        </Section>
                    </article>
                </div>
            </section>
        </>
    );
}

function Section({
                     title,
                     children,
                 }: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="mt-8 first:mt-0">
            <h2 className="mb-4 text-xl font-extrabold text-brand-red sm:text-2xl">
                {title}
            </h2>
            <div className="space-y-4">{children}</div>
        </section>
    );
}