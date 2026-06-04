import { useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { uploadBlogPostImage } from "../../data/admin";

type Props = {
    url: string | null;
    onChange: (url: string | null) => void;
};

export default function BlogHeroImage({ url, onChange }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploading(true);
        try {
            const { url: uploaded } = await uploadBlogPostImage(file);
            onChange(uploaded);
        } catch {
            setError("Could not upload the image. Please try again.");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    return (
        <div>
            <p className="mb-2 text-sm font-semibold text-brand-ink">Hero image</p>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleSelect}
                className="hidden"
            />

            {url ? (
                <div>
                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200">
                        <img
                            src={url}
                            alt="Hero preview"
                            className="block w-full"
                        />
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                            aria-label="Remove image"
                        >
                            <X className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="mt-2 inline-flex items-center gap-2 text-xs text-brand-ink underline underline-offset-2 hover:no-underline disabled:opacity-60"
                    >
                        <Upload className="h-3.5 w-3.5" strokeWidth={2.5} />
                        {uploading ? "Uploading…" : "Replace image"}
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 bg-white p-6 text-sm text-neutral-500 transition-colors hover:border-brand-blue hover:text-brand-ink disabled:opacity-60"
                >
                    <ImagePlus className="h-6 w-6" strokeWidth={1.5} />
                    {uploading ? "Uploading…" : "Add hero image"}
                </button>
            )}

            {error && (
                <p className="mt-2 text-xs text-brand-red" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}