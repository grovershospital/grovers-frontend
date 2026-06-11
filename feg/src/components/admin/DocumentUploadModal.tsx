import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Upload } from "lucide-react";
import Modal from "../../ui/Modal";
import {
    CATEGORY_LABEL,
    DOCUMENT_CATEGORIES,
    uploadAdminDocument,
    type DocumentCategory,
} from "../../data/admin";

type Props = {
    open: boolean;
    onClose: () => void;
    patientId: string;
    onUploaded: () => void;
};

export default function DocumentUploadModal({
                                                open,
                                                onClose,
                                                patientId,
                                                onUploaded,
                                            }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<DocumentCategory>("OTHER");
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setTitle("");
            setDescription("");
            setCategory("OTHER");
            setFile(null);
            setError(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [open]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!file) {
            setError("Please choose a file to upload.");
            return;
        }

        setSubmitting(true);
        try {
            await uploadAdminDocument(patientId, { title, description, category, file });
            onUploaded();
            onClose();
        } catch {
            setError("Could not upload the document. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Upload document"
            locked={submitting}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Category" htmlFor="doc-category" required>
                    <select
                        id="doc-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                        className={inputClass}
                    >
                        {DOCUMENT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {CATEGORY_LABEL[c]}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Title (optional)" htmlFor="doc-title">
                    <input
                        id="doc-title"
                        type="text"
                        placeholder="Defaults to the file's original name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Description (optional)" htmlFor="doc-description">
                    <textarea
                        id="doc-description"
                        rows={2}
                        placeholder="Optional context — what's in this document?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="File" htmlFor="doc-file" required>
                    <div className="flex items-center gap-3">
                        <input
                            ref={fileInputRef}
                            id="doc-file"
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-semibold text-brand-ink hover:bg-neutral-100"
                        >
                            <Upload className="h-4 w-4" strokeWidth={2.5} />
                            Choose file
                        </button>
                        {file && (
                            <span className="truncate text-sm text-brand-ink">
                                {file.name}
                            </span>
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
                        {submitting ? "Uploading…" : "Upload"}
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