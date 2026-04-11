import { getWeatherIcon } from "../../weather/getWeatherIcon.js";

export function WeatherIcon({ code, isDay, className = "" }) {
	const isDaytime = isDay === 1 || isDay === true;
	const { Icon, label } = getWeatherIcon(code, isDaytime);

	return (
		<Icon className={className} role="img" aria-label={`${label} weather`} />
	);
}
