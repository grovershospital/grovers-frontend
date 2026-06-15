import {Outlet} from "react-router-dom";
import {TopBar} from "./home/TopBar";
import {Navbar} from "./home/Navbar";
import {Footer} from "./home/Footer.tsx";
import WhatsAppChat from "./shared/WhatsAppChat";

export default function Layout() {
    return (
        <>
            <div className={'sticky top-0 z-50'}>
                <TopBar/>
                <Navbar/>
            </div>

            <main>
                <Outlet/>
            </main>
            <Footer/>
            <WhatsAppChat/>
        </>
    );
}