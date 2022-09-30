import { CssInjector } from './dist/lib/hoge.js'
// import css from './sample.css'

const res = await fetch('http://127.0.0.1:8080/sample.css')
const blob = await res.blob()
console.log({ blob })
const css = await blob.text()
console.log(css)

const res2 = await fetch('http://127.0.0.1:8080/sample.css')
const blob2 = await res2.blob()
const css2 = await blob2.text()

const cssInjector = new CssInjector(css)

const cssParsed = cssInjector.parse(css)
cssInjector.attachCSS(cssParsed)

const cssParsed2 = cssInjector.parse(css2)
cssInjector.attachCSS(cssParsed2)

setTimeout(() => {
  cssInjector.detachCSS()
}, 1500)

setTimeout(() => {
  cssInjector.detachCSS()
}, 3000)
