const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  target: "node",
  entry: "./src/index.ts",
  output: {
    filename: "grasscutter-connector.js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: "ts-loader"
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          to: "public"
        }
      ]
    })
  ]
}