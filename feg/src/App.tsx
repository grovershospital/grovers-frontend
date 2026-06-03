import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Services from "./pages/Services.tsx";
import Packages from "./pages/Packages.tsx";
import Resources from "./pages/Resources.tsx";
import ArticleDetail from "./pages/ArticleDetail";
import PatientPortal from "./pages/PatientPortal.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Appointments from "./components/portal/Appointments.tsx";
import LabResults from "./components/portal/LabResults.tsx";
import Profile from "./components/portal/Profile.tsx";
import Feedback from "./components/portal/Feedback.tsx";
import DeleteAccount from "./components/portal/DeleteAccount.tsx";
import AdminLogin from "./components/admin/AdminLogin.tsx";
import AdminDashboard from "./components/admin/AdminDashboard.tsx";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout.tsx";
import AdminFeedback from "./components/admin/AdminFeedback.tsx";
import AdminBookings from "./components/admin/AdminBookings.tsx";
import AdminBookingDetail from "./components/admin/AdminBookingDetail.tsx";
import AdminPatients from "./components/admin/AdminPatients.tsx";
import AdminPatientDetail from "./components/admin/AdminPatientDetail.tsx";
import ProfileTab from "./components/admin/patient/ProfileTab.tsx";
import HealthProfileTab from "./components/admin/patient/HealthProfileTab.tsx";
import MedicationsTab from "./components/admin/patient/MedicationsTab.tsx";
import ConditionsTab from "./components/admin/patient/ConditionsTab.tsx";
import VisitsTab from "./components/admin/patient/VisitsTab.tsx";
import AdminVisitEdit from "./components/admin/AdminVisitEdit.tsx";
import LabResultsTab from "./components/admin/patient/LabResultsTab.tsx";
import DocumentsTab from "./components/admin/patient/DocumentsTab.tsx";
import AdminLabResults from "./components/admin/AdminLabResults.tsx";
import AdminProfileUpdateRequests from "./components/admin/AdminProfileUpdateRequests.tsx";
import AdminBlogPosts from "./components/admin/AdminBlogPosts.tsx";
import AdminBlogPostEditor from "./components/admin/AdminBlogPostEditor.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop/>
            <Routes>
                {/* Everything inside here gets TopBar + Navbar + Footer */}
                <Route element={<Layout/>}>
                    <Route path={'/patient-portal'} element={<PatientPortal/>}/>
                    <Route path={'/patient-portal/login'} element={<Login/>}/>
                    <Route path={'patient-portal/signup'} element={<Signup/>}/>
                    <Route path={'patient-portal/forgot-password'} element={<ForgotPassword/>}/>

                    <Route path="/" element={<HomePage/>}/>
                    <Route path={"/about"} element={<About/>}/>
                    <Route path={"/services"} element={<Services/>}/>
                    <Route path={"/packages"} element={<Packages/>}/>
                    <Route path={"/resources"} element={<Resources/>}/>
                    <Route path={"/resources/:slug"} element={<ArticleDetail/>}/>
                    <Route path={'/admin/login'} element={<AdminLogin/>}/>
                </Route>

                {/* Patient portal (logged in) */}
                <Route element={<DashboardLayout/>}>
                    <Route path={'/patient-portal/dashboard'} element={<Dashboard/>}/>
                    <Route path={'/patient-portal/appointments'} element={<Appointments/>}/>
                    <Route path={'/patient-portal/lab-results'} element={<LabResults/>}/>
                    <Route path={'/patient-portal/feedback'} element={<Feedback/>}/>
                    <Route path={'/patient-portal/profile'} element={<Profile/>}/>
                    <Route path={'/patient-portal/delete-account'} element={<DeleteAccount/>}/>
                </Route>

                <Route element={<AdminDashboardLayout/>}>
                    <Route path={'/admin/dashboard'} element={<AdminDashboard/>}/>
                    <Route path={'/admin/bookings'} element={<AdminBookings/>}/>
                    <Route path={'/admin/lab-results'} element={<AdminLabResults/>}/>
                    <Route path={'/admin/bookings/:id'} element={<AdminBookingDetail/>}/>
                    <Route path={'/admin/feedback'} element={<AdminFeedback/>}/>
                    <Route path={'/admin/profile-update-requests'} element={<AdminProfileUpdateRequests/>}/>
                    <Route path={'/admin/blog-posts'} element={<AdminBlogPosts/>}/>
                    <Route path='/admin/blog-posts/new' element={<AdminBlogPostEditor/>}/>
                    <Route path={'/admin/blog-posts/:slug/edit'} element={<AdminBlogPostEditor/>}/>

                    {/*Patients - List + nested tab routes*/}
                    <Route path={'/admin/patients'} element={<AdminPatients/>}/>
                    <Route path={'/admin/patients/:id'} element={<AdminPatientDetail/>}>
                        <Route index element={<Navigate to={'profile'} replace/>}/>
                        <Route path={'profile'} element={<ProfileTab/>}/>
                        <Route path={'health-profile'} element={<HealthProfileTab/>}/>
                        <Route path={'medications'} element={<MedicationsTab/>}/>
                        <Route path={'conditions'} element={<ConditionsTab/>}/>
                        <Route path={'visits'} element={<VisitsTab/>}/>
                        <Route path={'lab-results'} element={<LabResultsTab/>}/>
                        <Route path={'documents'} element={<DocumentsTab/>}/>
                    </Route>

                    <Route path={'/admin/visits/:visitId/edit'} element={<AdminVisitEdit/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}