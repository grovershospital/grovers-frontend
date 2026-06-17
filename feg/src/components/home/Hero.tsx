import {Button} from "../../ui/Button"
import heroBg from "../../assets/heroBg.png"

export function Hero() {
    return (
        <section className={'relative isolate overflow-hidden'}>
            {/*    Background photo + dark overlay for legible white text*/}
            <div className={'absolute inset-0 -z-10'}>
                <img src={heroBg} alt="" className="h-full w-full object-cover" aria-hidden={'true'}/>
                <div className={'absolute inset-0 bg-brand-ink/45'}/>
            </div>

            <div className={'mx-auto flex max-w-content flex-col items-center px-4 py-20 text-center ' +
                'text-white md:px-8 md:py-28 lg:py-36'}>
                <p className={'mb-4 text-xs font-medium tracking wide text-white/80'}>
                    Victoria Island, Lagos. Since 2017
                </p>

                <h1 className={'max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl'}>
                    Your first choice for preventive care and well-being for the whole family.
                </h1>

                <p className={'mt-6 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base'}>
                    Grover's Hospital is a private hospital in Victoria Island, Lagos, caring for
                    families, professionals, and communities since 2017. We are built around one idea:
                    that good healthcare should get ahead of illness, not just respond to it. Nineteen
                    specialist clinics, a 24/7 ICU and NICU, and a team that genuinely takes the time to
                    treat you well.
                </p>

                <div className={'mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center'}>
                    <Button href={'/patient-portal/login'} variant={"primary"}>
                        Book an appointment
                    </Button>
                    <Button href={'/contact'} variant={'light'}>
                        Call Us
                    </Button>
                </div>
            </div>
        </section>
    )
}