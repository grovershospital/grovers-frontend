import { useEffect, useState } from "react";
import LabResultsHero from "../../components/portal/LabResultsHero";
import AllResultsTable from "../../components/portal/AllResultsTable";
import ResultDetails from "../../components/portal/ResultDetails";
import {
    downloadLabResultPDF,
    fetchLabResultDetail,
    fetchRecentLabResults,
    type LabResult,
    type LabResultDetail,
} from "../../data/portal";

export default function LabResults() {
    const [results, setResults] = useState<ReadonlyArray<LabResult>>([]);
    const [loadingResults, setLoadingResults] = useState(true);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState<LabResultDetail | null>(null);
    const [detailError, setDetailError] = useState<string | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Load the results list once.
    useEffect(() => {
        let alive = true;
        fetchRecentLabResults()
            .then((data) => {
                if (!alive) return;
                setResults(data);
                // Auto-select the first "Ready" result so details aren't empty.
                const firstReady = data.find((r) => r.status === "Ready to view");
                if (firstReady) setSelectedId(firstReady.id);
            })
            .finally(() => {
                if (alive) setLoadingResults(false);
            });
        return () => {
            alive = false;
        };
    }, []);

    // Fetch detail whenever the selection changes.
    useEffect(() => {
        if (!selectedId) return;
        let alive = true;
        setLoadingDetail(true);
        setDetailError(null);
        fetchLabResultDetail(selectedId)
            .then((d) => {
                if (alive) setDetail(d);
            })
            .catch((err) => {
                if (!alive) return;
                setDetail(null);
                setDetailError(
                    err instanceof Error
                    ? err.message : "Could not load this result.",
                );
            })
            .finally(() => {
                if (alive) setLoadingDetail(false);
            });
        return () => {
            alive = false;
        };
    }, [selectedId]);

    function handleDownload(id: string) {
        // TODO: surface success/error toast once we have one
        downloadLabResultPDF(id);
    }

    return (
        <>
            <LabResultsHero />

            <AllResultsTable
                results={results}
                loading={loadingResults}
                onView={setSelectedId}
                onDownload={handleDownload}
            />

            <ResultDetails
                detail={detail}
                error={detailError}
                loading={loadingDetail}
                onDownload={() => detail && handleDownload(detail.id)}
            />
        </>
    );
}