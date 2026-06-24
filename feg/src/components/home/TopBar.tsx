import phonelogoheader from '../../assets/phonelogoheader.png'
import clockheader from '../../assets/clockheader.png'
import topbarLabacare from '../../assets/topbarLabacare.png'
import emergencylogo from '../../assets/emergencylogo.png'

export function TopBar() {
    return (
        <div className={"w-full bg-brand-blue text-white"}>
            <div
                className={'mx-auto flex max-w-content items-center justify-end gap-6 px-4 py-2 text-[11px] md:px-8'}>
                {/*{Mobile: just the emergency line}*/}
                <p className={"flex items-center gap-1.5 md:hidden"}>
                    <img src={phonelogoheader} alt="" className={'h-3.5 w-3.5'}/>
                    <span className={'font-bold'}>Emergency:</span> 0902 201 2109
                </p>

                {/* General Hours  */}
                <div className={'hidden items-center gap-2 md:flex'}>
                    <img src={clockheader} alt="" className={'h-4 w-4 shrink-0'}/>
                    <div className={'leading-tight'}>
                        <p className={'font-bold'}>General Hours</p>
                        <p className={'opacity-90'}>Mon - Sun 8 AM</p>
                    </div>
                </div>

                {/* Emergency Line */}
                <div className="hidden items-center gap-2 md:flex">
                    <img src={phonelogoheader} alt=""/>
                    <div className="leading-tight">
                        <p className="font-bold">Emergency Line</p>
                        <a href="tel:09022012109" className="underline opacity-90">
                            0902 201 2109
                        </a>
                    </div>
                </div>

                {/* Emergency Pharmacy | Laboratory with 24HRS badge */}
                <div className="hidden items-center gap-2 md:flex">
                    <img src={emergencylogo} alt=""/>
                    <div className="leading-tight">
                        <p className="font-bold">Emergency</p>
                        <p className="opacity-90">Pharmacy | Laboratory</p>
                    </div>
                </div>

                <img src={topbarLabacare} alt="Operated by LABARCare" className={'h-7 w-auto'}/>
            </div>
        </div>
    )
}