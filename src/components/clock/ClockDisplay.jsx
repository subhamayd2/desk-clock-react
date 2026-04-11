import { ClockGlyph } from "./ClockGlyph.jsx";

export function ClockDisplay({ value, animate = false, className = "" }) {
	return (
		<h1
			className={`flex whitespace-nowrap leading-none tracking-normal ${className}`}
			aria-label={value}
		>
			{!animate
				? value
				: value.split("").map((character, index) => (
						<ClockGlyph
							// biome-ignore lint/suspicious/noArrayIndexKey: stable clock character positions
							key={`${index}-${character === ":" ? "colon" : "digit"}`}
							value={character}
							animate={animate && character !== ":"}
							isSeparator={character === ":"}
						/>
					))}
		</h1>
	);
}
