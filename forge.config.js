module.exports = {
	publishers: [
		{
			name: "@electron-forge/publisher-github",
			config: {
				repository: {
					owner: "xXnikosXx",
					name: "OCL-Reporting-app",
				},
				prerelease: false,
				draft: true,
			},
		},
	],
};