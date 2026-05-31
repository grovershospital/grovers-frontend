import Hero from "../components/resources/Hero";
import FeaturedArticle from "../components/resources/FeaturedArticle.tsx";
import AllArticles from "../components/resources/AllArticles.tsx";
import ConsultationCTA from "../components/resources/ConsulationCTA.tsx";
import {Contact} from '../components/shared/Contact.tsx'

export default function Resources() {
    return (
        <>
            <Hero/>
            <FeaturedArticle/>
            <AllArticles/>
            <ConsultationCTA/>
            <Contact/>
        </>
    );
}