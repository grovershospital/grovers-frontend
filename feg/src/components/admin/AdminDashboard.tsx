export default function AdminDashboard() {
    return (
        <>
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-brand-red sm:text-4xl">Dashboard</h1>
                <p className="mt-3 max-w-prose text-brand-ink">
                    Welcome to the Grover's Hospital admin dashboard. Use the navigation to manage
                    appointments, lab results, patient records, feedback and articles.
                </p>
            </div>

            <p className="text-sm text-neutral-500">
                Dashboard summary coming next — stat cards and recent activity.
            </p>
        </>
    );
}