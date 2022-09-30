export class CssInjector {
  css: string
  styleId: string
  previousCssRulesLength: number
  ignoreStyleSheetIds: string[]
  styleSheetsLength: number

  constructor(css?: string, ignoreStyleSheetIds?: string[]) {
    this.css = css ?? ''
    this.styleId = 'hoge'
    this.previousCssRulesLength = 0 // 配列の方がいいかも
    this.ignoreStyleSheetIds = ignoreStyleSheetIds || []
    this.styleSheetsLength = document.styleSheets.length
  }

  parse(css = '', rulesPrefix = ''): string[] {
    if (css) {
      this.css = css
    }

    const cssArray = css.match(/^[^@\s].*{([^}]+)}/gm) ?? []
    const cssAtRuleString = css.replace(/^[^@\s].*{([^}]+)}/gm, '') as string

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

    // 配列末尾の空文字を削除
    atRuleArray.pop()

    return cssArray.map((rule) => `${rulesPrefix} ${rule}`).concat(atRuleArray)
  }

  attachCSS(data: string[]) {
    // scriptタグとstyleタグの作成
    // 毎回新しく要素を作成しないと、2回目以降に反応してくれなくなる
    const style = document.createElement('style')

    // CSS styleの適用
    style.id = this.styleId
    document.head.appendChild(style)
    for (const rule of data) {
      style.sheet?.insertRule(rule)
    }
    // 次回プレビュー時に削除のため保持しておく
    this.previousCssRulesLength = data.length
  }

  detachCSS() {
    // const previousCssRulesLength = this.previousCssRulesLengthArray.at(-1)
    // if(!previousCssRulesLength || previousCssRulesLength < 1) {
    //   throw new Error('not exists attached css rules')
    // }
    /**
     * 前回attachの情報の削除
     */
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

      for (let j = 0; j < this.previousCssRulesLength - 1; j++) {
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
    document.getElementById(this.styleId)?.remove()
  }
}
