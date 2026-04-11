import {
	WiCloudy,
	WiDayCloudy,
	WiDayFog,
	WiDayRain,
	WiDayShowers,
	WiDaySnow,
	WiDaySprinkle,
	WiDaySunny,
	WiDaySunnyOvercast,
	WiDayThunderstorm,
	WiNa,
	WiNightAltCloudy,
	WiNightAltRain,
	WiNightAltShowers,
	WiNightAltSnow,
	WiNightAltSprinkle,
	WiNightAltThunderstorm,
	WiNightClear,
	WiNightFog,
} from "react-icons/wi";

export function getWeatherIcon(code, isDay) {
	if (code === 0) {
		return isDay
			? { Icon: WiDaySunny, label: "Clear day" }
			: { Icon: WiNightClear, label: "Clear night" };
	}
	if (code === 1) {
		return isDay
			? { Icon: WiDaySunnyOvercast, label: "Mostly clear day" }
			: { Icon: WiNightAltCloudy, label: "Mostly clear night" };
	}
	if (code === 2) {
		return isDay
			? { Icon: WiDayCloudy, label: "Partly cloudy day" }
			: { Icon: WiNightAltCloudy, label: "Partly cloudy night" };
	}
	if (code === 3) {
		return isDay
			? { Icon: WiCloudy, label: "Overcast day" }
			: { Icon: WiNightAltCloudy, label: "Overcast night" };
	}
	if (code === 45 || code === 48) {
		return isDay
			? { Icon: WiDayFog, label: "Foggy day" }
			: { Icon: WiNightFog, label: "Foggy night" };
	}
	if (code >= 51 && code <= 57) {
		return isDay
			? { Icon: WiDaySprinkle, label: "Drizzly day" }
			: { Icon: WiNightAltSprinkle, label: "Drizzly night" };
	}
	if (code >= 61 && code <= 67) {
		return isDay
			? { Icon: WiDayRain, label: "Rainy day" }
			: { Icon: WiNightAltRain, label: "Rainy night" };
	}
	if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
		return isDay
			? { Icon: WiDaySnow, label: "Snowy day" }
			: { Icon: WiNightAltSnow, label: "Snowy night" };
	}
	if (code >= 80 && code <= 82) {
		return isDay
			? { Icon: WiDayShowers, label: "Showery day" }
			: { Icon: WiNightAltShowers, label: "Showery night" };
	}
	if (code >= 95) {
		return isDay
			? { Icon: WiDayThunderstorm, label: "Stormy day" }
			: { Icon: WiNightAltThunderstorm, label: "Stormy night" };
	}

	return { Icon: WiNa, label: "Not available" };
}
