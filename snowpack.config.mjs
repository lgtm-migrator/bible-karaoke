/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  extends: "electron-snowpack/config/snowpack.js",
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-webpack",
    "@snowpack/plugin-typescript",
  ],
  packageOptions: {
    external: ["ava"],
  },
  buildOptions: {
    baseUrl: "./",
  },
  testOptions: {
    files: ["src/**/*.spec.*", "src/**/*.integration.*"],
  },
  /* use alias when importing */
  alias: {
    "@app": "./src/",
  },
};
