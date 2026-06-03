import { createContext, useContext } from "react";
import type { AdminPatientProfile } from "../data/admin";

type Ctx = {
    patient: AdminPatientProfile;
};

export const AdminPatientContext = createContext<Ctx | null>(null);

export function useAdminPatient(): AdminPatientProfile {
    const ctx = useContext(AdminPatientContext);
    if (!ctx) {
        throw new Error(
            "useAdminPatient must be used inside an AdminPatientDetail route",
        );
    }
    return ctx.patient;
}