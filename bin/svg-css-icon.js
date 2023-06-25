#!/usr/bin/env node

const build = require('../src/index.js')

function getStringArg(name) {
  const idx = process.argv.indexOf('--' + name)
  if (idx == -1) return ''
  return process.argv[idx + 1]
}

function printHelp() {
  console.log(`
Nodejs-based tool for convert SVG to css icons.

Usage:
  svg-css-icon [flags]

Flags:
  --input  string   svg path or directory
  --output string   css output path
  --class  string   icon class name (default "icon")
  --encode string   svg encode type. base64/xml (default "base64")
`)
}

try {
  if (process.argv.includes('--help')) {
    printHelp()
    return
  }
  build({
    input: getStringArg('input'),
    output: getStringArg('output'),
    class: getStringArg('class'),
    encode: getStringArg('encode')
  })
} catch (err) {
  console.error(err.message)
  process.exit(1)
}
