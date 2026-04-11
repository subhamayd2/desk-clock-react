export function WeatherLine({ loading, children }) {
	if (loading) {
		return (
			<p className={`text-base text-zinc-400 sm:text-lg`}>
				Weather is loading.
			</p>
		);
	}

	return children;
}
