const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "wiu7co",

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  coverage: {
    include: "src/**/*.js",
    exclude: [],
    reporters: ["html"],
    reporterOptions: {
      html: { dir: "coverage", subdir: "." }, // 指定覆盖率报告的输出目录
    },
  },



});
