// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import { TopBar } from "./home/TopBar";
import { Navbar } from "./home/Navbar";
// import { Footer } from "./home/Footer"; // add when we build it

export default function Layout() {
    return (
        <>
            <TopBar />
            <Navbar />
            <main>
                <Outlet /> {/* current route's page renders here */}
            </main>
            {/* <Footer /> */}
        </>
    );
}