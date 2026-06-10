import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BookingsFilters from "../../components/admin/BookingsFilters";
import BookingsTable from "../../components/admin/BookingsTable";
import Pagination from "../../components/admin/Pagination";
import {
    fetchAdminBookings,
    type AdminBookingFilters,
    type AdminBookingStatus,
    type AdminBookingSummary,
} from "../../data/admin";

const PAGE_SIZE = 10;

const STATUS_FROM_PARAM: Record<string, AdminBookingStatus> = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
};

const STATUS_TO_PARAM: Record<AdminBookingStatus, string> = {
    Pending: "pending",
    Confirmed: "confirmed",
    Completed: "completed",
    Cancelled: "cancelled",
};

export default function AdminBookings() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState<AdminBookingFilters>(() => {
        const statusParam = searchParams.get("status")?.toLowerCase() ?? "";
        return {
            status: STATUS_FROM_PARAM[statusParam] ?? "all",
            type: "all",
            search: "",
        };
    });

    const [page, setPage] = useState(1);
    const [bookings, setBookings] = useState<AdminBookingSummary[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    function handleFiltersChange(next: AdminBookingFilters) {
        setFilters(next);
        // Sync status to URL so the page is bookmarkable and refresh-safe.
        const params = new URLSearchParams(searchParams);
        if (next.status && next.status !== "all") {
            params.set("status", STATUS_TO_PARAM[next.status as AdminBookingStatus]);
        } else {
            params.delete("status");
        }
        setSearchParams(params, { replace: true });
    }

    useEffect(() => {
        setPage(1);
    }, [filters]);

    useEffect(() => {
        let alive = true;
        setLoading(true);
        fetchAdminBookings(filters, page, PAGE_SIZE)
            .then((res) => {
                if (!alive) return;
                setBookings(res.entries);
                setTotal(res.total);
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, [filters, page]);

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">Bookings</h1>
                <p className="mt-3 max-w-prose text-brand-ink">
                    Review all patient bookings. Click a row to confirm, cancel or mark a booking
                    as completed.
                </p>
            </div>

            <BookingsFilters filters={filters} onChange={handleFiltersChange} />

            <BookingsTable bookings={bookings} loading={loading} />

            <Pagination
                page={page}
                total={total}
                pageSize={PAGE_SIZE}
                onChange={setPage}
            />
        </>
    );
}