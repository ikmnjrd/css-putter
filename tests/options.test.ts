import { CssPutter } from "../lib/index";

describe.only("Options - rulesPrefix", () => {
  const prefix = '#prefix'
  const regexp = /#prefix[\s].*{([^}]+)}/

  it('simplest', () => {
    const cssPutter = new CssPutter({rulesPrefix: '#prefix'})
    const css = `
.class {
  color: blue;
}`
    const rules = cssPutter.parse(css)
    expect(rules).toHaveLength(1)

    expect(rules[0]).toMatch(regexp)
  })
})