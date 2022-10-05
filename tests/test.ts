import { CssPutter } from "../lib/index";

describe("CssPutter", () => {
  it('Rules head have white spaces ignored', () => {
    const cssPutter = new CssPutter()
    const css = `
    test_id {
      color: blue;
    }
    .test_class {
      color: red;
    }`
    const rules = cssPutter.parse(css)
    expect(rules).toHaveLength(0)
  })

  it('Expect Rules', () => {
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
});