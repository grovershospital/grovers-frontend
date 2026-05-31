import type { ScreeningPackageData } from "../components/packages/ScreeningPackage";

export const ANNUAL_WELLNESS: ScreeningPackageData = {
    slug: "wellness",
    headline: "A full picture of your health, once a year.",
    body:
        "Most people only see a doctor when something is wrong. This package is for people who want to stay ahead of it. The Annual Wellness Test gives you a thorough picture of where your health stands, from your heart and liver to your kidneys, thyroid and beyond. The higher the tier, the more comprehensive the picture. A 7% discount is applied to all bundled packages.",
    whoThisIsFor:
        "Individuals and families who want a proactive picture of their health.",
    tiers: ["Basic", "Standard", "Deluxe", "Deluxe+", "Premium"],
    tests: [
        { name: "FBS", included: [true, true, true, true, true] },
        {
            name: "Glycated Haemoglobin HBA1c",
            included: [false, true, true, true, true],
        },
        { name: "PSA", included: [false, false, true, true, true] },
        { name: "Mammogram", included: [false, false, false, true, true] },
        { name: "T3 + T4 + TSH (Thyroid)", included: [false, false, true, true, true] },
        { name: "EUCR (Renal)", included: [true, true, true, true, true] },
        { name: "Calcium", included: [false, false, true, false, true] },
        { name: "CBC", included: [true, true, true, true, true] },
        { name: "ESR", included: [true, true, true, true, true] },
        { name: "Urinalysis", included: [true, true, true, false, true] },
        { name: "Urine MCS", included: [false, false, true, false, true] },
        { name: "Stool MCS", included: [false, false, true, true, true] },
        { name: "Full Liver Profile", included: [true, true, true, true, true] },
        {
            name: "Proteins, Albumin, Globulin",
            included: [false, true, true, true, true],
        },
        { name: "Digital Chest X-Ray", included: [true, true, true, true, true] },
        { name: "Abdomino-Pelvic Scan", included: [true, true, true, true, true] },
        { name: "Breast Scan", included: [true, true, true, true, true] },
        { name: "ECG", included: [false, false, true, true, true] },
        {
            name: "2D Echo Colour Doppler",
            included: [false, false, false, true, true],
        },
        { name: "Full Lipid Profile", included: [true, true, true, true, true] },
        { name: "VRDL Cholesterol", included: [false, true, true, false, true] },
        { name: "HIV", included: [true, true, true, true, true] },
        { name: "Hepatitis B", included: [true, true, true, true, true] },
        { name: "Hepatitis C", included: [false, true, true, true, true] },
        { name: "Hormonal Profile", included: [false, false, false, false, true] },
        { name: "PAP Smear", included: [false, false, false, false, true] },
        {
            name: "Physical Examination and Review",
            included: [true, true, true, true, true],
        },
    ],
    pricing: [
        { tier: "Basic", male: "\u20a6108,237", female: "\u20a6155,900" },
        { tier: "Standard", male: "\u20a6127,070", female: "\u20a6176,150" },
        { tier: "Deluxe", male: "\u20a6259,583", female: "\u20a6270,250" },
        { tier: "Deluxe+", male: "\u20a6310,140", female: "\u20a6373,000" },
        { tier: "Premium", male: "\u20a6386,633", female: "\u20a6455,250" },
    ],
    footerNote:
        "Female pricing is higher in most tiers due to inclusion of Mammogram, Breast Scan and PAP Smear. PSA is most relevant for male patients and is included from Deluxe upward.",
    ctaLabel: "Book Annual Wellness Test",
    // headingTone defaults to "green", pricingTone defaults to "red"
};

export const PRE_EMPLOYMENT: ScreeningPackageData = {
    slug: "pre-employment",
    headline: "Medical clearance for your new staff.",
    body:
        "Before a new employee starts, you need to know they are fit for the role. Our Pre-Employment Test covers everything from the basics to a full toxicology panel, depending on the tier you choose. Every package includes a General Consultation and a Fit-to-Work Form.",
    whoThisIsFor:
        "Businesses, HR departments and employers onboarding new staff.",
    tiers: ["Basic", "Standard", "Standard+", "Deluxe", "Deluxe+"],
    tests: [
        { name: "General Consultation and Report", included: [true, true, true, true, true] },
        { name: "Fit-to-Work Form", included: [true, true, true, true, true] },
        { name: "VDRL (Syphilis)", included: [true, true, true, true, true] },
        { name: "Hepatitis B", included: [true, true, true, true, true] },
        { name: "HIV Screening", included: [true, true, true, true, true] },
        { name: "X-Ray Chest", included: [true, true, true, true, true] },
        { name: "Serum Tuberculosis (TB)", included: [true, true, true, true, true] },
        { name: "Pregnancy Test", included: [true, true, true, true, true] },
        { name: "HB Genotype", included: [false, true, true, true, true] },
        { name: "CBC (Complete Blood Count)", included: [false, true, true, true, true] },
        { name: "Urinalysis", included: [false, false, true, true, true] },
        { name: "Hepatitis C", included: [false, false, true, true, true] },
        { name: "ECG", included: [false, false, false, true, true] },
        { name: "Blood Sugar", included: [false, false, false, true, true] },
        { name: "Stool Microscopy", included: [false, false, false, true, true] },
        { name: "Visual Acuity Test", included: [false, false, false, false, true] },
        { name: "Blood Group", included: [false, false, false, false, true] },
        { name: "Toxicology (Drug Abuse Panel)", included: [false, false, false, false, false] },
    ],
    pricing: [
        { tier: "Basic", male: "\u20a645,000", female: "\u20a650,000" },
        { tier: "Standard", male: "\u20a665,000", female: "\u20a670,000" },
        { tier: "Standard+", male: "\u20a685,000", female: "\u20a690,000" },
        { tier: "Deluxe", male: "\u20a6115,000", female: "\u20a6120,000" },
        { tier: "Deluxe+", male: "\u20a6125,000", female: "\u20a6130,000" },
        { tier: "Premium", male: "\u20a6155,000", female: "\u20a6190,000" },
    ],
    footerNote: "Fit-to-Work Form is included free in all tiers.",
    ctaLabel: "Book Pre-Employment Screening",
    headingTone: "red",
    pricingTone: "green",
};

export const DOMESTIC_STAFF: ScreeningPackageData = {
    slug: "domestic-staff",
    headline: "Know who you are bringing to your home.",
    body:
        "Hiring a driver, nanny, cook or guard is a decision that deserves proper due diligence. Our Domestic Staff Screening gives you the health information you need before they start.",
    whoThisIsFor:
        "Homeowners and families hiring domestic workers in Lagos.",
    tiers: ["Basic", "Standard", "Standard+", "Deluxe", "Premium"],
    tests: [
        { name: "Hepatitis B", included: [true, true, true, true, true] },
        { name: "HIV", included: [true, true, true, true, true] },
        { name: "Serum TB", included: [true, true, true, true, true] },
        { name: "H. pylori", included: [true, true, true, true, true] },
        { name: "X-ray (Chest)", included: [true, true, true, true, true] },
        { name: "Urinalysis", included: [true, true, true, true, true] },
        { name: "Malaria Parasite", included: [true, true, true, true, true] },
        { name: "CBC (Complete Blood Count)", included: [true, true, true, true, true] },
        { name: "Pregnancy Test", included: [false, true, true, true, true] },
        { name: "Abdomino-Pelvic Scan", included: [false, true, true, true, true] },
        { name: "VDRL (Syphilis)", included: [false, false, true, true, true] },
        { name: "Blood Group", included: [false, false, false, true, true] },
        { name: "Genotype", included: [false, false, false, false, true] },
        { name: "Hepatitis C", included: [false, false, false, false, true] },
    ],
    pricing: [
        { tier: "Basic", male: "\u20a643,000", female: "\u20a643,000" },
        { tier: "Standard", male: "\u20a663,000", female: "\u20a668,000" },
        { tier: "Standard+", male: "\u20a668,000", female: "\u20a673,000" },
        { tier: "Deluxe", male: "\u20a670,000", female: "\u20a675,000" },
        { tier: "Premium", male: "\u20a681,000", female: "\u20a686,000" },
    ],
    footerNote:
        "Male pricing is lower in Standard and above due to exclusion of Abdomino-Pelvic Scan.",
    ctaLabel: "Book Domestic Staff Screening",
    // headingTone defaults to "green", pricingTone defaults to "red"
};

export const FOOD_HANDLERS: ScreeningPackageData = {
    slug: "food-handlers",
    headline: "Keep your kitchen and your customers safe.",
    body:
        "Food handlers in Nigeria are required to hold valid health certifications. Our Food Handlers Test covers all the necessary checks and provides the documentation your business needs. A Fit-to-Work Form is included free from Standard+ upward.",
    whoThisIsFor:
        "Restaurants, hotels, catering businesses and any establishment employing food handlers.",
    tiers: ["Basic", "Standard", "Standard+", "Deluxe", "Deluxe+", "Premium"],
    tests: [
        { name: "VDRL (Syphilis)", included: [true, true, true, true, true, true] },
        {
            name: "Stool Microscopy (including Typhoid)",
            included: [true, true, true, true, true, true],
        },
        { name: "Urinalysis", included: [true, true, true, true, true, true] },
        { name: "Hepatitis B", included: [true, true, true, true, true, true] },
        { name: "HIV Screening", included: [true, true, true, true, true, true] },
        { name: "X-Ray Chest", included: [true, true, true, true, true, true] },
        // Basic gets Serum TB; higher tiers get Sputum Microscopy instead.
        {
            name: "Serum Tuberculosis (TB)",
            included: [true, false, false, false, false, false],
        },
        {
            name: "Sputum Microscopy",
            included: [false, true, true, true, true, true],
        },
        { name: "Pregnancy Test", included: [false, true, true, true, true, true] },
        {
            name: "General Consultation and Report",
            included: [false, false, true, true, true, true],
        },
        { name: "Fit-to-Work Form", included: [false, false, true, true, true, true] },
        // Blood Group / Blood Sugar / Hep C skip the Deluxe+ tier — matches design.
        { name: "Blood Group", included: [false, false, false, true, false, true] },
        { name: "Blood Sugar", included: [false, false, false, true, false, true] },
        { name: "Hepatitis C", included: [false, false, false, true, false, true] },
        {
            name: "Toxicology (Drug Abuse Panel)",
            included: [false, false, false, false, true, true],
        },
    ],
    pricing: [
        { tier: "Basic", male: "\u20a650,000", female: "\u20a650,000" },
        { tier: "Standard", male: "\u20a665,000", female: "\u20a670,000" },
        { tier: "Standard+", male: "\u20a685,000", female: "\u20a690,000" },
        { tier: "Deluxe", male: "\u20a695,000", female: "\u20a6100,000" },
        { tier: "Deluxe+", male: "\u20a6105,000", female: "\u20a6110,000" },
        { tier: "Premium", male: "\u20a6125,000", female: "\u20a6130,000" },
    ],
    footerNote: "Fit-to-Work Form is included free from Standard+ upward.",
    ctaLabel: "Book Food Handlers Test",
    headingTone: "red",
    pricingTone: "green",
};