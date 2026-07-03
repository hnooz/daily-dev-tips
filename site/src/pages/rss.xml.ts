import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const tips = await getCollection("tips");
  const assigned = tips
    .filter((e) => e.data.id)
    .sort(
      (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
    );

  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site ?? SITE_URL,
    items: assigned.map((e) => {
      const [stack] = e.id.split("/");
      const slug = e.id.split("/")[1].replace(".md", "");
      return {
        title: e.data.title,
        pubDate: new Date(e.data.publishedAt),
        description: `${e.data.tags.join(", ")} · by ${e.data.author.name}`,
        link: `/${stack}/${slug}/`,
        categories: [stack, ...e.data.tags],
        author: e.data.author.name,
      };
    }),
  });
};
