import { Lock } from "lucide-react";
import { Button } from "../ui/Button";
import landingPageImage from "../assets/landingPageImage.jpg";

export default function PatientPortal() {
    return (
        <section
            id="patient-portal"
            className="bg-[#f9f7f0] py-12 sm:py-16 lg:py-15"
            aria-labelledby="patient-portal-heading"
        >
            <div className="mx-auto w-full max-w-5xl px-6 lg:px-10">
                {/* Photo card — rounded corners, slightly wider than tall. */}
                {/* aspect-[5/2] matches the design's proportions. */}
                <img
                    src={landingPageImage}
                    alt="A Grover's pediatrician examining a young patient with their parent"
                    className="block aspect-[5/2] w-full rounded-[2rem] object-cover"
                />

                {/* Centered content below the photo. */}
                <div className="mt-10 text-center sm:mt-14">
                    <h1
                        id="patient-portal-heading"
                        className="text-3xl font-extrabold leading-tight tracking-tight text-brand-red sm:text-4xl lg:text-5xl"
                    >
                        Your health, in your hands.
                    </h1>

                    <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-brand-ink sm:text-lg">
                        Book appointments, view your lab results, access your medical
                        history and stay connected with your care team. All in one place.
                    </p>

                    {/* Two CTAs side-by-side, centered. flex-wrap so they stack on */}
                    {/* very narrow screens if needed. */}
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Button variant="primary" href="/patient-portal/login" className={'px-8'}>
                            Login
                        </Button>
                        <Button variant="green" href="/patient-portal/signup">
                            Sign Up
                        </Button>
                    </div>

                    {/* Security footer note — small, gray, with lock icon. */}
                    {/* Two lines stacked vertically (flex-col) so the lock + SSL line */}
                    {/* reads as one unit and the data protection notice as another. */}
                    <div className="mt-12 flex flex-col items-center gap-1 text-xs text-brand-ink/70">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />
              Secured with SSL encryption
            </span>
                        <span>
              Your data is protected under the Nigeria Data Protection Act 2023
            </span>
                    </div>
                </div>
            </div>
        </section>
    );
}