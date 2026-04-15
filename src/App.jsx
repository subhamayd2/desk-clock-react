import { useEffect, useRef, useState } from "react";
import { useClock } from "./hooks/useClock.js";
import { useWeather } from "./hooks/useWeather.js";
import { layouts } from "./layouts/registry.js";
import { readStorage, writeStorage } from "./lib/storage.js";

const VERSION_CHECK_INTERVAL = 20 * 1000;

export function App() {
	const now = useClock();
	const { weather, status } = useWeather();
	const [layoutId, setLayoutId] = useState(
		() => readStorage("desk-clock-layout") || layouts[0].id,
	);
	const lastTapAt = useRef(0);

	const getActiveLayoutById = (id) =>
		layouts.find((layout) => layout.id === id) || layouts[0];

	const activeLayout = useRef(getActiveLayoutById(layoutId));
	const Layout = activeLayout.current.Component;
	const themeStyle = {
		"--clock-accent": activeLayout.current.theme?.accent,
		"--clock-bg-start": activeLayout.current.theme?.backgroundStart,
		"--clock-bg": activeLayout.current.theme?.background,
		"--clock-bg-deep": activeLayout.current.theme?.backgroundDeep,
	};

	function selectLayout(nextId) {
		setLayoutId(nextId);
		activeLayout.current = getActiveLayoutById(nextId);
		writeStorage("desk-clock-layout", nextId);
	}

	function cycleLayout() {
		const currentIndex = layouts.findIndex(
			(layout) => layout.id === activeLayout.current.id,
		);
		const nextLayout =
			layouts[(currentIndex + 1) % layouts.length] || layouts[0];
		selectLayout(nextLayout.id);
	}

	function handlePointerUp() {
		const tappedAt = Date.now();
		if (tappedAt - lastTapAt.current < 350) {
			cycleLayout();
			lastTapAt.current = 0;
			return;
		}

		lastTapAt.current = tappedAt;
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: only on mount
	useEffect(() => {
		const autoLayoutTimer = setInterval(cycleLayout, 30 * 60 * 1000);
		let currentVersion;
		let isCheckingVersion = false;

		async function checkForNewVersion() {
			if (isCheckingVersion || document.visibilityState === "hidden") {
				return;
			}

			isCheckingVersion = true;

			try {
				const response = await fetch(`/version.json?t=${Date.now()}`, {
					cache: "no-store",
				});
				if (!response.ok) return;

				const { version } = await response.json();
				if (!version) return;

				if (!currentVersion) {
					currentVersion = version;
					return;
				}

				if (version !== currentVersion) {
					window.location.reload();
				}
			} catch {
				// The clock should keep running if the network is offline.
			} finally {
				isCheckingVersion = false;
			}
		}

		checkForNewVersion();
		const versionTimer = setInterval(
			checkForNewVersion,
			VERSION_CHECK_INTERVAL,
		);

		return () => {
			clearInterval(autoLayoutTimer);
			clearInterval(versionTimer);
		};
	}, []);

	return (
		<main
			className="min-h-svh touch-manipulation overflow-x-hidden"
			onPointerUp={handlePointerUp}
			style={themeStyle}
		>
			<Layout
				now={now}
				weather={weather}
				weatherStatus={status}
				animateClock={activeLayout.current.animateClock}
				theme={activeLayout.current.theme}
				layouts={layouts}
				activeLayoutId={activeLayout.current.id}
				onSelectLayout={selectLayout}
			/>
		</main>
	);
}
