import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Upload, X } from "lucide-react";
import Modal from "../../ui/Modal";
import { createAdminLabResult } from "../../data/admin";

type Props = {
    open: boolean;
    onClose: () => void;
    patientId: string;
    onCreated: (resultId: string) => void;
};

export default function LabResultUploadModal({
                                                 open,
                                                 onClose,
                                                 patientId,
                                                 onCreated,
                                             }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const wasOpen = useRef(false);

    useEffect(() => {

        if (open && !wasOpen.current) {

            setTitle("");
            setDescription("");
            setFiles([]);
            setError(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [open]);

    function handleFilesPicked(picked: FileList | null) {
        if (!picked) return;
        const arr = Array.from(picked);
        setFiles(arr);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function removeFile(index: number) {
        setFiles((current) => current.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("Title is required.");
            return;
        }
        if (files.length === 0) {
            setError("Attach at least one file.");
            return;
        }

        setSubmitting(true);
        try {
            const created = await createAdminLabResult({
                patientId,
                title,
                description,
                files,
            });
            onCreated(created.id);
            onClose();
        } catch {
            setError("Could not create the result. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="New lab result"
            locked={submitting}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-neutral-500">
                    Attach the result PDFs or images. Files can't be added after creation —
                    if you need to add more later, upload a new result.
                </p>

                <Field label="Title" htmlFor="lr-title" required>
                    <input
                        id="lr-title"
                        type="text"
                        required
                        placeholder="e.g. Annual Wellness Test"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Description" htmlFor="lr-description">
                    <textarea
                        id="lr-description"
                        rows={3}
                        placeholder="Brief context about this test."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Files" htmlFor="lr-files" required>
                    <div className="space-y-2">
                        <input
                            ref={fileInputRef}
                            id="lr-files"
                            type="file"
                            multiple
                            accept="application/pdf,image/*"
                            onChange={(e) => handleFilesPicked(e.target.files)}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-semibold text-brand-ink hover:bg-neutral-100"
                        >
                            <Upload className="h-4 w-4" strokeWidth={2.5} />
                            Add files
                        </button>

                        {files.length > 0 && (
                            <ul className="space-y-1.5 pt-1">
                                {files.map((f, i) => (
                                    <li
                                        key={`${f.name}-${i}`}
                                        className="flex items-center justify-between gap-3 rounded-md bg-neutral-50 px-3 py-2 text-sm"
                                    >
                                        <span className="truncate text-brand-ink">
                                            {f.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="flex-shrink-0 text-neutral-500 hover:text-brand-red"
                                            aria-label={`Remove ${f.name}`}
                                        >
                                            <X className="h-4 w-4" strokeWidth={2} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Field>

                {error && (
                    <p className="text-sm text-brand-red" role="alert">
                        {error}
                    </p>
                )}

                <div className="flex flex-wrap justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-neutral-100 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                    >
                        {submitting ? "Uploading…" : "Create result"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

const inputClass =
    "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue";

function Field({
                   label,
                   htmlFor,
                   required,
                   children,
               }: {
    label: string;
    htmlFor: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="mb-1.5 block text-sm font-semibold text-brand-ink"
            >
                {label}
                {required && <span className="ml-1 text-brand-red">*</span>}
            </label>
            {children}
        </div>
    );
}