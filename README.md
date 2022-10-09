# css-putter
css-putter apply CSS file on a web page at a time, whenever you hope yourself timing.

## Install

```bash
npm install css-putter
```

```bash
yarn add css-putter
```

## Usage
```javascript
import { CssPutter } from 'css-putter'
// your css text
const cssText = `
h1,
h2 {
  margin: 0;
}

ol,
ul {
  list-style: none;
  padding: 0;
}
`
// init
const cssPutter = new CssPutter()
// parse to css rules for insert stylesheets object
const parsedCss = cssPutter.parse(css)
// attach css rules. At this time, the rules is push in stack to detach.
cssPutter.attachCssRules(parsedCss)

// you can detach injected css anytime
setTimeout(() => {
  cssPutter.detachPreviousRules()
}, 3000)

```

### Custom Options
#### rulesPrefix
When you use rulesPrefix option, css-putter added custom prefix in your parsed css rules.
```html
<html>
  <body>
    <div id="my-app">
      /* ... */
    </div>
    <div>
      <div>I hope any rules do not apply here</div>
    </div>
  </body>
</html>
```

```javascript
import { CssPutter } from 'css-putter'
const cssPutter = new cssPutter({rulesPrefix: '#my-app'})
const parsedCssWithPrefix = cssPutter.parse(css)
cssPutter.attachCssRules(parsedCssWithPrefix)
```

#### ignoreStyleSheetIds
if you use async loaded css, this option may help you.

## Notice
### whitespaces
A rule have whitespaces in the head, fails in parse.  
Below is an example.
```css
  div { margin: 0 }
```

### rules prefix
`rulesPrefix` do not apply `@xxxx` rules

## Not Supported CSS Rules
- @charset
- @import
- @namespace

## License

MIT