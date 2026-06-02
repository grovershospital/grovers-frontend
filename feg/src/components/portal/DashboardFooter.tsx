import { Link } from "react-router-dom";

export default function DashboardFooter() {
    return (
        <footer className="bg-[#0f1623] px-4 py-8 text-center text-xs text-white/70 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-2">
                <p>© 2026 Grover&apos;s Hospital. Operated by LABACare.</p>

                <p>
                    <Link
                        to="/privacy"
                        className="underline underline-offset-2 hover:no-underline"
                    >
                        Privacy Policy
                    </Link>{" "}
                    |{" "}
                    <Link
                        to="/terms"
                        className="underline underline-offset-2 hover:no-underline"
                    >
                        Terms of Use
                    </Link>
                </p>

                <p>
                    For support contact{" "}
                    <a
                        href="mailto:frontdesk@grovershospital.com.ng"
                        className="underline underline-offset-2 hover:no-underline"
                    >
                        frontdesk@grovershospital.com.ng
                    </a>{" "}
                    or call{" "}
                    <a
                        href="tel:+2349022012109"
                        className="underline underline-offset-2 hover:no-underline"
                    >
                        0902 201 2109
                    </a>
                    .
                </p>
            </div>
        </footer>
    );
}