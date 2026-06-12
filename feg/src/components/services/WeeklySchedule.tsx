type DayColor = "red" | "green" | "blue";
type DayGroup = {
    day: string;
    color: DayColor;
    entries: ReadonlyArray<readonly [string, string]>; // [department, hours]
};

// Schedule is structured as blocks. Each block is one or more days that
// render fused together (no gap between them). The inter-block gap is
// applied by the parent's space-y. Most blocks hold one day; the weekend
// block holds Saturday + Sunday so they share a continuous blue column.
const SCHEDULE: ReadonlyArray<ReadonlyArray<DayGroup>> = [
    [
        {
            day: "Monday",
            color: "red",
            entries: [
                ["Family Medicine", "11:00 AM to 5:00 PM"],
                ["Internal Medicine", "11:00 AM to 1:00 PM"],
                ["Obstetrics and Gynaecology", "3:00 PM to 8:00 PM"],
                ["Gastroenterology", "2:00 PM to 5:00 PM"],
                ["Physiotherapy", "9:00 AM to 4:00 PM"],
            ],
        },
    ],
    [
        {
            day: "Tuesday",
            color: "green",
            entries: [
                ["General Surgery", "10:00 AM to 2:00 PM"],
                ["Nephrology", "9:00 AM to 12:00 PM"],
                ["Obstetrics and Gynaecology", "3:00 PM to 8:00 PM"],
                ["Paediatrics", "3:00 PM to 6:00 PM"],
                ["Neurology", "3:00 PM to 6:00 PM"],
                ["Cardiology", "3:00 PM to 6:00 PM"],
                ["Endocrinology", "11:00 AM to 2:00 PM"],
                ["Physiotherapy", "9:00 AM to 4:00 PM"],
            ],
        },
    ],
    [
        {
            day: "Wednesday",
            color: "blue",
            entries: [
                ["Family Medicine", "11:00 AM to 5:00 PM"],
                ["Internal Medicine", "11:00 AM to 5:00 PM"],
                ["Mental Health Clinic", "10:00 AM to 1:00 PM"],
                ["ENT (Ear, Nose and Throat)", "2:00 PM to 6:00 PM"],
                ["Dermatology", "10:00 AM to 1:00 PM"],
                ["Physiotherapy", "9:00 AM to 4:00 PM"],
            ],
        },
    ],
    [
        {
            day: "Thursday",
            color: "red",
            entries: [
                ["Obstetrics and Gynaecology", "11:00 AM to 3:00 PM"],
                ["Orthopaedic Surgery", "1:00 PM to 6:00 PM"],
                ["Endocrinology", "11:00 AM to 2:00 PM"],
                ["Dietician", "9:00 AM to 1:00 PM"],
                ["Physiotherapy", "9:00 AM to 4:00 PM"],
            ],
        },
    ],
    [
        {
            day: "Friday",
            color: "green",
            entries: [
                ["Family Medicine", "11:00 AM to 5:00 PM"],
                ["Internal Medicine", "11:00 AM to 5:00 PM"],
                ["Urology", "9:00 AM to 2:00 PM"],
                ["Physiotherapy", "9:00 AM to 4:00 PM"],
            ],
        },
    ],
    // Weekend block — Saturday + Sunday fused.
    [
        {
            day: "Saturday",
            color: "blue",
            entries: [
                ["Physiotherapy", "9:00 AM to 3:00 PM"],
                ["Hematology", "11:00 AM to 2:00 PM"],
            ],
        },
        {
            day: "Sunday",
            color: "blue",
            entries: [["Psychiatry", "3:00 PM to 6:00 PM"]],
        },
    ],
];

const COLOR_BG: Record<DayColor, string> = {
    red: "bg-brand-red",
    green: "bg-brand-green",
    blue: "bg-brand-blue",
};

const DEPARTMENT_LINKS: Record<string, string> = {
    "Family Medicine": "family-medicine",
    "Internal Medicine": "internal-medicine",
    "Obstetrics and Gynaecology": "obgyn",
    "Gastroenterology": "gastroenterology",
    "Physiotherapy": "physiotherapy",

    "General Surgery": "general-surgery",
    "Nephrology": "nephrology",
    "Paediatrics": "paediatrics",
    "Neurology": "neurology",
    "Cardiology": "cardiology",
    "Endocrinology": "endocrinology",

    "Mental Health Clinic": "mental-health",
    "ENT (Ear, Nose and Throat)": "ent",
    "Dermatology": "dermatology",

    "Orthopaedic Surgery": "orthopaedic-surgery",
    "Dietician": "dietician",

    "Urology": "urology",

    "Hematology": "hematology",

    "Psychiatry": "psychiatry",
};

function scrollToDepartment(slug: string) {
    document
        .getElementById(slug)
        ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
}

function DayRow({day, color, entries}: DayGroup) {
    return (
        <div className="flex flex-col lg:flex-row">
            {/* Colored day band — full-width on mobile, left column on desktop. */}
            <div
                className={`${COLOR_BG[color]} px-6 py-3 lg:w-1/3 lg:px-6 lg:py-4`}
            >
                <span className="text-base font-extrabold text-white">{day}</span>
            </div>

            {/* Entries — white block, subtle row dividers. */}
            <div className="divide-y divide-neutral-100 bg-white lg:w-2/3">
                {entries.map(([dept, hours]) => (
                    <div
                        key={dept}
                        className="grid grid-cols-2 gap-4 px-6 py-3 text-xs text-brand-ink sm:text-sm"
                    >
                        {DEPARTMENT_LINKS[dept] ? (
                            <button
                                type="button"
                                onClick={() =>
                                    scrollToDepartment(DEPARTMENT_LINKS[dept])
                                }
                                className="text-left cursor-pointer font-medium text-brand-green transition-colors  hover:underline"
                            >
                                {dept}
                            </button>
                        ) : (
                            <span>{dept}</span>
                        )}

                        <span>{hours}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default function WeeklySchedule() {
    return (
        <section
            id="weekly-schedule"
            className="bg-black py-12 sm:py-16 lg:py-20"
            aria-labelledby="weekly-schedule-heading"
        >
            <h2 id="weekly-schedule-heading" className="sr-only">
                Weekly clinic schedule
            </h2>

            <div className="mx-auto w-full max-w-content px-4 sm:px-6 lg:px-10">
                {/* space-y-4 = larger gap BETWEEN blocks. Inside a block, days */}
                {/* render with no gap (the header sits flush with Monday, and */}
                {/* Saturday sits flush with Sunday). */}
                <div className="space-y-4">
                    {SCHEDULE.map((block, blockIndex) => (
                        <div key={block[0].day}>
                            {/* Header sits inside the first block, flush above Monday */}
                            {/* so the red flows continuously. Desktop only. */}
                            {blockIndex === 0 && (
                                <div className="hidden lg:flex">
                                    <div className="w-1/3 bg-brand-red px-6 py-3">
                    <span className="text-xs font-bold uppercase tracking-wide text-white">
                      Day
                    </span>
                                    </div>
                                    <div className="grid w-2/3 grid-cols-2 bg-brand-red px-6 py-3">
                    <span className="text-xs font-bold uppercase tracking-wide text-white">
                      Department
                    </span>
                                        <span className="text-xs font-bold uppercase tracking-wide text-white">
                      Hours
                    </span>
                                    </div>
                                </div>
                            )}

                            {block.map((day) => (
                                <DayRow key={day.day} {...day} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}