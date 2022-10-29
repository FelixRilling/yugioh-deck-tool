const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
	lintOnSave: false,

	publicPath: "./",
	filenameHashing: false, // Cannot be used due to external embedding of dist output.
	chainWebpack: (config) => {
		// We have an additional entry point for standalone tooltip usage.
		config
			.entry("app")
			.delete("./src/main.ts")
			.add("./src/application/main.ts");
		config.entry("tooltip").add("./src/tooltip/main.ts");

		// Only use code common to both entry points for chunks, no vendor chunks.
		config.optimization.splitChunks({
			cacheGroups: {
				common: {
					name: "common",
					minChunks: 2,
					priority: -20,
					chunks: "initial",
					reuseExistingChunk: true,
				},
			},
		});

		// Always use ESM version as the normal version clutters `window` and causes issues when other JS code brings their own version.
		config.resolve.alias.set("lodash$", "lodash-es");


		// https://v3-migration.vuejs.org/migration-build.html
		config.resolve.alias.set('vue', '@vue/compat')
		config.module
			.rule('vue')
			.use('vue-loader')
			.tap((options) => {
				return {
					...options,
					compilerOptions: {
						compatConfig: {
							MODE: 2
						}
					}
				}
			})
	},
});
