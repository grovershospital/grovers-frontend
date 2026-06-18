import {useCallback, useEffect, useState} from "react";
import LabResultsHero from "../../components/portal/LabResultsHero";
import AllResultsTable from "../../components/portal/AllResultsTable";
import ResultDetails from "../../components/portal/ResultDetails";
import {
    emailLabResultLink,
    fetchLabResultDetail,
    fetchRecentLabResults,
    type LabResult,
    type LabResultDetail,
} from "../../data/portal";
import {toast} from "sonner";

type ListStatus = "loading" | "error" | "ready";
type DetailStatus = "idle" | "loading" | "error" | "ready";

export default function LabResults() {
    const [results, setResults] = useState<ReadonlyArray<LabResult>>([]);
    const [listStatus, setListStatus] = useState<ListStatus>("loading");

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState<LabResultDetail | null>(null);
    const [detailError, setDetailError] = useState<string | null>(null);
    const [detailStatus, setDetailStatus] = useState<DetailStatus>("idle");
    const [detailReloadKey, setDetailReloadKey] = useState(0);

    // ─── Load the results list ──────────────────────────────
    const loadResults = useCallback(async () => {
        setListStatus("loading");
        try {
            const data = await fetchRecentLabResults();
            setResults(data);
            setListStatus("ready");
            // Auto-select first "Ready" only if nothing is currently selected.
            // Functional setState avoids stale-closure bugs on retry.
            setSelectedId((current) => {
                if (current) return current;
                return data.find((r) => r.status === "Ready to view")?.id ?? null;
            });
        } catch {
            setListStatus("error");
        }
    }, []);

    useEffect(() => {
        void loadResults();
    }, [loadResults]);

    // ─── Load the selected result's detail ──────────────────
    useEffect(() => {
        if (!selectedId) {
            setDetailStatus("idle");
            setDetail(null);
            setDetailError(null);
            return;
        }
        let alive = true;
        setDetailStatus("loading");
        setDetailError(null);
        fetchLabResultDetail(selectedId)
            .then((d) => {
                if (!alive) return;
                setDetail(d);
                setDetailStatus("ready");
            })
            .catch((err) => {
                if (!alive) return;
                setDetail(null);
                setDetailError(
                    err instanceof Error ? err.message : "Could not load this result.",
                );
                setDetailStatus("error");
            });
        return () => {
            alive = false;
        };
    }, [selectedId, detailReloadKey]);

    const retryDetail = () => setDetailReloadKey((k) => k + 1);

    const selectedResult: LabResult | undefined = results.find(
        (result) => result.id === selectedId,
    );

    async function handleEmailLink(resultId: string) {
        try {
            await emailLabResultLink(resultId);
            toast.success("Check your email for the download link.");
        } catch {
            toast.error("Could not send the email. Please try again.");
        }
    }

    return (
        <>
            <LabResultsHero/>

            <AllResultsTable
                results={results}
                status={listStatus}
                onRetry={loadResults}
                onView={setSelectedId}
                onDownload={handleEmailLink}
            />

            <ResultDetails
                detail={detail}
                status={detailStatus}
                errorMessage={detailError ?? undefined}
                onRetry={retryDetail}
                onEmailLink={() => {
                    if (selectedResult) {
                        handleEmailLink(selectedResult.id);
                    }
                }}
            />
        </>
    );
}