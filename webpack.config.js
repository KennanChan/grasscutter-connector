const CopyWebpackPlugin = require("copy-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const { version } = require("./package.json")

const ZipWebpackPlugin = require("./webpack/ZipWebpackPlugin")
const path = require("path")

module.exports = {
  target: "node",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: `grasscutter-connector.js`
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
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          to: "public"
        }
      ]
    }),
    new ZipWebpackPlugin({
      noRootFolder: true,
      filename: `grasscutter-connector.${version}`
    })
  ]
}