// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* Everything inside here gets TopBar + Navbar + Footer */}
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    {/* <Route path="/about" element={<AboutPage />} /> */}
                    {/* <Route path="/contact" element={<ContactPage />} /> */}
                </Route>

                {/* Routes that should NOT have the chrome go out here, e.g.: */}
                {/* <Route path="/login" element={<LoginPage />} /> */}
            </Routes>
        </BrowserRouter>
    );
}