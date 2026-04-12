import dayjs from "dayjs";
import { ClockDisplay } from "../components/clock/ClockDisplay.jsx";
import { WeatherIcon } from "../components/weather/WeatherIcon.jsx";
import { WeatherLine } from "../components/weather/WeatherLine.jsx";

export function CalmLayout({ now, weather, animateClock }) {
	const date = dayjs(now).format("dddd, MMMM DD");
	const time = dayjs(now).format("hh:mm:ss");
	const [hour, min, sec] = time.split(":");

	return (
		<section className="clock-background grid min-h-svh place-items-center px-5 py-6 sm:px-8">
			<div className="flex flex-col gap-2 min-w-0 text-center">
				<p className="text-7xl text-[#b0d3ff] uppercase font-inter">{date}</p>
				<div className="flex gap-6 items-baseline">
					<div className="flex gap-3">
						<ClockDisplay
							value={hour}
							animate={animateClock}
							className="text-[20rem] font-semibold text-zinc-200"
						/>
						<p className="text-[20rem] leading-none tracking-normal font-semibold font-inter text-(--clock-accent) opacity-50">
							:
						</p>
						<ClockDisplay
							value={min}
							animate={animateClock}
							className="text-[20rem] font-semibold text-zinc-200"
						/>
					</div>
					<ClockDisplay
						value={sec}
						animate={animateClock}
						className="text-[8rem] text-zinc-600"
					/>
				</div>
				<WeatherLine loading={!weather}>
					<div className="flex gap-4 items-center justify-center">
						<WeatherIcon
							code={weather.weatherCode}
							isDay={weather.isDay}
							className={"h-56 w-56 shrink-0 text-(--clock-accent)"}
						/>
						<p className="text-8xl text-[#b0d3ff] font-inter">
							{weather.temperature}
							<span className="text-6xl ml-4 opacity-80">°C</span>
						</p>
					</div>
				</WeatherLine>
			</div>
		</section>
	);
}
