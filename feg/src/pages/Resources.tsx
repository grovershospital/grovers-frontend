import Hero from "../components/resources/Hero";
import FeaturedArticle from "../components/resources/FeaturedArticle.tsx";
import AllArticles from "../components/resources/AllArticles.tsx";
import ConsultationCTA from "../components/resources/ConsulationCTA.tsx";
import {Contact} from '../components/shared/Contact.tsx'
import {Helmet} from "react-helmet-async";

export default function Resources() {
    return (
        <>
            <Helmet>
                <title>Grover's Hospital — Resources | Health Articles</title>
                <meta
                    name="description"
                    content="Private hospital in Victoria Island, Lagos. Annual wellness screening, pre-employment medical tests, corporate health services and more."
                />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Grover's Hospital — Private Healthcare in Victoria Island, Lagos" />
                <meta property="og:description" content="Resources, vast array of health articles for health living" />
                <meta property="og:image" content="https://YOUR-DOMAIN.com/og-image.png" />
                <meta property="og:url" content="https://YOUR-DOMAIN.com/" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Grover's Hospital — Private Healthcare in Victoria Island, Lagos" />
                <meta name="twitter:description" content="Private hospital in Victoria Island, Lagos. Annual wellness screening, pre-employment medical tests, corporate health services and more." />
                <meta name="twitter:image" content="https://YOUR-DOMAIN.com/og-image.png" />
            </Helmet>
            <Hero/>
            <FeaturedArticle/>
            <AllArticles/>
            <ConsultationCTA/>
            <Contact/>
        </>
    );
}