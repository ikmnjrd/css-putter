import { CssPutter } from "../lib/index";

describe("CssPutter", () => {
  it('Rule have white spaces in head', () => {
    const cssPutter = new CssPutter()
    const css = `
    test_id {
      color: blue;
    }
    .test_class {
      color: red;
    }`
    const rules = cssPutter.parse(css)
    expect(rules).toHaveLength(2)
  })

  it('Two rules', () => {
    const cssPutter = new CssPutter()
    const css = `test_id {
  color: blue;
}
.test_class {
  color: red;
}`
    const rules = cssPutter.parse(css)
    expect(rules).toHaveLength(2)
  })

  it('Some selectors rule', () => {
    const cssPutter = new CssPutter()
    const css = `
.class-a,
.class-b {
  font-size: 16px;
}`
    const rules = cssPutter.parse(css)
    expect(rules).toHaveLength(1)
  })

  it('Atmark rule', () => {
    const cssPutter = new CssPutter()
    const css = `
@media screen and (min-width: 769px) {
  .main .container {
    background-color: transparent;
  }
}`
    const rules = cssPutter.parse(css)
    expect(rules).toHaveLength(1)
  })
});