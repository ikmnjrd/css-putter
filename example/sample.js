import { CssPutter } from '../dist/index.js'

const res = await fetch('http://127.0.0.1:8080/example/sample.css')
const blob = await res.blob()
const css = await blob.text()

const res2 = await fetch('http://127.0.0.1:8080/example/sample-2.css')
const blob2 = await res2.blob()
const css2 = await blob2.text()

const cssPutter = new CssPutter()

const cssParsed = cssPutter.parse(css)
cssPutter.attachCssRules(cssParsed)

const cssParsed2 = cssPutter.parse(css2)
cssPutter.attachCssRules(cssParsed2)

setTimeout(() => {
  cssPutter.detachPreviousRules()
}, 1500)

setTimeout(() => {
  cssPutter.detachPreviousRules()
}, 3000)
