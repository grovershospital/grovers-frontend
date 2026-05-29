const photos = import.meta.glob<{ default: string }>(
    "../../assets/about-page/team/*.{jpg,jpeg,png,webp}",
    { eager: true }
);
const photoByFile: Record<string, string> = {};
for (const [path, mod] of Object.entries(photos)) {
    const file = path.split("/").pop()!;
    photoByFile[file] = mod.default;
}

type Member = {
    name: string;
    role: string;
    bio: string;
    photo: string;
};

const FOUNDERS: readonly Member[] = [
    {
        name: "Chief Dr. Anil Grover",
        role: "Founder and Chairman",
        bio: "Over two decades of experience in the Nigerian healthcare sector. The vision behind Grover\u2019s Hospital.",
        photo: "anilGrover.jpg",
    },
    {
        name: "Dr. Arvinder Grover",
        role: "Co-Founder",
        bio: "A driving force behind the hospital\u2019s patient-centred approach and its focus on preventive care.",
        photo: "arvinder-grover.png",
    },
];

const LEADERSHIP: readonly Member[] = [
    {
        name: "Dr. Solomon Awoyemi",
        role: "Consultant Head of Medical Services / Family Medicine",
        bio: "The cornerstone of primary care at Grover\u2019s. Focused on long-term patient health management and continuity of care.",
        photo: "solomon-awoyemi.jpg",
    },
    {
        name: "Dr. Kolawole Sonubi",
        role: "Head of Medical Operations",
        bio: "Leads clinical operations across all 19 departments and ensures the highest standards of care are maintained throughout the hospital.",
        photo: "kolawole-sonubi.jpg",
    },
];

const SPECIALISTS: readonly Member[] = [
    {
        name: "Dr. Sofiat Yusuf",
        role: "OB/GYN Consultant",
        bio: "Expert care in women\u2019s health and obstetrics, from antenatal care to complex gynaecological conditions.",
        photo: "sofiat-yusuf.jpg",
    },
    {
        name: "Odutola-Oyewo Oluwatomi R.T",
        role: "Consultant Urologist",
        bio: "Visiting specialist providing dedicated urological care for kidney, bladder and male reproductive health.",
        photo: "odutola-oyewo.jpg",
    },
    {
        name: "PT. Peace Wuraola Ajayi",
        role: "Physiotherapist",
        bio: "Evidence-based rehabilitation programs for recovery, mobility and chronic pain management.",
        photo: "peace-wuraola.png",
    },
];

function MemberCard({ member }: { member: Member }) {
    const src = photoByFile[member.photo];
    return (
        <li className="flex flex-col items-center text-center">
            <div className="aspect-square w-32 overflow-hidden rounded-full bg-neutral-200 sm:w-36 lg:w-40">
                {src ? (
                    <img
                        src={src}
                        alt={member.name}
                        className="block h-full w-full object-cover"
                    />
                ) : null}
            </div>
            <h3 className="mt-5 text-base font-extrabold text-brand-ink">
                {member.name}
            </h3>
            <p className="mt-1 max-w-[14rem] text-sm font-bold text-brand-green">
                {member.role}
            </p>
            <p className="mt-3 max-w-[14rem] text-xs leading-relaxed text-brand-ink/80">
                {member.bio}
            </p>
        </li>
    );
}

export default function Team() {
    return (
        <section
            id="team"
            className="bg-[#f9f7f0] py-16 sm:py-20 lg:py-24"
            aria-labelledby="team-heading"
        >
            <div className="mx-auto w-full max-w-content px-6 lg:px-10">
                {/* Heading + intro */}
                <h2
                    id="team-heading"
                    className="mx-auto max-w-2xl text-center text-3xl font-extrabold leading-tight text-brand-red sm:text-4xl"
                >
                    Led by experienced professionals who genuinely care.
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-brand-ink sm:text-base">
                    Our clinical strength comes from the people who show up every day. A
                    mix of highly trained Nigerian consultants and visiting specialists,
                    guided by a leadership team with deep roots in Nigerian healthcare.
                </p>

                {/* Tier 1 — Founders (2-up, centered) */}
                <ul className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-10">
                    {FOUNDERS.map((m) => (
                        <MemberCard key={m.name} member={m} />
                    ))}
                </ul>

                {/* Tier 2 — Leadership (2-up, centered) */}
                <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-10">
                    {LEADERSHIP.map((m) => (
                        <MemberCard key={m.name} member={m} />
                    ))}
                </ul>

                {/* Tier 3 — Specialists (3-up) */}
                <ul className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
                    {SPECIALISTS.map((m) => (
                        <MemberCard key={m.name} member={m} />
                    ))}
                </ul>
            </div>
        </section>
    );
}