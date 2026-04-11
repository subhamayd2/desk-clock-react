import { useEffect, useState } from "react";
import { weatherLocation } from "../config.js";
import { normalizeWeather } from "../weather/normalizeWeather.js";
import {
	readCachedWeather,
	writeCachedWeather,
} from "../weather/weatherCache.js";

const WEATHER_REFRESH_MS = 15 * 60 * 1000;

export function useWeather(location = weatherLocation) {
	const [weather, setWeather] = useState(() => readCachedWeather());
	const [status, setStatus] = useState(weather ? "cached" : "loading");

	useEffect(() => {
		let cancelled = false;

		async function fetchWeather() {
			try {
				setStatus((current) =>
					current === "ready" || current === "cached" ? current : "loading",
				);
				const response = await fetch(buildWeatherUrl(location));
				if (!response.ok) throw new Error("Weather request failed");
				const data = await response.json();
				const nextWeather = normalizeWeather(data, location);

				if (!cancelled) {
					setWeather(nextWeather);
					setStatus("ready");
					writeCachedWeather(nextWeather);
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

function buildWeatherUrl(location) {
	const params = new URLSearchParams({
		latitude: String(location.latitude),
		longitude: String(location.longitude),
		current: "temperature_2m,weather_code,is_day",
		forecast_days: "1",
	});

	return `https://api.open-meteo.com/v1/forecast?${params}`;
}
