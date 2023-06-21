const { optimize } = require('svgo')
const sax = require('@trysound/sax')

/**
 * 压缩SVG
 * @param {string} content svg内容
 * @param {boolean} colorful 是否为彩色
 * @return {string}
 */
function compressSVG(content, colorful) {
  const plugins = ['preset-default']

  if (!colorful) {
    plugins.push({
      name: 'removeAttrs',
      params: {
        attrs: 'fill'
      }
    })
  }

  return optimize(content, { plugins }).data
}

/**
 * 是否为彩色svg
 * @param {string} content svg内容
 * @return {boolean}
 */
function isColorful(content) {
  const parser = sax.parser(true)

  const map = {}
  let err = null

  parser.onerror = function (e) {
    err = e
  }

  parser.onattribute = function (attr) {
    if (attr.name.toUpperCase() === 'FILL') {
      map[attr.value] = 1
    }
  }

  parser.write(content).close()

  if (err) {
    throw err
  }

  return Object.keys(map).length > 1
}

/**
 * 编码为css格式的svg
 * @param {string} content svg内容
 * @return {string}
 */
function encodeSVG(content) {
  const buffer = Buffer.from(content)
  return (dataUri = `data:image/svg+xml;base64,${buffer.toString('base64')}`)
}

module.exports = {
  compressSVG,
  isColorful,
  encodeSVG
}
