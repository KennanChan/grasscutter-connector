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
  }
}