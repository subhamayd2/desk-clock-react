import dayjs from "dayjs";
import { ClockDisplay } from "../components/clock/ClockDisplay.jsx";
import { WeatherIcon } from "../components/weather/WeatherIcon.jsx";
import { WeatherLine } from "../components/weather/WeatherLine.jsx";

export function CalmLayout({ now, weather, animateClock }) {
	const date = dayjs(now).format("dddd, MMMM DD");
	const time = dayjs(now).format("hh:mm:ss");
	const [hour, min, sec] = time.split(":");

	return (
		<section className="clock-background grid min-h-[100svh] place-items-center px-5 py-6 sm:px-8">
			<div className="min-w-0 text-center">
				<p className="text-5xl text-[var(--clock-accent)] uppercase">{date}</p>
				<div className="flex gap-6 items-baseline">
					<ClockDisplay
						value={`${hour}:${min}`}
						animate={animateClock}
						className="my-6 text-[20rem] font-semibold text-zinc-200"
					/>
					<ClockDisplay
						value={sec}
						animate={animateClock}
						className="my-6 text-[8rem] text-zinc-600"
					/>
				</div>
				<WeatherLine loading={!weather}>
					<div className="flex gap-4 items-center justify-center">
						<WeatherIcon
							code={weather.weatherCode}
							isDay={weather.isDay}
							className={"h-32 w-32 shrink-0 text-[var(--clock-accent)]"}
						/>
						<p className="text-6xl">{weather.temperature}°C</p>
					</div>
				</WeatherLine>
			</div>
		</section>
	);
}
