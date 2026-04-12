import dayjs from "dayjs";
import { ClockDisplay } from "../components/clock/ClockDisplay.jsx";
import { WeatherIcon } from "../components/weather/WeatherIcon.jsx";
import { WeatherLine } from "../components/weather/WeatherLine.jsx";

export function FocusLayout({ now, weather, animateClock }) {
	const date = dayjs(now).format("dddd, MMMM DD");
	const time = dayjs(now).format("hh:mm");

	return (
		<section className="clock-background grid min-h-svh place-items-center px-5 py-8 sm:px-8">
			<div className="w-full max-w-6xl min-w-0">
				<div className="min-w-0">
					<p className="text-7xl font-semibold uppercase tracking-normal text-(--clock-accent)">
						{date}
					</p>
					<ClockDisplay
						value={time}
						animate={animateClock}
						className="mt-4 text-[20rem] font-inter font-bold"
					/>
					<WeatherLine loading={!weather}>
						<div className="flex gap-4 items-center">
							<WeatherIcon
								code={weather.weatherCode}
								isDay={weather.isDay}
								className={"h-48 w-48 shrink-0 text-(--clock-accent)"}
							/>
							<p className="text-8xl">{weather.temperature}°C</p>
						</div>
					</WeatherLine>
				</div>
			</div>
		</section>
	);
}
