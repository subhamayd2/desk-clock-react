import dayjs from "dayjs";
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

export function FocusLayout(props) {
	const { now, weather } = props;

	const date = dayjs(now).format("dddd, MMMM DD");
	const time = dayjs(now).format("hh:mm");

	return (
		<section className="grid min-h-[100svh] place-items-center px-5 py-8 sm:px-8">
			<div className="w-full max-w-6xl min-w-0">
				<div className="min-w-0">
					<p className="text-sm font-semibold uppercase tracking-normal text-[var(--clock-accent)] sm:text-base">
						{date}
					</p>
					<h1 className="mt-4 whitespace-nowrap text-[3.25rem] font-black leading-none tracking-normal text-white min-[360px]:text-[3.9rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem]">
						{time}
					</h1>
					<WeatherLine weather={weather} className="mt-8" />
				</div>
			</div>
		</section>
	);
}

export function CalmLayout(props) {
	const { now, weather } = props;

	const date = dayjs(now).format("dddd, MMMM DD");
	const time = dayjs(now).format("hh:mm:ss");
	const [hour, min, sec] = time.split(":");

	return (
		<section className="grid min-h-[100svh] place-items-center px-5 py-6 sm:px-8">
			<div className="min-w-0 text-center">
				<p className="text-lg text-[var(--clock-accent)] sm:text-4xl">{date}</p>
				<div className="flex gap-6 items-baseline">
					<h1 className="my-6 whitespace-nowrap text-[3.25rem] font-black leading-none tracking-normal min-[360px]:text-[3.9rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] xl:text-[11.5rem]">
						{hour}:{min}
					</h1>
					<h1 className="my-6 whitespace-nowrap text-7xl font-black leading-none tracking-normal text-zinc-600">
						{sec}
					</h1>
				</div>
				<WeatherLine weather={weather} className="justify-center" />
			</div>
		</section>
	);
}

function WeatherLine({ weather, className = "" }) {
	if (!weather) {
		return (
			<p className={`text-base text-zinc-400 sm:text-lg ${className}`}>
				Weather is loading.
			</p>
		);
	}

	return (
		<div
			className={`flex items-center gap-3 text-base text-zinc-300 sm:gap-4 sm:text-2xl ${className}`}
		>
			<WeatherIcon
				code={weather.weatherCode}
				isDay={weather.isDay}
				className="h-10 w-10 shrink-0 sm:h-14 sm:w-14"
			/>
			<p>{weather.temperature}°C</p>
		</div>
	);
}

function WeatherIcon({ code, isDay, className = "" }) {
	const isDaytime = isDay === 1 || isDay === true;
	const { Icon, label } = getWeatherIcon(code, isDaytime);

	return (
		<Icon
			className={`${className} text-[var(--clock-accent)] drop-shadow-[0_0_12px_rgba(47,125,225,0.35)]`}
			role="img"
			aria-label={`${label} weather`}
		/>
	);
}

function getWeatherIcon(code, isDay) {
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
