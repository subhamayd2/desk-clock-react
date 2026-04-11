import { describeWeather } from "./describeWeather.js";

export function normalizeWeather(data, location) {
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
