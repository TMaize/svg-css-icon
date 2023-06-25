const fs = require('fs')
const path = require('path')
const { compressSVG, isColorful, encodeSVG } = require('./tool')

/**
 * 生成图标样式文件
 * @param {{input:string, output:string, class:string|'icon', encode: 'base64'|'utf8'}} options
 */
module.exports = function build(options) {
  if (!options.input) {
    throw new Error('input is required')
  }

  if (!options.output) {
    throw new Error('output is required')
  }

  if (options.encode && !['base64', 'utf8'].includes(options.encode)) {
    throw new Error('unknown encode type: ' + options.encode)
  }

  options.class = options.class || 'icon'
  options.input = path.resolve(options.input)
  options.output = path.resolve(options.output)

  const stat = fs.statSync(options.input)

  const files = []

  if (stat.isFile() && options.input.match(/\.svg$/i)) {
    files.push(path.resolve(options.input))
  }

  if (stat.isDirectory()) {
    fs.readdirSync(options.input).forEach(name => {
      if (name.match(/\.svg$/i)) {
        files.push(path.resolve(path.join(options.input, name)))
      }
    })
  }

  if (files.length == 0) {
    return
  }

  let content = fs.readFileSync(path.resolve(__dirname, 'base.css'), 'utf-8')
  content = content.replace('class', options.class)

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const name = path.basename(file).replace(/\.svg$/i, '')
    console.log(' build:', file)

    let svg = fs.readFileSync(file, 'utf-8')
    const colorful = isColorful(svg)
    svg = compressSVG(svg, colorful)
    svg = encodeSVG(svg, options.encode)

    if (colorful) {
      content += `\n.${options.class}-${name} {\n  background-image: url("${svg}");\n}\n`
    } else {
      content += `\n.${options.class}-${name} {\n  --data: url("${svg}");\n  mask-image: var(--data);\n  -webkit-mask-image: var(--data);\n  background-color: currentColor;\n}\n`
    }
  }

  console.log('output:', options.output)
  fs.writeFileSync(options.output, content)
}
