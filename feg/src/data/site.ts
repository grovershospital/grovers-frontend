// src/data/site.ts
// Single source of truth for the homepage copy, so sections map over data
// instead of hardcoding JSX. Edit text here, not in the components.

export const SITE = {
    name: "Grover's Hospital",
    tagline: "Nigeria's first lifestyle clinic.",
    emergencyPhone: "0902 201 2109",
    altPhone: "0902 476 8377",
    email: "wecare@grovershospital.com.ng",
    address: {
        line1: "81A Younis Bashorun Street, Off Ajose Adeogun Street,",
        line2: "Victoria Island, Lagos.",
        landmarks: [
            "Behind Zenith Bank Head Office.",
            "Near Eko Hotel Roundabout.",
        ],
    },
    contactEmails: [
        "frontdesk@grovershospital.com.ng",
        "clo@grovershospital.com.ng",
        "bd@grovershospital.com.ng",
    ],
    generalHours: "Monday to Saturday, from 8:00 AM",
} as const;

export const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    {
        label: "Our Services",
        href: "/services",
        children: [
            {
                label: "Our Clinics",
                href: "/services",
            },
            {
                label: "Health Packages",
                href: "/packages",
            },
        ],
    },
    { label: "Resources", href: "/resources" },
    { label: "Contact Us", href: "#contact" },
] as const;

export const TOPBAR_ITEMS = [
    { title: "General Hours", detail: "Mon - Sun 8 AM" },
    { title: "Emergency Line", detail: "0902 201 2109" },
    { title: "Emergency", detail: "Pharmacy | Laboratory" },
] as const;

export const STATS = [
    {
        value: "18+",
        label: "Inpatient Beds",
        blurb:
            "Our inpatient facility provides round the clock care with a fully staffed Adult ICU and NICU available 24 hours a day.",
    },
    {
        value: "19+",
        label: "Specialist Clinics",
        blurb:
            "19 specialist areas. 28 clinic sessions every week. The right doctor is available almost every day.",
    },
    {
        value: "20+",
        label: "Years of Experience",
        blurb:
            "Founded on over two decades of Nigerian healthcare experience, built to prevent illness not just treat it.",
    },
] as const;

export const CLINICS = [
    {
        name: "Family Medicine",
        blurb:
            "Your primary doctor for all ages. We manage chronic conditions, lifestyle diseases and everyday health concerns.",
        days: "Mon to Sat.",
        hours: "10:00 AM to 6:00 PM",
    },
    {
        name: "Obstetrics and Gynaecology",
        blurb:
            "Full women's health care. Antenatal clinic, cancer screening, family planning and safe deliveries.",
        days: "Tue, Wed, Thu",
        hours: "12:00 PM to 3:00 PM",
    },
    {
        name: "ENT",
        blurb:
            "Ears, nose, and throat care for adults and children. Sinus issues, hearing loss, tonsils, and more.",
        days: "Tue, Wed, Thu",
        hours: "12:00 PM to 3:00 PM",
    },
    {
        name: "Physiotherapy",
        blurb:
            "Recovery done properly. Post-surgery rehab, chronic pain, and mobility restoration.",
        days: "Mon to Fri",
        hours: "9:00 AM to 5:00 PM",
    },
    {
        name: "Cardiology",
        blurb:
            "Heart health, properly managed. ECG, echocardiography and heart disease care.",
        days: "Wed, Thu",
        hours: "3:00 PM to 6:00 PM",
    },
    {
        name: "Paediatrics",
        blurb:
            "Specialist care for babies, children and teenagers. Immunisations, developmental checks and illness management.",
        days: "Mon, Tue, Thu, Fri",
        hours: "4:00 PM to 6:00 PM",
    },
    {
        name: "Mental Health Clinic",
        blurb:
            "A dedicated space for mental and emotional health support. Assessment, counselling and management of anxiety, depression, stress and mood disorders.",
        days: "Wed",
        hours: "10:00 AM to 1:00 PM",
    },
    {
        name: "Internal Medicine",
        blurb:
            "For complex chronic conditions. Diabetes, hypertension, HIV management and more.",
        days: "Mon to Fri",
        hours: "1:00 PM to 7:00 PM",
    },
] as const;

export const EMERGENCY_UNITS = [
    { name: "Adult ICU", detail: "3 beds,", note: "24/7" },
    { name: "NICU", detail: "3 beds", note: "24/7" },
    { name: "Ambulance", detail: "call", note: "0902 201 2109" },
] as const;

export const PACKAGES = [
    {
        name: "Pre-Employment Test",
        blurb:
            "For businesses onboarding new staff. Six tiers covering everything from a basic fitness-to-work check to a full toxicology panel.",
    },
    {
        name: "Domestic Staff Screening",
        blurb:
            "For homeowners vetting drivers, nannies, cooks or security staff. Five tiers, clearly priced.",
    },
    {
        name: "Annual Wellness Test",
        blurb:
            "A full-body health check covering diabetes markers, liver function, cancer risk, lipid profile, imaging and more.",
    },
] as const;

export const TESTIMONIALS = [
    {
        quote:
            "When our baby arrived prematurely, we did not know what to do. The NICU team at Grover's gave us our child back. The equipment was there, but it was the doctors and nurses, their dedication and their warmth, that got us through those weeks. We will never forget what they did.",
        author: "— Patient family, NICU",
        photo: "patient-1.jpg",
    },
    {
        quote:
            "After my joint replacement I did not think I would walk properly again. The physiotherapy team gave me a program that actually worked. I am moving better now than I have in years. They do not just treat you, they get you back to living.",
        author: "— Orthopaedic patient",
        photo: "patient-2.jpg",
    },
    {
        quote:
            "We have been bringing the whole family here for annual checks for years. The doctor knows our history, follows up without being asked, and always focuses on prevention. That kind of care is rare in Lagos.",
        author: "— Family medicine patient",
        photo: "patient-3.jpg",
    },
] as const;

export const FOOTER_SERVICES = [
    "Family Medicine",
    "Obstetrics and Gynaecology",
    "Paediatrics",
    "Intensive Care Unit",
    "Neonatal Intensive Care Unit",
    "Health Screening Packages",
    "Emergency Services",
] as const;

// @ts-ignore
export const FOOTER_QUICK_LINKS = [
    "About Us",
    "Services and Packages",
    "Blog and Resources",
    "Contact Us",
] as const;