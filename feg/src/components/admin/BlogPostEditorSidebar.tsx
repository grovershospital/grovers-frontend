import { useRef, useState } from "react";
import { Trash2, Upload, X } from "lucide-react";
import BlogPostStatusPill from "./BlogPostStatusPill";
import { uploadAdminImage, type BlogPostInput, type BlogPostStatus } from "../../data/admin";

type Props = {
    form: BlogPostInput;
    status: BlogPostStatus;
    isEdit: boolean;
    onChange: <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) => void;
    onSave: () => void;
    onTogglePublish: () => void;
    onDelete: () => void;
    submitting: boolean;
    error: string | null;
    success: boolean;
};

export default function BlogPostEditorSidebar({
                                                  form,
                                                  status,
                                                  isEdit,
                                                  onChange,
                                                  onSave,
                                                  onTogglePublish,
                                                  onDelete,
                                                  submitting,
                                                  error,
                                                  success,
                                              }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    async function handleFilePicked(file: File | null) {
        if (!file) return;
        setUploadError(null);
        setUploading(true);
        try {
            const url = await uploadAdminImage(file);
            onChange("featuredImage", url);
        } catch (err) {
            setUploadError(
                err instanceof Error
                    ? err.message
                    : "Could not upload the image. Please try again.",
            );
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    function handleDeleteClicked() {
        if (!window.confirm("Delete this post? This cannot be undone.")) return;
        onDelete();
    }

    return (
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-brand-ink">Status</h3>
                    <BlogPostStatusPill status={status} />
                </div>
                {isEdit ? (
                    <button
                        type="button"
                        onClick={onTogglePublish}
                        disabled={submitting}
                        className={`block w-full rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 ${
                            status === "Published"
                                ? "bg-brand-ink hover:bg-brand-blue focus-visible:outline-brand-ink"
                                : "bg-brand-green hover:bg-brand-blue focus-visible:outline-brand-green"
                        }`}
                    >
                        {status === "Published" ? "Move to draft" : "Publish post"}
                    </button>
                ) : (
                    <p className="text-xs text-neutral-500">
                        Save this post first, then you can publish it.
                    </p>
                )}
            </section>

            <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                <h3 className="mb-3 text-sm font-bold text-brand-ink">Hero image</h3>
                {form.featuredImage ? (
                    <div className="space-y-3">
                        <div className="relative overflow-hidden rounded-xl border border-neutral-200">

                            <img
                                src={form.featuredImage}
                                alt=""
                                className="block w-full"
                            />
                            <button
                                type="button"
                                onClick={() => onChange("featuredImage", null)}
                                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow hover:bg-white"
                                aria-label="Remove hero image"
                            >
                                <X className="h-4 w-4" strokeWidth={2} />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-semibold text-brand-ink hover:bg-neutral-100 disabled:opacity-60"
                        >
                            <Upload className="h-4 w-4" strokeWidth={2.5} />
                            {uploading ? "Uploading…" : "Replace image"}
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="block w-full rounded-2xl border-2 border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-500 hover:border-brand-blue hover:bg-brand-blue/5 disabled:opacity-60"
                    >
                        <Upload
                            className="mx-auto mb-2 h-5 w-5 text-neutral-400"
                            strokeWidth={2}
                        />
                        {uploading ? "Uploading…" : "Click to upload"}
                    </button>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => handleFilePicked(e.target.files?.[0] ?? null)}
                    className="hidden"
                />
                {uploadError && (
                    <p className="mt-2 text-xs text-brand-red" role="alert">
                        {uploadError}
                    </p>
                )}
            </section>

            <section className="rounded-2xl border border-neutral-200 bg-white p-6">
                <button
                    type="button"
                    onClick={onSave}
                    disabled={submitting}
                    className="block w-full rounded-full bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:opacity-60"
                >
                    {submitting ? "Saving…" : isEdit ? "Save changes" : "Create post"}
                </button>

                {error && (
                    <p className="mt-3 text-sm text-brand-red" role="alert">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="mt-3 text-sm text-brand-green" role="status">
                        Saved.
                    </p>
                )}
            </section>

            {isEdit && (
                <button
                    type="button"
                    onClick={handleDeleteClicked}
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-red px-4 py-2 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red/10 disabled:opacity-60"
                >
                    <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                    Delete post
                </button>
            )}
        </aside>
    );
}