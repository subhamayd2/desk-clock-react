import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function getBuildVersion() {
	if (process.env.VERCEL_GIT_COMMIT_SHA) {
		return process.env.VERCEL_GIT_COMMIT_SHA;
	}

	try {
		return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
	} catch {
		return `local-${Date.now()}`;
	}
}

function buildVersionPlugin() {
	return {
		name: "build-version",
		closeBundle() {
			const distDir = join(process.cwd(), "dist");
			const versionFile = join(distDir, "version.json");

			mkdirSync(distDir, { recursive: true });
			writeFileSync(
				versionFile,
				`${JSON.stringify(
					{
						version: getBuildVersion(),
						builtAt: new Date().toISOString(),
					},
					null,
					2,
				)}\n`,
			);
		},
	};
}

export default defineConfig({
	plugins: [react(), buildVersionPlugin()],
});
