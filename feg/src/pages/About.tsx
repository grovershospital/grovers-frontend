import Hero from "../components/about/Hero.tsx";
import Founders from "../components/about/Founders.tsx";
import VictoriaIsland from "../components/about/VictoriaIsland.tsx";
import Principles from "../components/about/Principles.tsx";
import Team from "../components/about/Team.tsx";

export default function About() {
    return (
        <>
            <Hero/>
            <Founders/>
            <VictoriaIsland/>
            <Principles />
            <Team />
        </>
    )
}