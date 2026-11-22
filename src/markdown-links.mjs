import path from 'node:path'

const LANGUAGES = ['typescript', 'dotnet']

/** The site URL for a page: `/typescript/` for a README, `/typescript/barcode` otherwise. */
export function pageUrl(language, id) {
  return id === 'README' ? `/${language}/` : `/${language}/${id}`
}

/**
 * The pages link to each other as files (`barcode.md`, `../dotnet/README.md`)
 * so they read correctly on GitHub. Rewrite those links to site URLs.
 */
export function remarkMarkdownLinks() {
  return (tree, file) => {
    const source = file.path ?? file.history?.[0]
    if (!source) return
    const language = path.basename(path.dirname(source))
    if (!LANGUAGES.includes(language)) return

    const visit = (node) => {
      if (node.type === 'link' && typeof node.url === 'string') {
        const match = /^(?:\.\.\/([a-z]+)\/)?([\w.-]+)\.md(#.*)?$/.exec(node.url)
        if (match) {
          const [, otherLanguage, id, hash = ''] = match
          node.url = pageUrl(otherLanguage ?? language, id) + hash
        }
      }
      node.children?.forEach(visit)
    }
    visit(tree)
  }
}
