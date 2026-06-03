import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type Props = {
    value: string;
    onChange: (next: string) => void;
};

type Tab = "write" | "preview";

export default function MarkdownBody({ value, onChange }: Props) {
    const [tab, setTab] = useState<Tab>("write");

    return (
        <div>
            <div className="mb-3 border-b border-neutral-200">
                <nav className="-mb-px flex gap-6">
                    <TabButton active={tab === "write"} onClick={() => setTab("write")}>
                        Write
                    </TabButton>
                    <TabButton
                        active={tab === "preview"}
                        onClick={() => setTab("preview")}
                    >
                        Preview
                    </TabButton>
                </nav>
            </div>

            {tab === "write" ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={20}
                    placeholder="Write the article body in Markdown. Use ## for sections, **bold**, *italic*, [links](url), and standard image syntax. For inline float images, use <img class='float-left' src='…' />."
                    className="w-full resize-y rounded-2xl border border-neutral-300 bg-white px-4 py-3 font-mono text-sm text-brand-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                />
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
                                    h2: ({ node: _n, ...rest }) => (
                                        <h2
                                            className="mb-3 mt-6 text-xl font-bold text-brand-blue first:mt-0"
                                            {...rest}
                                        />
                                    ),
                                    h3: ({ node: _n, ...rest }) => (
                                        <h3
                                            className="mb-2 mt-5 text-lg font-bold text-brand-ink"
                                            {...rest}
                                        />
                                    ),
                                    p: ({ node: _n, ...rest }) => (
                                        <p className="mb-4 leading-relaxed" {...rest} />
                                    ),
                                    a: ({ node: _n, ...rest }) => (
                                        <a
                                            className="text-brand-red underline underline-offset-2 hover:no-underline"
                                            {...rest}
                                        />
                                    ),
                                    ul: ({ node: _n, ...rest }) => (
                                        <ul
                                            className="mb-4 list-disc pl-6 leading-relaxed"
                                            {...rest}
                                        />
                                    ),
                                    img: ({ node: _n, className, ...rest }) => (
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