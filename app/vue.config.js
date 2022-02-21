const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const path = require("path");
module.exports = {
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ["python"],//configure your languages here
        features: ["coreCommands", "find"],
      }), // Place it here
    ],
  },
  chainWebpack: (config) => {
    config.resolve.alias.set(
      "vscode",
      path.resolve(
        "./node_modules/monaco-languageclient/lib/vscode-compatibility"
      )
    );
  },
};