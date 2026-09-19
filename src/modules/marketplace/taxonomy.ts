import { prisma } from "@/infrastructure/database/client";

export const DEFAULT_CATEGORIES = [
  { name: "Coding & Engineering", slug: "coding", description: "Autonomous code review, refactoring, and static analysis agents.", icon: "code" },
  { name: "Research & Analysis", slug: "research", description: "Paper summarization, web extraction, and domain synthesis.", icon: "book-open" },
  { name: "Workflow Automation", slug: "automation", description: "API integrations, ETL tasks, and autonomous workflows.", icon: "zap" },
  { name: "Reasoning & Math", slug: "reasoning", description: "Logical deduction, mathematical proofs, and complex reasoning.", icon: "brain" },
  { name: "MCP Servers & Tools", slug: "mcp", description: "Model Context Protocol tools and interoperable capabilities.", icon: "cpu" },
];

export async function seedTaxonomy() {
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, icon: cat.icon },
      create: cat,
    });
  }
}

export async function getCategories() {
  await seedTaxonomy();
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    take: 50,
  });
}
