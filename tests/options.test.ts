import { CssPutter } from "../lib/index";

describe.only("RulesPrefix", () => {
  const prefix = '#prefix'
  const regexp = /#prefix[\s].*{([^}]+)}/

  it('simplest usage', () => {
    const cssPutter = new CssPutter({rulesPrefix: prefix})
    const css = `
.class {
  color: blue;
}`
    const rules = cssPutter.parse(css)
    expect(rules).toHaveLength(1)

    expect(rules[0]).toMatch(regexp)
  })

  it('two selectors in some lines', () => {
    const cssPutter = new CssPutter({rulesPrefix: prefix})
    const css = `
.first,
.second {
  color: blue;
}`
    const regexpTwoSelectorWithPrefix = /#prefix\s(.*,\n)*#prefix\s.*{([^}]+)}/gm
    const rules = cssPutter.parse(css)
    expect(rules).toHaveLength(1)

    expect(rules[0]).toMatch(regexpTwoSelectorWithPrefix)
  })

  it('two selectors in a line', () => {
    const cssPutter = new CssPutter({rulesPrefix: prefix})
    const css = `
div, p, body {
  color: red;
}
`
    const regexpTwoSelectorWithPrefix = /#prefix div, #prefix p, #prefix body {/gm
    const rules = cssPutter.parse(css)
    expect(rules).toHaveLength(1)
    expect(rules[0]).toMatch(regexpTwoSelectorWithPrefix)
  })
})