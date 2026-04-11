import { FocusLayout, CalmLayout } from "./layoutComponents.jsx";
import { userLayouts } from "./userLayouts.js";

export const builtInLayouts = [
	{
		id: "focus",
		name: "Focus",
		Component: FocusLayout,
	},
	{
		id: "calm",
		name: "Calm",
		Component: CalmLayout,
	},
];

export const layouts = [...builtInLayouts, ...userLayouts];
