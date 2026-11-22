import { getCollection } from 'astro:content'

export const LANGUAGES = { typescript: 'TypeScript', dotnet: '.NET' } as const
export type Language = keyof typeof LANGUAGES

export interface NavItem {
  id: string
  name: string
}
export interface NavGroup {
  title: string
  items: NavItem[]
}

/** The page's `# Heading`, or its id when it has none. */
export function pageTitle(body: string | undefined, id: string): string {
  return /^# (.+)$/m.exec(body ?? '')?.[1].trim() ?? id
}

/**
 * The sidebar follows the language README: each `## Group` heading and the
 * `[`Name`](page.md)` rows in the table under it. Pages the README does not
 * list go in a final group of their own so nothing is unreachable.
 */
export async function buildNav(language: Language): Promise<NavGroup[]> {
  const entries = await getCollection(language)
  const readme = entries.find((entry) => entry.id === 'README')
  const groups: NavGroup[] = []
  const listed = new Set<string>(['README'])

  for (const line of (readme?.body ?? '').split(/\r?\n/)) {
    const heading = /^## (.+)$/.exec(line)
    if (heading) {
      groups.push({ title: heading[1].trim(), items: [] })
      continue
    }
    const row = /^\| \[`?([^`\]]+)`?\]\(([\w.-]+)\.md\)/.exec(line)
    if (row && groups.length) {
      groups.at(-1)!.items.push({ name: row[1], id: row[2] })
      listed.add(row[2])
    }
  }

  const other = entries
    .filter((entry) => !listed.has(entry.id))
    .map((entry) => ({ id: entry.id, name: pageTitle(entry.body, entry.id) }))
    .sort((a, b) => a.name.localeCompare(b.name))
  if (other.length) groups.push({ title: 'Not in the overview', items: other })

  return groups.filter((group) => group.items.length)
}
