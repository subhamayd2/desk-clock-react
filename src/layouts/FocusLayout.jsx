import dayjs from "dayjs";
import { ClockDisplay } from "../components/clock/ClockDisplay.jsx";
import { WeatherIcon } from "../components/weather/WeatherIcon.jsx";
import { WeatherLine } from "../components/weather/WeatherLine.jsx";

export function FocusLayout({ now, weather, animateClock }) {
	const date = dayjs(now).format("dddd, MMMM DD");
	const time = dayjs(now).format("hh:mm");

	return (
		<section className="clock-background grid min-h-[100svh] place-items-center px-5 py-8 sm:px-8">
			<div className="w-full max-w-6xl min-w-0">
				<div className="min-w-0">
					<p className="text-4xl font-semibold uppercase tracking-normal text-[var(--clock-accent)]">
						{date}
					</p>
					<ClockDisplay
						value={time}
						animate={animateClock}
						className="mt-4 text-[20rem]"
					/>
					<WeatherLine loading={!weather}>
						<div className="flex gap-4 items-center">
							<WeatherIcon
								code={weather.weatherCode}
								isDay={weather.isDay}
								className={"h-32 w-32 shrink-0 text-[var(--clock-accent)]"}
							/>
							<p className="text-6xl">{weather.temperature}°C</p>
						</div>
					</WeatherLine>
				</div>
			</div>
		</section>
	);
}
