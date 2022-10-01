import { CssInjector } from '../dist/index.js'

const res = await fetch('http://127.0.0.1:8080/example/sample.css')
const blob = await res.blob()
const css = await blob.text()

const res2 = await fetch('http://127.0.0.1:8080/example/sample-2.css')
const blob2 = await res2.blob()
const css2 = await blob2.text()

const cssInjector = new CssInjector()

const cssParsed = cssInjector.parse(css)
cssInjector.attachCssRules(cssParsed)

const cssParsed2 = cssInjector.parse(css2)
cssInjector.attachCssRules(cssParsed2)

setTimeout(() => {
  cssInjector.detachPreviousRules()
}, 1500)

setTimeout(() => {
  cssInjector.detachPreviousRules()
}, 3000)
