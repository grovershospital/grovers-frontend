// tailwind.config.js
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    green: "#0ba84a",
                    red: "#d62427",
                    blue: "#317de2",
                    ink: "#0a0a0a",
                },
            },
            fontFamily: {
                sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
            },
            maxWidth: {
                content: "1120px",
            },
        },
    },
    plugins: [],
};