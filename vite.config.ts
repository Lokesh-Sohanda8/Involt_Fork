import vinext from "vinext";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import { readExecutionProfile } from "./scripts/execution-profile.mjs";
import { sites } from "./build/sites-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";
const managedLinux = readExecutionProfile() === "managed-linux";

export default defineConfig(async () => {
  return {
    server: {
      ...(managedLinux ? { host: "0.0.0.0", allowedHosts: ["terminal.local"] } : {}),
      ...(isCodexSeatbeltSandbox ? { watch: { useFsEvents: false, usePolling: true } } : {}),
    },
    build: {
      rollupOptions: {
        preserveEntrySignatures: 'strict'
      }
    },
    plugins: [
      tailwindcss(),
      vinext(),
      nitro({
        preset: "vercel",
      }),
      sites({ mockAuth: !managedLinux }),
    ],
  };
});
