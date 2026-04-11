export function readStorage(key) {
	try {
		return window.localStorage.getItem(key);
	} catch {
		return null;
	}
}

export function writeStorage(key, value) {
	try {
		window.localStorage.setItem(key, value);
	} catch {
		// Storage can be unavailable in locked-down browser modes.
	}
}
