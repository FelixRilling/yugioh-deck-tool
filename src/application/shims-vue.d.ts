declare module "*.vue" {
	import Vue from "vue";
	export default Vue;
}

// Migration build
declare module "vue" {
	import type { CompatVue } from "@vue/runtime-dom";
	const Vue: CompatVue;
	export default Vue;
	export * from "@vue/runtime-dom";
	const { configureCompat } = Vue;
	export { configureCompat };
}
