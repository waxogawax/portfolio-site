import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const diary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/diary' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const exhibitions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/exhibitions' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    venue: z.string(),
    city: z.string(),
    country: z.string().default('Japan'),
    type: z.enum(['solo', 'group', 'curated', 'other']).default('group'),
    role: z.string().default('artist'),
    artists: z.array(z.string()).default([]),
    description: z.string().optional(),
    cover: z.string().optional(),
    images: z
      .array(
        z.object({
          src: z.string(),
          caption: z.string().optional(),
          alt: z.string().optional(),
        })
      )
      .default([]),
    links: z
      .array(z.object({ label: z.string(), url: z.string() }))
      .default([]),
    press: z
      .array(
        z.object({
          title: z.string(),
          publication: z.string(),
          url: z.string().optional(),
          date: z.coerce.date().optional(),
        })
      )
      .default([]),
    social: z
      .object({ instagram: z.string().optional() })
      .optional(),
    relatedWorks: z.array(z.string()).default([]),
    relatedWritings: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const writings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writings' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  diary,
  works,
  exhibitions,
  writings,
};