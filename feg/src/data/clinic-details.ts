export type ClinicBodyParagraph =
    | string
    | { prefix: string; text: string };

export type ClinicDetail = {
    slug: string;
    name: string;
    headline: string;
    schedule: ReadonlyArray<{ days: string; hours: string }>;
    body: ReadonlyArray<ClinicBodyParagraph>;
    whatWeCover: ReadonlyArray<string>;
    whatToExpect: string;
    image: string;
    imagePosition: "left" | "right";
};

export const CLINIC_DETAILS: ReadonlyArray<ClinicDetail> = [
    {
        slug: "obgyn",
        name: "OBSTETRICS AND GYNAECOLOGY",
        headline:
            "Full women’s health care, from adolescence through menopause.",
        schedule: [
            { days: "Monday", hours: "3:00 PM to 8:00 PM" },
            { days: "Thursday", hours: "11:00 AM to 3:00 PM" },
        ],
        body: [
            "Our Obstetrics and Gynaecology department provides comprehensive care for women at every stage of life. Whether you are planning a pregnancy, currently expecting, managing a gynaecological condition or navigating menopause, our consultant is here with the expertise and the time you need.",
            "We run a highly regarded Ante-Natal Clinic that provides meticulous care and monitoring throughout pregnancy. We support all types of deliveries including complex C-sections, performed by experienced consultants in our fully equipped surgical theatre. Our focus is always on creating a safe, supported and positive experience for every patient.",
        ],
        whatWeCover: [
            "Ante-Natal care and monitoring throughout pregnancy",
            "All delivery types including complex C-sections",
            "Post-natal care and recovery",
            "Cervical and breast cancer screening",
            "Family planning and contraception counselling",
            "Pre-conception planning and fertility advice",
            "Management of PCOS, uterine fibroids and endometriosis",
            "Menstrual disorder management",
            "Menopausal symptom management",
            "Pelvic pain and urogynaecological care",
            "Infertility assessments and management",
        ],
        whatToExpect:
            "Your first consultation will include a full gynaecological history, examination and a discussion of your concerns and treatment options. Ante-natal patients will receive a structured care plan from their first visit through to delivery and beyond.",
        image: "obgyn.jpg",
        imagePosition: "left",
    },
    {
        slug: "paediatrics",
        name: "PAEDIATRICS",
        headline: "Specialist care for every child, at every stage.",
        schedule: [{ days: "Tuesday", hours: "3:00 PM to 6:00 PM" }],
        body: [
            "Children need care that is not just clinically excellent but delivered with patience, warmth and an understanding of how children and families actually experience illness. Our Paediatrics department is dedicated to the health of infants, children and adolescents, treating both common and complex conditions with the same level of attention and care.",
            "Beyond treating illness, we focus heavily on prevention. We run essential childhood immunisation programs and place a strong emphasis on developmental milestone monitoring and nutritional guidance, ensuring every child gets the best possible start.",
        ],
        whatWeCover: [
            "Childhood illnesses including fever, infections, respiratory conditions and diarrhoea",
            "Childhood immunisation programs",
            "Developmental milestone monitoring",
            "Nutritional guidance and counselling",
            "Well-child check-ups and growth monitoring",
            "Pre-school medical screening",
            "Support for critically ill infants including NICU coordination",
        ],
        whatToExpect:
            "Our paediatrician will conduct a thorough examination of your child, discuss their development and health history with you, and provide clear guidance on treatment or preventive care. Parents are always welcome and fully included in the consultation.",
        image: "paediatrics.png",
        imagePosition: "right",
    },
    {
        slug: "family-medicine",
        name: "FAMILY MEDICINE",
        headline: "Your primary doctor for everything.",
        schedule: [
            { days: "Monday", hours: "11:00 AM to 1:00 PM" },
            { days: "Wednesday and Friday", hours: "11:00 AM to 5:00 PM" },
        ],
        body: [
            "The Family Medicine department is the first point of contact for most patients at Grover’s Hospital. Our physicians take the time to understand your full health picture before making any decisions. We manage a wide range of conditions across all age groups, with a particular focus on lifestyle diseases that are increasingly common across Lagos. We do not just treat you when you are unwell. We partner with you to stay well.",
            "A visit to our Family Medicine clinic might involve a routine check-up, a consultation for an ongoing condition, a request for a referral to a specialist, or simply a conversation about your health and how to protect it. Whatever brings you in, you will leave with clarity.",
        ],
        whatWeCover: [
            "Hypertension, diabetes, high cholesterol and obesity management",
            "Acute illnesses including fever, infections and respiratory conditions",
            "Chronic disease monitoring and lifestyle modification",
            "Routine health check-ups and preventive care",
            "Coordination of specialist referrals across all 19 departments",
            "Health promotion and wellness counselling",
            "Medical reports and documentation",
        ],
        whatToExpect:
            "Your physician will take a full medical history, conduct a thorough examination and discuss your results and next steps clearly. If you need to see a specialist, we coordinate that directly from within the hospital.",
        image: "family-medicine.jpg",
        imagePosition: "left",
    },
    {
        slug: "internal-medicine",
        name: "INTERNAL MEDICINE",
        headline: "Advanced management of complex adult conditions.",
        schedule: [
            { days: "Monday", hours: "11:00 AM to 1:00 PM" },
            { days: "Wednesday and Friday", hours: "11:00 AM to 5:00 PM" },
        ],
        body: [
            "Internal Medicine at Grover’s Hospital is where complex, chronic and multi-system conditions are properly investigated and managed. Our physicians take a thorough, investigative approach to conditions that require more than a routine consultation. Nothing is rushed. Every aspect of your health is considered.",
            "This department is particularly important for patients managing lifestyle-related diseases, which are among the most prevalent health challenges facing Lagos adults today. If you have been living with a condition that has not been fully controlled elsewhere, our Internal Medicine team will take the time to understand why and build a better management plan.",
        ],
        whatWeCover: [
            "Diabetes mellitus management",
            "Hypertension and cardiovascular risk management",
            "Asthma and COPD",
            "Chronic kidney disease monitoring",
            "HIV and AIDS clinical management",
            "Rheumatoid arthritis and autoimmune disease management",
            "High cholesterol and lipid disorders",
            "Complex or unexplained prolonged illness",
            "Routine adult screening and physical examinations",
        ],
        whatToExpect:
            "Your physician will take a detailed medical history, review any existing results and conduct a thorough examination. A structured management plan will be agreed with you before you leave, and follow-up appointments will be scheduled as needed.",
        image: "internal-medicine.jpg",
        imagePosition: "right",
    },
    {
        slug: "cardiology",
        name: "CARDIOLOGY",
        headline: "Your heart health, in expert hands.",
        schedule: [{ days: "Thursday", hours: "3:00 PM to 6:00 PM" }],
        body: [
            "Heart disease is one of the leading causes of death in Nigeria and one of the most preventable. Our Cardiology department combines advanced diagnostic technology with personalised, attentive care to assess, manage and treat conditions affecting the heart and cardiovascular system.",
            "Whether you have been referred by another physician, are experiencing symptoms that concern you, or simply want to understand your cardiovascular risk, our cardiology team will give you clear answers and a clear path forward.",
        ],
        whatWeCover: [
            "Diagnosis and management of heart disease and arrhythmias",
            "Hypertension management and cardiovascular risk assessment",
            "Heart failure management",
            "Cholesterol and lipid disorder management",
            "Echocardiography",
            "ECG and Holter ECG monitoring",
            "Stress testing",
            "Cardiac rehabilitation guidance",
            "Personalised treatment plans for long-term heart health",
        ],
        whatToExpect:
            "Your first cardiology consultation will include a full cardiovascular history, examination and relevant diagnostic tests. Results will be discussed with you in full and a management plan tailored to your specific situation will be put in place.",
        image: "cardiology.jpg",
        imagePosition: "left",
    },
    {
        slug: "nephrology",
        name: "NEPHROLOGY",
        headline: "Comprehensive care for every kidney condition.",
        schedule: [{ days: "Tuesday", hours: "9:00 AM to 12:00 PM" }],
        body: [
            "Our Nephrology department provides specialist care for all kidney-related conditions, from early-stage chronic kidney disease to advanced renal failure requiring ongoing dialysis support.",
            "Kidney disease is often detected late because its early stages come without obvious symptoms. If you have been told your kidney function is reduced, if you have persistent high blood pressure, or if you are at risk due to diabetes, a nephrology consultation at Grover’s Hospital is an important next step.",
        ],
        whatWeCover: [
            "Diagnosis and management of chronic kidney disease",
            "Renal failure management",
            "Kidney-related hypertension",
            "Haemodialysis",
            "Peritoneal dialysis",
            "Nephrotic and nephritic syndrome",
            "Electrolyte and fluid balance management",
            "Kidney transplant evaluations and pre and post-transplant care",
            "Patient education on kidney health and long-term disease prevention",
        ],
        whatToExpect:
            "Your nephrologist will conduct a thorough assessment of your kidney function using blood and urine tests, review any existing results and discuss your condition and treatment options clearly. Dialysis patients will be assessed for the most appropriate dialysis modality and scheduled accordingly.",
        image: "nephrology.png",
        imagePosition: "right",
    },
    {
        slug: "urology",
        name: "UROLOGY",
        headline:
            "Specialist care for kidney, bladder and male reproductive health.",
        schedule: [{ days: "Friday", hours: "9:00 AM to 2:00 PM" }],
        body: [
            "Many urological conditions go untreated simply because patients are unsure when to seek help or feel uncomfortable raising the issue. Our Urology department provides a confidential, professional environment where these conditions are addressed with the seriousness and expertise they deserve.",
            {
                prefix: "If you are experiencing any of the following, book a urology consultation:",
                text: "Frequent or urgent urination, pain or burning during urination, blood in urine, a weak urine stream, pain in the side or lower back, erectile dysfunction or concerns about male fertility.",
            },
        ],
        whatWeCover: [
            "Prostate screening including PSA testing, BPH assessment and prostate cancer evaluation",
            "Kidney stone diagnosis and management",
            "Recurrent urinary tract infection diagnosis and treatment",
            "Bladder control issues and urinary incontinence",
            "Erectile dysfunction and male infertility assessment",
            "Kidney and bladder condition management",
            "Urological surgical interventions where required",
        ],
        whatToExpect:
            "Your urologist will take a full history of your symptoms, conduct a relevant examination and arrange any necessary tests. You will leave with a clear diagnosis or investigation plan and a full explanation of your next steps.",
        image: "urology.png",
        imagePosition: "left",
    },
    {
        slug: "orthopaedic-surgery",
        name: "ORTHOPAEDIC SURGERY",
        headline: "Restoring movement and quality of life.",
        schedule: [{ days: "Thursday", hours: "1:00 PM to 6:00 PM" }],
        body: [
            "Our Orthopaedic Surgery department specialises in the diagnosis and treatment of conditions affecting the bones, joints and musculoskeletal system. Whether you are managing chronic joint pain that has been limiting your daily life, recovering from a fracture, or require surgical intervention such as joint replacement, our team is focused on one goal: getting you back to full mobility.",
            "We use advanced surgical techniques including arthroscopy and joint replacement surgery, and work closely with our Physiotherapy department to ensure your recovery is as complete as possible.",
        ],
        whatWeCover: [
            "Hip and knee joint replacement surgery",
            "Fracture fixation and repair",
            "Arthroscopy",
            "Sports injury assessment and management",
            "Spinal condition evaluation and intervention",
            "Chronic joint pain in the knee, hip, shoulder and back",
            "Non-surgical management options including physiotherapy coordination",
            "Post-operative orthopaedic rehabilitation",
        ],
        whatToExpect:
            "Your orthopaedic consultation will begin with a full assessment of your symptoms, relevant imaging and a discussion of both surgical and non-surgical options. If surgery is recommended, the process and recovery timeline will be explained to you clearly before any decision is made.",
        image: "ortho.jpg",
        imagePosition: "right",
    },
    {
        slug: "neurology",
        name: "NEUROLOGY",
        headline: "Expert care for the brain, spine and nervous system.",
        schedule: [{ days: "Tuesday", hours: "3:00 PM to 6:00 PM" }],
        body: [
            "Neurological conditions require careful, specialist attention. Our Neurology department manages a wide range of conditions affecting the brain, spinal cord and peripheral nervous system, with a focus on accurate diagnosis, evidence-based treatment and effective long-term management.",
            "If you have been experiencing unexplained headaches, episodes of weakness or numbness, memory difficulties, seizures or any other neurological symptoms, a neurology consultation is the right step.",
        ],
        whatWeCover: [
            "Stroke assessment and management",
            "Epilepsy and seizure disorder management",
            "Headache and migraine clinics",
            "Parkinson’s disease management",
            "Multiple sclerosis evaluation",
            "Memory disorders and dementia evaluation",
            "Peripheral neuropathy assessment",
            "Neuromuscular condition management",
            "Post-stroke rehabilitation coordination",
        ],
        whatToExpect:
            "Your neurologist will conduct a detailed neurological examination, review any relevant imaging or test results and discuss a diagnosis and management plan with you. Where rehabilitation is needed, this will be coordinated with our Physiotherapy department.",
        image: "neurology.jpg",
        imagePosition: "left",
    },
    {
        slug: "ent",
        name: "ENT (EAR, NOSE AND THROAT)",
        headline: "Hear better. Breathe better. Feel better.",
        schedule: [{ days: "Wednesday", hours: "2:00 PM to 6:00 PM" }],
        body: [
            "Our ENT department provides comprehensive medical and surgical care for conditions affecting the ear, nose, throat and the wider head and neck region. We see both adult and paediatric patients and manage everything from persistent sinus problems and hearing difficulties to complex surgical cases requiring specialist intervention.",
        ],
        whatWeCover: [
            "Hearing loss, ear infections and tinnitus",
            "Chronic sinusitis, nasal polyps and persistent congestion",
            "Tonsil conditions, chronic sore throats and voice problems",
            "Vertigo and balance disorders",
            "Allergy assessment and management",
            "Sleep apnoea evaluation",
            "Head and neck surgical interventions",
            "Audiology services",
        ],
        whatToExpect:
            "Your ENT consultant will conduct a thorough examination of the ear, nose and throat, discuss your symptoms and history, and recommend the most appropriate course of treatment. Surgical cases will be discussed in full before any procedure is planned.",
        image: "ent.jpg",
        imagePosition: "right",
    },
    {
        slug: "endocrinology",
        name: "ENDOCRINOLOGY",
        headline: "Specialist care for hormonal and metabolic conditions.",
        schedule: [{ days: "Tuesday and Thursday", hours: "11:00 AM to 2:00 PM" }],
        body: [
            "The endocrine system controls some of the most important functions in the body, from energy levels and metabolism to reproductive health and bone density. When something goes wrong with this system, the effects can be wide-ranging and easy to miss.",
            "Our Endocrinology department manages the full range of hormonal and metabolic conditions with precision and a thorough understanding of how these conditions interact with the rest of the body.",
        ],
        whatWeCover: [
            "Diabetes mellitus Type 1 and Type 2 including advanced insulin therapy management",
            "Thyroid disorders including hypothyroidism, hyperthyroidism and goitre",
            "Adrenal gland disorders",
            "Pituitary gland conditions",
            "Hormonal imbalance assessment",
            "PCOS endocrine management",
            "Metabolic syndrome management",
            "Obesity and weight management programs",
            "Osteoporosis and bone density assessment",
        ],
        whatToExpect:
            "Your endocrinologist will take a detailed history of your symptoms, arrange relevant hormone and metabolic tests and work with you to build a clear, personalised management plan. Ongoing management will be structured around regular reviews and adjustments as needed.",
        image: "endocrinology.png",
        imagePosition: "left",
    },
    {
        slug: "gastroenterology",
        name: "GASTROENTEROLOGY",
        headline: "Digestive problems are common. Ignoring them is not the answer.",
        schedule: [{ days: "Monday", hours: "2:00 PM to 5:00 PM" }],
        body: [
            "Digestive problems are among the most common health issues affecting Lagos adults and among the most commonly dismissed. From persistent bloating and acid reflux to more complex conditions affecting the liver and bowel, our Gastroenterology department provides expert diagnosis and treatment using advanced endoscopic and investigative techniques.",
        ],
        whatWeCover: [
            "Acid reflux and GERD management",
            "Irritable bowel syndrome management",
            "Inflammatory bowel disease including Crohn’s disease and ulcerative colitis",
            "Liver disease assessment including hepatitis, fatty liver and cirrhosis",
            "H. pylori testing and treatment",
            "Peptic ulcer disease",
            "Gastrointestinal cancer screening",
            "Endoscopy",
            "Colonoscopy",
            "Nutritional assessment for digestive conditions",
        ],
        whatToExpect:
            "Your gastroenterologist will take a thorough history of your digestive symptoms, arrange any necessary tests or imaging and discuss a diagnosis and treatment plan with you. Endoscopy and colonoscopy procedures will be explained in full beforehand and performed in a safe, controlled environment.",
        image: "gastro.png",
        imagePosition: "right",
    },
    {
        slug: "dermatology",
        name: "DERMATOLOGY",
        headline: "Specialist care for skin, hair and nails.",
        schedule: [{ days: "Wednesday", hours: "10:00 AM to 1:00 PM" }],
        body: [
            "Your skin is your largest organ and it deserves proper medical attention, not just cosmetic fixes. Our Dermatology department handles the full spectrum of skin, hair and nail conditions, from everyday concerns like acne and eczema to more complex conditions requiring thorough investigation and specialist management.",
            "Whether you have been dealing with a persistent skin issue that has not responded to over-the-counter treatments, you are concerned about a mole or skin growth, or you are experiencing unexplained hair loss, our dermatologist will give you a proper diagnosis and a treatment plan that works.",
        ],
        whatWeCover: [
            "Acne treatment and management",
            "Eczema and psoriasis management",
            "Skin allergy testing and treatment",
            "Fungal skin infection treatment",
            "Hyperpigmentation and skin tone management",
            "Skin cancer screening and mole assessment",
            "Hair loss and alopecia diagnosis and treatment",
            "Wound care and scar management",
            "Cosmetic dermatology consultations",
        ],
        whatToExpect:
            "Your dermatologist will conduct a thorough examination of the affected area, take a full skin history and recommend a treatment plan. Where further investigation is needed, a biopsy or allergy test may be arranged. All cosmetic consultations are conducted with the same clinical rigour as medical ones.",
        image: "dermatology.jpg",
        imagePosition: "left",
    },
    {
        slug: "physiotherapy",
        name: "PHYSIOTHERAPY",
        headline: "Recovery done properly, every time.",
        schedule: [{ days: "Monday to Friday", hours: "9:00 AM to 4:00 PM" }],
        body: [
            "Physiotherapy at Grover’s Hospital is evidence-based, personalised and focused on results. Whether you are recovering from surgery, managing chronic pain, rebuilding strength and mobility after a serious illness, or dealing with a sports injury, our physiotherapist designs a program built specifically around your body, your condition and your goals.",
            "We work closely with our surgical and medical departments to ensure that physiotherapy is integrated into your overall care plan from the start, not added as an afterthought.",
        ],
        whatWeCover: [
            "Post-surgical rehabilitation especially following orthopaedic and neurosurgical procedures",
            "Chronic pain management",
            "Joint and mobility restoration",
            "Sports injury assessment and recovery",
            "Stroke rehabilitation",
            "Back and neck pain management",
            "Post-ICU physical recovery programs",
            "Therapeutic exercises and manual therapy",
            "Personalised intensive rehabilitation programs",
        ],
        whatToExpect:
            "Your physiotherapist will conduct a full assessment of your movement, strength and functional ability, discuss your goals and design a structured rehabilitation program. Progress is monitored regularly and the program is adjusted as your recovery develops.",
        image: "physiotherapy.jpg",
        imagePosition: "right",
    },
    {
        slug: "hematology",
        name: "HEMATOLOGY",
        headline: "Diagnosis and management of blood disorders.",
        schedule: [{ days: "Saturday", hours: "11:00 AM to 2:00 PM" }],
        body: [
            "Blood disorders affect millions of Nigerians and many go undiagnosed for years. Our Hematology department provides specialist diagnosis and management for the full range of conditions affecting the blood and blood-forming organs.",
            "From sickle cell disease management to the investigation of unexplained anaemia, our team handles every case with thoroughness and care.",
        ],
        whatWeCover: [
            "Sickle cell disease management",
            "Anaemia diagnosis and treatment",
            "Blood clotting disorders including thrombosis and haemophilia",
            "Leukaemia and lymphoma evaluation",
            "Blood transfusion medicine",
            "Bone marrow disorders",
            "Management of haematological conditions in pregnancy",
        ],
        whatToExpect:
            "Your haematologist will take a full blood history, arrange relevant laboratory investigations and discuss your results and management options clearly. Ongoing conditions will be managed with a structured follow-up plan.",
        image: "hematology.png",
        imagePosition: "left",
    },
    {
        slug: "mental-health",
        name: "MENTAL HEALTH CLINIC",
        headline:
            "A dedicated space for your mental and emotional well-being.",
        schedule: [{ days: "Wednesday", hours: "10:00 AM to 1:00 PM" }],
        body: [
            "Mental health is as important as physical health, and at Grover’s Hospital we treat it that way. Our Mental Health Clinic provides a confidential, non-judgemental space for patients dealing with a wide range of mental and emotional health concerns. Whether you are experiencing anxiety, depression, stress-related conditions or something you have not yet been able to name, our team is here to listen, assess and support.",
            "We understand that taking the first step towards mental health support can be difficult. Our clinic is designed to make that step as straightforward and comfortable as possible.",
        ],
        whatWeCover: [
            "Assessment and management of anxiety and depression",
            "Stress-related conditions and burnout",
            "Mood disorders",
            "Behavioural and emotional health concerns",
            "Mental health support for patients managing chronic illness",
            "Referral and coordination with specialist psychiatric care where needed",
        ],
        whatToExpect:
            "Your first consultation is a conversation. Your clinician will take time to understand your concerns, your history and what support you are looking for. Everything discussed is strictly confidential.",
        image: "mental-health.jpg",
        imagePosition: "right",
    },
    {
        slug: "psychiatry",
        name: "PSYCHIATRY",
        headline: "Psychiatric care for mental health conditions.",
        schedule: [{ days: "Sunday", hours: "3:00 PM to 6:00 PM" }],
        body: [
            "Our Psychiatry department provides specialist assessment and management for patients with more complex mental health needs. Working closely with our Mental Health Clinic, our psychiatrist offers a higher level of clinical intervention for conditions that require specialist psychiatric expertise.",
            "Psychiatric care at Grover’s Hospital is delivered with the same confidentiality, dignity and respect that underpins all of our clinical work. You will not be judged. You will be heard.",
        ],
        whatWeCover: [
            "Diagnosis and management of complex psychiatric conditions",
            "Mood and personality disorders",
            "Psychotic disorders including schizophrenia",
            "Psychiatric assessment and medication management",
            "Coordination with our Mental Health Clinic and primary care teams",
        ],
        whatToExpect:
            "Psychiatric consultations are thorough and unhurried. Your psychiatrist will conduct a full mental health assessment and work with you to develop a management plan that fits your needs and your life.",
        image: "psychiatry.jpg",
        imagePosition: "left",
    },
    {
        slug: "dietician",
        name: "DIETICIAN",
        headline: "Expert nutritional guidance for better health outcomes.",
        schedule: [{ days: "Thursday", hours: "9:00 AM to 1:00 PM" }],
        body: [
            "Good nutrition is one of the most powerful tools in managing and preventing chronic disease. Our Dietician works with patients across all departments to develop personalised nutritional plans that support their health goals, whether that is managing diabetes, losing weight, recovering from surgery or simply building better eating habits for long-term well-being.",
            "Nutrition is rarely one-size-fits-all. Our Dietician takes the time to understand your health history, your lifestyle and your goals before developing a plan that is practical and sustainable for you specifically.",
        ],
        whatWeCover: [
            "Nutritional assessment and personalised dietary planning",
            "Dietary management of diabetes, hypertension and heart disease",
            "Weight management programs",
            "Nutritional support for post-surgical recovery",
            "Eating guidance for digestive conditions",
            "Nutritional counselling for chronic disease management",
        ],
        whatToExpect:
            "Your dietician will take a full dietary and health history, assess your current nutritional status and develop a practical, personalised plan that works for your lifestyle and your health needs. Follow-up sessions are available to track progress and adjust the plan as needed.",
        image: "dietician.jpg",
        imagePosition: "right",
    },
    {
        slug: "general-surgery",
        name: "GENERAL SURGERY",
        headline: "Essential surgical procedures, done with precision.",
        schedule: [{ days: "Tuesday", hours: "10:00 AM to 2:00 PM" }],
        body: [
            "All surgical procedures at Grover’s Hospital are performed in our Standard Surgical Theatre, which is continuously updated with the latest monitoring and instrumentation and meets stringent international standards.",
            "Our surgical team focuses not just on the procedure itself but on your comfort, safety and speed of recovery throughout the entire process.",
        ],
        whatWeCover: [
            "Hernia repair including inguinal, umbilical and femoral",
            "Appendectomy",
            "Cholecystectomy (gallbladder removal)",
            "Wound care and abscess drainage",
            "Soft tissue tumour removal",
            "Other general surgical interventions",
        ],
        whatToExpect:
            "Your surgical consultation will include a full assessment of your condition, a discussion of the recommended procedure and what to expect before, during and after surgery. Post-operative care is taken seriously at Grover’s and your recovery will be monitored closely.",
        image: "general-surgery.jpg",
        imagePosition: "left",
    },
];