const path = require("path")
const JSZip = require("jszip")
const { RawSource } = require("webpack-sources")
const zip = new JSZip()

class ZipWebpackPlugin {
  constructor(options) {
    this.options = options || {}
  }
  apply(compiler) {
    if (!this.options.filename) {
      throw new Error("filename is necessary!")
    }

    compiler.hooks.emit.tapAsync("ZipWebpackPlugin", async(compilation, callback) => {
      const folder = this.options.noRootFolder ? zip : zip.folder(this.options.folder);
      for (const filename in compilation.assets) {
        const source = compilation.assets[filename].source()
        folder.file(filename, source)
      }
      const content = await zip.generateAsync({ type: "nodebuffer" });
      const outputPath = path.join(
        compilation.options.output.path,
        this.options.filename + ".zip"
      )
      const outputRelativePath = path.relative(
        compilation.options.output.path,
        outputPath
      )
      compilation.assets[outputRelativePath] = new RawSource(content)
      this.options.onZipped && this.options.onZipped(outputPath);
      callback()
    })
  }
}

module.exports = ZipWebpackPlugin
