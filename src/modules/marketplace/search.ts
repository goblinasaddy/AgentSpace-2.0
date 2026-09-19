import { prisma } from "@/infrastructure/database/client";

export interface MarketplaceSearchParams {
  query?: string;
  category?: string;
  tag?: string;
  verifiedOnly?: boolean;
  sortBy?: "popular" | "newest" | "trending";
  page?: number;
  limit?: number;
}

export async function searchMarketplace(params: MarketplaceSearchParams = {}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;

  const whereClause: any = {
    visibility: "PUBLIC",
  };

  if (params.query) {
    const q = params.query.toLowerCase();
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (params.category) {
    whereClause.agents = {
      some: {
        categories: {
          some: {
            category: {
              slug: params.category.toLowerCase(),
            },
          },
        },
      },
    };
  }

  if (params.tag) {
    whereClause.agents = {
      some: {
        tags: {
          some: {
            tag: {
              slug: params.tag.toLowerCase(),
            },
          },
        },
      },
    };
  }

  if (params.verifiedOnly) {
    whereClause.agents = {
      some: {
        versions: {
          some: {
            verificationBadges: {
              some: {},
            },
          },
        },
      },
    };
  }

  const orderByClause: any =
    params.sortBy === "newest"
      ? { createdAt: "desc" }
      : { stars: { _count: "desc" } };

  const [total, items] = await Promise.all([
    prisma.repository.count({ where: whereClause }),
    prisma.repository.findMany({
      where: whereClause,
      include: {
        owner: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        _count: {
          select: { stars: true, forks: true },
        },
        agents: {
          include: {
            categories: {
              include: { category: true },
            },
            tags: {
              include: { tag: true },
            },
            versions: {
              orderBy: { publishedAt: "desc" },
              take: 1,
              include: {
                verificationBadges: true,
              },
            },
          },
        },
      },
      orderBy: orderByClause,
      skip,
      take: limit,
    }),
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
