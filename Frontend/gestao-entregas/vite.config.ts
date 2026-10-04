import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: "10.8.0.217",
        port: 5173,
    },
});
