import { CalmLayout, FocusLayout } from "./layoutComponents.jsx";
import { userLayouts } from "./userLayouts.js";

export const builtInLayouts = [
	{
		id: "focus",
		name: "Focus",
		Component: FocusLayout,
		animateClock: false,
		theme: {
			accent: "#2f7de1",
			backgroundStart: "#0b1424",
			background: "#080f1d",
			backgroundDeep: "#040913",
		},
	},
	{
		id: "calm",
		name: "Calm",
		Component: CalmLayout,
		animateClock: true,
		theme: {
			accent: "#2f7de1",
			backgroundStart: "#091020",
			background: "#060b16",
			backgroundDeep: "#02040a",
		},
	},
];

export const layouts = [...builtInLayouts, ...userLayouts];
