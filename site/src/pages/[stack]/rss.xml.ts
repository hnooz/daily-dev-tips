import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { stackLabel } from "@/lib/stacks";
import type { APIRoute, GetStaticPaths } from "astro";

export const getStaticPaths: GetStaticPaths = async () => {
  const tips = await getCollection("tips");
  const stacks = [...new Set(tips.map((e) => e.id.split("/")[0]))];
  return stacks.map((stack) => ({ params: { stack } }));
};

export const GET: APIRoute = async (context) => {
  const { stack } = context.params;
  const tips = await getCollection("tips");
  const assigned = tips
    .filter((e) => e.id.startsWith(stack + "/") && e.data.id)
    .sort(
      (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
    );

  const label = stackLabel(stack ?? "");

  return rss({
    title: `${label} Tips — ${SITE_NAME}`,
    description: `Atomic ${label} developer tips. Community-curated, contributor-credited.`,
    site: context.site ?? SITE_URL,
    items: assigned.map((e) => {
      const slug = e.id.split("/")[1].replace(".md", "");
      return {
        title: e.data.title,
        pubDate: new Date(e.data.publishedAt),
        description: `${e.data.tags.join(", ")} · by ${e.data.author.name}`,
        link: `/${stack}/${slug}/`,
        categories: [stack ?? "", ...e.data.tags],
        author: e.data.author.name,
      };
    }),
  });
};
