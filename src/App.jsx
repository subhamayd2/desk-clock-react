import { useEffect, useMemo, useRef, useState } from "react";
import { useClock } from "./hooks/useClock.js";
import { useWeather } from "./hooks/useWeather.js";
import { layouts } from "./layouts/registry.js";
import { readStorage, writeStorage } from "./lib/storage.js";

export function App() {
	const now = useClock();
	const { weather, status } = useWeather();
	const [layoutId, setLayoutId] = useState(
		() => readStorage("desk-clock-layout") || layouts[0].id,
	);
	const lastTapAt = useRef(0);

	const activeLayout = useMemo(
		() => layouts.find((layout) => layout.id === layoutId) || layouts[0],
		[layoutId],
	);
	const Layout = activeLayout.Component;
	const themeStyle = {
		"--clock-accent": activeLayout.theme?.accent,
		"--clock-bg-start": activeLayout.theme?.backgroundStart,
		"--clock-bg": activeLayout.theme?.background,
		"--clock-bg-deep": activeLayout.theme?.backgroundDeep,
	};

	function selectLayout(nextId) {
		setLayoutId(nextId);
		writeStorage("desk-clock-layout", nextId);
	}

	function cycleLayout() {
		const currentIndex = layouts.findIndex(
			(layout) => layout.id === activeLayout.id,
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

		return () => {
			clearInterval(autoLayoutTimer);
		};
	}, []);

	return (
		<main
			className="min-h-[100svh] touch-manipulation overflow-x-hidden"
			onPointerUp={handlePointerUp}
			style={themeStyle}
		>
			<Layout
				now={now}
				weather={weather}
				weatherStatus={status}
				animateClock={activeLayout.animateClock}
				theme={activeLayout.theme}
				layouts={layouts}
				activeLayoutId={activeLayout.id}
				onSelectLayout={selectLayout}
			/>
		</main>
	);
}
