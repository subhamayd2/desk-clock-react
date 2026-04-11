import { useEffect, useState } from "react";

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
							// biome-ignore lint/suspicious/noArrayIndexKey: s
							key={`${index}-${character === ":" ? "colon" : "digit"}`}
							value={character}
							animate={animate && character !== ":"}
							isSeparator={character === ":"}
						/>
					))}
		</h1>
	);
}

function ClockGlyph({ value, animate, isSeparator }) {
	const [glyph, setGlyph] = useState({
		current: value,
		previous: null,
		nonce: 0,
	});

	useEffect(() => {
		setGlyph((currentGlyph) => {
			if (currentGlyph.current === value) return currentGlyph;

			return {
				current: value,
				previous: currentGlyph.current,
				nonce: currentGlyph.nonce + 1,
			};
		});
	}, [value]);

	useEffect(() => {
		if (glyph.previous === null) return undefined;

		const timer = window.setTimeout(() => {
			setGlyph((currentGlyph) => ({ ...currentGlyph, previous: null }));
		}, 280);

		return () => window.clearTimeout(timer);
	}, [glyph.previous]);

	if (!animate || isSeparator) {
		return (
			<span className={isSeparator ? "clock-separator" : "clock-glyph"}>
				{value}
			</span>
		);
	}

	return (
		<span className="clock-glyph clock-glyph-animated">
			{glyph.previous !== null && (
				<span key={`old-${glyph.nonce}`} className="clock-glyph-old">
					{glyph.previous}
				</span>
			)}
			<span
				key={`new-${glyph.nonce}`}
				className={glyph.previous === null ? "" : "clock-glyph-new"}
			>
				{glyph.current}
			</span>
		</span>
	);
}
