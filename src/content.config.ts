import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

// The generated reference pages, read in place. The id is the file name
// without `.md`, so `barcode.md` in both folders gives the same id.
const reference = (base: string) =>
  defineCollection({
    loader: glob({ pattern: '*.md', base, generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  })

export const collections = {
  typescript: reference('./typescript'),
  dotnet: reference('./dotnet'),
}
