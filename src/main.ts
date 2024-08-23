//! IF ANYTHING IN THIS FILE IS CHANGED MAKE SURE setVersion.js HAS ALSO BEEN UPDATED
import App from "./App.svelte";
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

injectSpeedInsights();
inject();
const app = new App({
	target: document.body,
	props: {
		version: "1.5.2",
	}
});

export default app;