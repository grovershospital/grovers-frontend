import { useState } from "react";
import { Trash2 } from "lucide-react";
import BlogHeroImage from "./BlogHeroImage";
import type { BlogPostInput, BlogPostStatus } from "../../data/admin";

type Props = {
    form: BlogPostInput;
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
                                                  isEdit,
                                                  onChange,
                                                  onSave,
                                                  onTogglePublish,
                                                  onDelete,
                                                  submitting,
                                                  error,
                                                  success,
                                              }: Props) {
    return (
        <aside className="space-y-6">
            <Card>
                <BlogHeroImage
                    url={form.heroImageUrl}
                    onChange={(url) => onChange("heroImageUrl", url)}
                />
            </Card>

            <Card>
                <div className="space-y-5">
                    <div>
                        <label
                            htmlFor="bp-status"
                            className="mb-1.5 block text-sm font-semibold text-brand-ink"
                        >
                            Status
                        </label>
                        <select
                            id="bp-status"
                            value={form.status}
                            onChange={(e) =>
                                onChange("status", e.target.value as BlogPostStatus)
                            }
                            className={inputClass}
                        >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                        <p className="mt-1 text-xs text-neutral-500">
                            Drafts are invisible to patients.
                        </p>
                    </div>

                    <label className="flex items-start gap-3 text-sm">
                        <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={(e) => onChange("featured", e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-brand-red focus:ring-brand-blue"
                        />
                        <span>
                            <span className="font-semibold text-brand-ink">
                                Featured
                            </span>
                            <span className="block text-xs text-neutral-500">
                                Shown at the top of the public Resources page. Only one
                                post can be featured at a time.
                            </span>
                        </span>
                    </label>

                    <div>
                        <label
                            htmlFor="bp-readtime"
                            className="mb-1.5 block text-sm font-semibold text-brand-ink"
                        >
                            Read time (minutes)
                        </label>
                        <input
                            id="bp-readtime"
                            type="number"
                            min="1"
                            max="60"
                            value={form.readTimeMinutes}
                            onChange={(e) =>
                                onChange(
                                    "readTimeMinutes",
                                    Math.max(
                                        1,
                                        Number.parseInt(e.target.value, 10) || 1,
                                    ),
                                )
                            }
                            className={inputClass}
                        />
                    </div>
                </div>
            </Card>

            <Card>
                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center rounded-full border border-brand-ink bg-white px-6 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-neutral-100 disabled:opacity-60"
                    >
                        {submitting ? "Saving…" : isEdit ? "Save changes" : "Save draft"}
                    </button>

                    <button
                        type="button"
                        onClick={onTogglePublish}
                        disabled={submitting}
                        className={`inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 ${
                            form.status === "Published"
                                ? "bg-brand-ink hover:bg-brand-blue focus-visible:outline-brand-ink"
                                : "bg-brand-green hover:bg-brand-blue focus-visible:outline-brand-green"
                        }`}
                    >
                        {submitting
                            ? "Working…"
                            : form.status === "Published"
                                ? "Unpublish"
                                : "Publish"}
                    </button>

                    {error && (
                        <p className="text-xs text-brand-red" role="alert">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="text-xs text-brand-green" role="status">
                            Saved.
                        </p>
                    )}
                </div>
            </Card>

            {isEdit && (
                <Card>
                    <DeleteButton onClick={onDelete} disabled={submitting} />
                </Card>
            )}
        </aside>
    );
}

function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            {children}
        </div>
    );
}

function DeleteButton({
                          onClick,
                          disabled,
                      }: {
    onClick: () => void;
    disabled: boolean;
}) {
    const [confirming, setConfirming] = useState(false);

    if (!confirming) {
        return (
            <button
                type="button"
                onClick={() => setConfirming(true)}
                disabled={disabled}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-red bg-white px-6 py-2.5 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red/5 disabled:opacity-60"
            >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
                Delete post
            </button>
        );
    }

    return (
        <div className="space-y-3">
            <p className="text-xs text-brand-ink">
                Permanently delete this post? This cannot be undone.
            </p>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    disabled={disabled}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-brand-ink hover:bg-neutral-100 disabled:opacity-60"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onClick}
                    disabled={disabled}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-red px-4 py-2 text-xs font-semibold text-white hover:bg-brand-blue disabled:opacity-60"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

const inputClass =
    "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue";