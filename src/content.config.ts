import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
	projects: defineCollection({
		// Load Markdown files in the src/content/projects directory.
		loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.string(),
			img_alt: z.string().optional(),
			github: z.string().optional(),
		}),
	}),
	posts: defineCollection({
		// Load Markdown files in the src/content/posts director
		loader: glob({ base: "./src/content/posts", pattern: "**/*.md" }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.string(),
			img_alt: z.string().optional(),
			// TODO: Move recipe as a specific Collection. These shouldnt be optional
			ingredients: z.array(z.string()),
			instructions: z.array(z.string()),
		}),
	}),
};
