import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {requestDataDownload} from "../../data/portal.ts";

export default function PrivacyAndData() {
    const navigate = useNavigate();

    const [downloading, setDownloading] = useState(false);
    const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleDownload() {
        setError(null);
        setDownloadMessage(null);
        setDownloading(true);
        try {
            await requestDataDownload();
            setDownloadMessage(
                "We've started preparing your data. You'll receive an email with a download link shortly.",
            );
        } catch {
            setError("Could not request your data. Please try again.");
        } finally {
            setDownloading(false);
        }
    }

    function handleDelete() {
        navigate('/patient-portal/delete-account')
    }

    return (
        <section className="mb-12">
            <h2 className="mb-2 text-2xl font-bold text-brand-ink">Privacy and Data</h2>
            <p className="mb-6 max-w-prose text-sm text-brand-ink">
                You have the right to access, correct or request deletion of your personal data
                held by Grover's Hospital in accordance with the Nigeria Data Protection Act 2023.
            </p>

            <div className="mb-6 flex flex-wrap gap-4">
                <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center justify-center rounded-full bg-brand-red px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                >
                    {downloading ? "Requesting…" : "Download my data"}
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center justify-center rounded-full bg-brand-ink px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink disabled:opacity-60"
                >
                    Delete my data
                </button>
            </div>

            <p className="mb-4 max-w-prose text-xs text-brand-ink">
                Requesting deletion of your data will permanently remove your account and all
                associated records from our Patient Portal. This action cannot be undone. Your
                clinical records will be retained by Grover's Hospital in accordance with Nigerian
                healthcare regulations and our legal obligations, but your portal access and
                personal account data will be permanently deleted.
            </p>

            {/* TODO: confirm the public privacy policy URL once that page exists. */}
            <Link
                to="/privacy"
                className="text-sm text-brand-ink underline underline-offset-2 hover:no-underline"
            >
                Read our Privacy Policy
            </Link>

            {downloadMessage && (
                <p className="mt-4 text-sm text-brand-green" role="status">
                    {downloadMessage}
                </p>
            )}
            {error && (
                <p className="mt-4 text-sm text-brand-red" role="alert">
                    {error}
                </p>
            )}
        </section>
    );
}