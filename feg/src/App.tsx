// src/App.tsx
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Services from "./pages/Services.tsx";
import Packages from "./pages/Packages.tsx";
import Resources from "./pages/Resources.tsx";
import ArticleDetail from "./pages/ArticleDetail";

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop/>
            <Routes>
                {/* Everything inside here gets TopBar + Navbar + Footer */}
                <Route element={<Layout/>}>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path={"/about"} element={<About/>}/>
                    <Route path={"/services"} element={<Services/>}/>
                    <Route path={"/packages"} element={<Packages/>}/>
                    <Route path={"/resources"} element={<Resources/>}/>
                    <Route path={"/resources/:slug"} element={<ArticleDetail/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}