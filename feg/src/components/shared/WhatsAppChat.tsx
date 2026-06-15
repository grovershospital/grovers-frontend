import {useState} from "react";
import {X} from "lucide-react";

// Configurable fallback: prioritization given to environment variables.
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "2349022012109";

const QUICK_PROMPTS = [
    {
        label: "Book an appointment",
        message: "Hi! I'd like to book an appointment at Grover's Hospital.",
    },
    {
        label: "Ask about a screening package",
        message: "Hi! I'd like to know more about your screening packages.",
    },
    {
        label: "Corporate health enquiry",
        message: "Hi! I'm enquiring about corporate health services for my organisation.",
    },
    {
        label: "General question",
        message: "Hi! I have a question.",
    },
];

function buildLink(message: string): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Inline WhatsApp logo with official brand geometry
function WhatsAppIcon({className}: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
    );
}

export default function WhatsAppChat() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {open && (
                <div
                    className="mb-4 w-80 overflow-hidden rounded-2xl bg-white shadow-2xl"
                    role="dialog"
                    aria-label="Chat with Grover's Hospital on WhatsApp"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between bg-[#25D366] px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                                <WhatsAppIcon className="h-5 w-5 text-white"/>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">
                                    Grover's Hospital
                                </p>
                                <p className="text-xs text-white/80">
                                    Typically replies in minutes
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="text-white/80 transition-colors hover:text-white"
                            aria-label="Close chat"
                        >
                            <X className="h-4 w-4" strokeWidth={2.5}/>
                        </button>
                    </div>

                    {/* Chat Body & Action Area */}
                    <div className="space-y-4 bg-[#e5ddd5] p-4">
                        {/* System Message */}
                        <div
                            className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-brand-ink shadow-sm">
                            <p className="font-semibold">👋 Hi there!</p>
                            <p className="mt-1 text-neutral-600">
                                How can we help you today? Pick a topic to start the
                                conversation on WhatsApp.
                            </p>
                        </div>

                        {/* Quick Prompt Grid/List */}
                        <div className="space-y-2">
                            {QUICK_PROMPTS.map((prompt) => (
                                /* Fixed: Restored missing <a element wrapper */
                                <a
                                    key={prompt.label}
                                    href={buildLink(prompt.message)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setOpen(false)}
                                    className="block rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-ink shadow-sm transition-colors hover:border-[#25D366] hover:bg-[#25D366]/5"
                                >
                                    {prompt.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Fallback Main Footer Link */}
                    {/* Fixed: Restored missing <a element wrapper */}
                    <a
                        href={buildLink("Hi! I'd like to chat with Grover's Hospital.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1ebe5d]"
                    >
                        <WhatsAppIcon className="h-4 w-4"/>
                        Start chat on WhatsApp
                    </a>
                </div>
            )}

            {/* Trigger Fab Button */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex h-14 w-14 items-center cursor-pointer justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
                aria-label={open ? "Close chat" : "Chat with us on WhatsApp"}
            >
                {open ? (
                    <X className="h-6 w-6" strokeWidth={2.5}/>
                ) : (
                    <WhatsAppIcon className="h-7 w-7 cursor-pointer"/>
                )}
            </button>
        </div>
    );
}