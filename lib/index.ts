export class CssPutter {
  private styleSheetsLength: number
  private cssRulesStack: { styleId: string; rulesLength: number }[]
  private ignoreStyleSheetIds: string[]
  rulesPrefix: string

  constructor(data?: { ignoreStyleSheetIds?: string[]; rulesPrefix?: string }) {
    this.ignoreStyleSheetIds = data?.ignoreStyleSheetIds || []
    this.cssRulesStack = []
    this.styleSheetsLength = document.styleSheets.length
    this.rulesPrefix = data?.rulesPrefix ?? ''
  }

  private addSelectorsPrefix() {
  }
  private insertRulesPrefixToRule(rule: string) {
    const regexp = /[^\s]+\s*(?={)|[^\s]+,/gm
    return rule.replace(regexp, `${this.rulesPrefix} $&`)
  }

  parse(css: string): string[] {
    const regexp = /^[^@\s](.*,\n)*.*{([^}]+)}/gm
    const cssArray = css.match(regexp) ?? []
    const cssAtRuleString = css.replace(regexp, '')

    const atRuleArray = ['']
    let atmarkflag = false
    let mustacheOpenCount = 0
    let mustacheCloseCount = 0

    // これらの設定は無視する
    const noMustacheAtRules = ['@charset', '@import', '@namespace']

    if (cssAtRuleString)
      for (const char of cssAtRuleString) {
        if (!atmarkflag) {
          if (char === '@') {
            atRuleArray[atRuleArray.length - 1] = '@'
            atmarkflag = true
          }
        } else if (mustacheOpenCount === 0) {
          if (char === '{') mustacheOpenCount = 1

          atRuleArray[atRuleArray.length - 1] += String(char)

          // {}で囲まれない@charsetなどの@で始まるcssルールは無視する
          if (noMustacheAtRules.includes(atRuleArray[atRuleArray.length - 1])) {
            atRuleArray[atRuleArray.length - 1] = ''
            atmarkflag = false
          }
        } else if (mustacheOpenCount === mustacheCloseCount) {
          atmarkflag = false
          mustacheOpenCount = 0
          mustacheCloseCount = 0
          atRuleArray.push('')
        } else if (mustacheOpenCount > mustacheCloseCount) {
          if (char === '{') mustacheOpenCount += 1
          if (char === '}') mustacheCloseCount += 1

          atRuleArray[atRuleArray.length - 1] += String(char)
        }
      }

    // 配列末尾の空文字(『}』の後に改行があれば空文字が入る)を削除
    if (!atRuleArray.at(-1)) {
      atRuleArray.pop()
    }

    if (this.rulesPrefix) {
      return cssArray.map((rule) => this.insertRulesPrefixToRule(rule))
      .concat(atRuleArray)
    }

    return cssArray.concat(atRuleArray)
  }

  private createRandomString() {
    return Math.random().toString(32).substring(8)
  }

  attachCssRules(data: string[]) {
    const styleId = this.createRandomString()
    // 削除時のためにattach情報の保持
    this.cssRulesStack.push({ styleId, rulesLength: data.length })

    // scriptタグとstyleタグの作成
    // 毎回新しく要素を作成しないと、2回目以降に反応してくれなくなる
    const style = document.createElement('style')

    // CSS styleの適用
    style.id = styleId

    document.head.appendChild(style)
    for (const rule of data) {
      style.sheet?.insertRule(rule)
    }
  }

  /**
   * 前回attachの情報の削除
   */
  detachPreviousRules() {
    const currentInfo = this.cssRulesStack.pop()

    if (!currentInfo) {
      console.error('stack empty')
      return
    }

    let dividedNumCustomRules = 0

    // 適用されているStyleSheetを全探査
    for (
      let i = 0;
      i < this.styleSheetsLength - 1 + dividedNumCustomRules;
      i++
    ) {
      const item = document.styleSheets.item(i)

      if (item?.href) continue
      // @ts-ignore
      if (this.ignoreStyleSheetIds.includes(item?.ownerNode?.id)) continue

      for (let j = 0; j < currentInfo.rulesLength - 1; j++) {
        try {
          item?.deleteRule(j)
        } catch (e) {
          // RuleがWebブラウザに勝手に分割される場合がある
          dividedNumCustomRules += 1
          break
        }
      }
    }

    // CSSを適用させていた要素の削除
    document.getElementById(currentInfo.styleId)?.remove()
  }
}
