#!/usr/bin/env node

const build = require('../src/index.js')

function getStringArg(name) {
  const idx = process.argv.indexOf('--' + name)
  if (idx == -1) return ''
  return process.argv[idx + 1]
}

try {
  build({
    input: getStringArg('input'),
    output: getStringArg('output'),
    class: getStringArg('class')
  })
} catch (err) {
  console.error(err.message)
  process.exit(1)
}
