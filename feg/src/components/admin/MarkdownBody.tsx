import {useRef, useState} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {Bold, Heading2, Heading3, ImagePlus, Italic, Link as LinkIcon, List} from "lucide-react";
import {uploadAdminImage} from '../../data/admin.ts'
import {toast} from "sonner";

type Props = {
    value: string;
    onChange: (next: string) => void;
};

type Tab = "write" | "preview";

export default function MarkdownBody({value, onChange}: Props) {
    const [tab, setTab] = useState<Tab>("write");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // ─── Text manipulation helpers ──────────────────────────
    // All toolbar actions work by reading the textarea's selectionStart/End,
    // splicing the new syntax in, then restoring focus + cursor position.

    function wrapSelection(before: string, after: string) {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = value.substring(start, end);
        const replacement = `${before}${selected || "text"}${after}`;
        const next = value.substring(0, start) + replacement + value.substring(end);
        onChange(next);
        // Restore focus and select the inner text (not the syntax chars)
        requestAnimationFrame(() => {
            ta.focus();
            ta.selectionStart = start + before.length;
            ta.selectionEnd = start + before.length + (selected || "text").length;
        });
    }

    function insertAtCursor(text: string) {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const next = value.substring(0, start) + text + value.substring(start);
        onChange(next);
        requestAnimationFrame(() => {
            ta.focus();
            ta.selectionStart = ta.selectionEnd = start + text.length;
        });
    }

    function prependLine(prefix: string) {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        // Find the beginning of the current line
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const next = value.substring(0, lineStart) + prefix + value.substring(lineStart);
        onChange(next);
        requestAnimationFrame(() => {
            ta.focus();
            ta.selectionStart = ta.selectionEnd = start + prefix.length;
        });
    }

    // ─── Toolbar actions ────────────────────────────────────
    function handleBold() {
        wrapSelection("**", "**");
    }

    function handleItalic() {
        wrapSelection("*", "*");
    }

    function handleH2() {
        prependLine("## ");
    }

    function handleH3() {
        prependLine("### ");
    }

    function handleLink() {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = value.substring(start, end);
        if (selected) {
            // Wrap selected text as link label
            wrapSelection("[", "](url)");
        } else {
            insertAtCursor("[link text](url)");
        }
    }

    function handleList() {
        prependLine("- ");
    }

    // ─── Image upload ────────────────────────────────────────
    function handleImageClick() {
        fileInputRef.current?.click();
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        // Reset the input so the same file can be re-selected
        e.target.value = "";

        setUploading(true);
        try {
            const url = await uploadAdminImage(file);
            insertAtCursor(`\n![${file.name}](${url})\n`);
        } catch {
            toast.error("Could not upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <div className="mb-3 border-b border-neutral-200">
                <nav className="-mb-px flex gap-6">
                    <TabButton active={tab === "write"} onClick={() => setTab("write")}>
                        Write
                    </TabButton>
                    <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
                        Preview
                    </TabButton>
                </nav>
            </div>

            {tab === "write" ? (
                <>
                    {/* Toolbar */}
                    <div className="mb-2 flex flex-wrap items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-1.5">
                        <ToolbarButton label="Bold" onClick={handleBold}>
                            <Bold className="h-4 w-4" strokeWidth={2.5}/>
                        </ToolbarButton>
                        <ToolbarButton label="Italic" onClick={handleItalic}>
                            <Italic className="h-4 w-4" strokeWidth={2.5}/>
                        </ToolbarButton>
                        <ToolbarDivider/>
                        <ToolbarButton label="Heading 2" onClick={handleH2}>
                            <Heading2 className="h-4 w-4" strokeWidth={2.5}/>
                        </ToolbarButton>
                        <ToolbarButton label="Heading 3" onClick={handleH3}>
                            <Heading3 className="h-4 w-4" strokeWidth={2.5}/>
                        </ToolbarButton>
                        <ToolbarDivider/>
                        <ToolbarButton label="Bullet list" onClick={handleList}>
                            <List className="h-4 w-4" strokeWidth={2.5}/>
                        </ToolbarButton>
                        <ToolbarButton label="Link" onClick={handleLink}>
                            <LinkIcon className="h-4 w-4" strokeWidth={2.5}/>
                        </ToolbarButton>
                        <ToolbarDivider/>
                        <ToolbarButton
                            label={uploading ? "Uploading…" : "Insert image"}
                            onClick={handleImageClick}
                            disabled={uploading}
                        >
                            <ImagePlus className="h-4 w-4" strokeWidth={2.5}/>
                        </ToolbarButton>
                        {uploading && (
                            <span className="ml-1 text-xs text-neutral-500">Uploading…</span>
                        )}
                    </div>

                    {/* Hidden file input for image upload */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageUpload}
                        className="hidden"
                    />

                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        rows={20}
                        placeholder="Write the article body in Markdown.&#10;&#10;Use the toolbar above or type directly:&#10;  ## Section heading&#10;  ### Sub-heading&#10;  **bold text**&#10;  *italic text*&#10;  [link text](url)&#10;  - bullet point&#10;&#10;Click the image button to upload and embed photos."
                        className="w-full resize-y rounded-2xl border border-neutral-300 bg-white px-4 py-3 font-mono text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                </>
            ) : (
                <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-5">
                    {value.trim() === "" ? (
                        <p className="text-sm italic text-neutral-500">
                            Nothing to preview yet.
                        </p>
                    ) : (
                        <article className="overflow-hidden text-brand-ink">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    h2: ({node: _n, ...rest}) => (
                                        <h2
                                            className="mb-3 mt-6 text-xl font-bold text-brand-blue first:mt-0"
                                            {...rest}
                                        />
                                    ),
                                    h3: ({node: _n, ...rest}) => (
                                        <h3
                                            className="mb-2 mt-5 text-lg font-bold text-brand-ink"
                                            {...rest}
                                        />
                                    ),
                                    p: ({node: _n, ...rest}) => (
                                        <p className="mb-4 leading-relaxed" {...rest}/>
                                    ),
                                    a: ({node: _n, ...rest}) => (
                                        <a
                                            className="text-brand-red underline underline-offset-2 hover:no-underline"
                                            {...rest}
                                        />
                                    ),
                                    ul: ({node: _n, ...rest}) => (
                                        <ul
                                            className="mb-4 list-disc pl-6 leading-relaxed"
                                            {...rest}
                                        />
                                    ),
                                    img: ({node: _n, className, ...rest}) => (
                                        <img
                                            className={`my-3 max-w-full rounded-xl sm:max-w-sm ${
                                                className?.includes("float-left")
                                                    ? "sm:float-left sm:mr-5"
                                                    : className?.includes("float-right")
                                                        ? "sm:float-right sm:ml-5"
                                                        : ""
                                            }`}
                                            {...rest}
                                        />
                                    ),
                                }}
                            >
                                {value}
                            </ReactMarkdown>
                        </article>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Toolbar primitives ──────────────────────────────────────

function ToolbarButton({
                           label,
                           onClick,
                           disabled,
                           children,
                       }: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={label}
            aria-label={label}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-brand-ink disabled:opacity-50 disabled:hover:bg-transparent"
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="mx-0.5 h-5 w-px bg-neutral-200" aria-hidden="true"/>;
}

function TabButton({
                       active,
                       onClick,
                       children,
                   }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`whitespace-nowrap border-b-2 px-1 py-2 text-sm transition-colors ${
                active
                    ? "border-brand-red font-semibold text-brand-ink"
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-brand-ink"
            }`}
        >
            {children}
        </button>
    );
}