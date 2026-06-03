import { useRef, useState } from "react";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import {
    deleteLabResultFile,
    uploadLabResultFile,
    type AdminLabResultFile,
} from "../../data/admin";

type Props = {
    resultId: string;
    files: AdminLabResultFile[];
    onChange: (files: AdminLabResultFile[]) => void;
};

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function LabResultFiles({ resultId, files, onChange }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    async function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const created = await uploadLabResultFile(resultId, file);
            onChange([...files, created]);
        } catch {
            window.alert("Could not upload the file. Please try again.");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    async function handleDelete(file: AdminLabResultFile) {
        if (!window.confirm(`Delete "${file.fileName}"?`)) return;
        const prev = files;
        onChange(files.filter((f) => f.id !== file.id));
        try {
            await deleteLabResultFile(file.id);
        } catch {
            onChange(prev);
            window.alert("Could not delete the file. Please try again.");
        }
    }

    function handleDownload(file: AdminLabResultFile) {
        // TODO (backend): trigger api.get(`/admin/result-files/${file.id}/download`) and stream
        console.log("Download stub:", file.id);
    }

    return (
        <div className="space-y-3">
            {files.length === 0 ? (
                <p className="text-sm text-neutral-500">No files attached yet.</p>
            ) : (
                <ul className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200">
                    {files.map((f) => (
                        <li
                            key={f.id}
                            className="flex flex-wrap items-center justify-between gap-3 p-4"
                        >
                            <div className="flex items-center gap-3">
                                <FileText
                                    className="h-5 w-5 text-neutral-400"
                                    strokeWidth={1.5}
                                />
                                <div>
                                    <p className="text-sm font-semibold text-brand-ink">
                                        {f.fileName}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {formatBytes(f.sizeBytes)} · uploaded{" "}
                                        {f.uploadedAtDisplay}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => handleDownload(f)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-brand-ink"
                                    aria-label={`Download ${f.fileName}`}
                                >
                                    <Download className="h-4 w-4" strokeWidth={2} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(f)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-brand-red/10 hover:text-brand-red"
                                    aria-label={`Delete ${f.fileName}`}
                                >
                                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleSelect}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-semibold text-brand-ink hover:bg-neutral-100 disabled:opacity-60"
                >
                    <Upload className="h-4 w-4" strokeWidth={2.5} />
                    {uploading ? "Uploading…" : "Add file"}
                </button>
            </div>
        </div>
    );
}