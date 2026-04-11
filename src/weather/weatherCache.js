import { readStorage, writeStorage } from "../lib/storage.js";

export const WEATHER_CACHE_KEY = "desk-clock-weather";

export function readCachedWeather() {
	try {
		const raw = readStorage(WEATHER_CACHE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function writeCachedWeather(weather) {
	writeStorage(WEATHER_CACHE_KEY, JSON.stringify(weather));
}
