import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { AdminPatientContext } from "../../contexts/AdminPatientContext";
import PatientDetailHeader from "../../components/admin/PatientDetailHeader";
import PatientTabBar from "../../components/admin/PatientTabBar";
import { fetchAdminPatient, type AdminPatientProfile } from "../../data/admin";

export default function AdminPatientDetail() {
    const { id } = useParams<{ id: string }>();

    const [patient, setPatient] = useState<AdminPatientProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        let alive = true;
        fetchAdminPatient(id)
            .then((data) => {
                if (alive) setPatient(data);
            })
            .catch(() => {
                if (alive) setError("Could not load this patient.");
            });
        return () => {
            alive = false;
        };
    }, [id]);

    if (!id) return <Navigate to="/admin/patients" replace />;

    if (error) {
        return <p className="text-sm text-brand-red">{error}</p>;
    }

    if (!patient) {
        return <p className="text-sm text-neutral-500">Loading…</p>;
    }

    return (
        <AdminPatientContext.Provider value={{ patient }}>
            <PatientDetailHeader patient={patient} />
            <PatientTabBar patientId={patient.id} />
            <Outlet />
        </AdminPatientContext.Provider>
    );
}