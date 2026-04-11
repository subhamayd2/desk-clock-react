import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { weatherLocation } from "./config";
import { layouts } from "./layouts.js";

const WEATHER_REFRESH_MS = 15 * 60 * 1000;
const WEATHER_CACHE_KEY = "desk-clock-weather";

function useClock() {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const timer = window.setInterval(() => setNow(new Date()), 1000);
		return () => window.clearInterval(timer);
	}, []);

	return now;
}

function useWeather(location = weatherLocation) {
	const [weather, setWeather] = useState(() => readCachedWeather());
	const [status, setStatus] = useState(weather ? "cached" : "loading");

	useEffect(() => {
		let cancelled = false;

		async function fetchWeather() {
			try {
				setStatus((current) =>
					current === "ready" || current === "cached" ? current : "loading",
				);
				const response = await fetch(
					`https://api.open-meteo.com/v1/forecast?latitude=22.5626&longitude=88.363&current=temperature_2m,weather_code,is_day&forecast_days=1`,
				);
				if (!response.ok) throw new Error("Weather request failed");
				const data = await response.json();
				const nextWeather = normalizeWeather(data, location);

				if (!cancelled) {
					setWeather(nextWeather);
					setStatus("ready");
					writeStorage(WEATHER_CACHE_KEY, JSON.stringify(nextWeather));
				}
			} catch (_) {
				if (!cancelled) {
					setWeather((current) => current || readCachedWeather());
					setStatus("offline");
				}
			}
		}

		fetchWeather();
		const timer = window.setInterval(fetchWeather, WEATHER_REFRESH_MS);
		return () => {
			cancelled = true;
			window.clearInterval(timer);
		};
	}, [location]);

	return { weather, status };
}

function App() {
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

function normalizeWeather(data, location) {
	const current = data.current || {};
	return {
		location: location.label,
		updatedAt: current.time || new Date().toISOString(),
		temperature: current.temperature_2m,
		condition: describeWeather(current.weather_code),
		weatherCode: current.weather_code,
		isDay: current.is_day,
	};
}

function readCachedWeather() {
	try {
		const raw = readStorage(WEATHER_CACHE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

function readStorage(key) {
	try {
		return window.localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeStorage(key, value) {
	try {
		window.localStorage.setItem(key, value);
	} catch {
		// Storage can be unavailable in some locked-down browser modes.
	}
}

function describeWeather(code) {
	const map = {
		0: "Clear",
		1: "Mostly clear",
		2: "Partly cloudy",
		3: "Cloudy",
		45: "Fog",
		48: "Rime fog",
		51: "Light drizzle",
		53: "Drizzle",
		55: "Heavy drizzle",
		56: "Light freezing drizzle",
		57: "Freezing drizzle",
		61: "Light rain",
		63: "Rain",
		65: "Heavy rain",
		66: "Light freezing rain",
		67: "Freezing rain",
		71: "Light snow",
		73: "Snow",
		75: "Heavy snow",
		77: "Snow grains",
		80: "Light showers",
		81: "Showers",
		82: "Heavy showers",
		85: "Light snow showers",
		86: "Heavy snow showers",
		95: "Thunderstorm",
		96: "Thunderstorm with hail",
		99: "Heavy thunderstorm with hail",
	};

	return map[code] || "Changing skies";
}

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").catch(() => {});
	});
}

createRoot(document.getElementById("root")).render(<App />);
