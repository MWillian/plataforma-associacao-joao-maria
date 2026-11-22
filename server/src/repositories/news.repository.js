import { prisma } from '../lib/prisma.js';

const NEWS_INCLUDE = {
  images: { orderBy: { sortOrder: 'asc' } },
};

<<<<<<< HEAD
export class NewsRepository {
  findById(id) {
    return prisma.news.findUnique({ where: { id }, include: NEWS_INCLUDE });
  }

  list({ publicationArea, includeInactive = false, limit, skip = 0 }) {
    const where = {
      ...(includeInactive ? {} : { published: true }),
      ...(publicationArea ? { publicationArea } : {}),
    };

    return prisma.$transaction([
      prisma.news.findMany({
        where,
        include: NEWS_INCLUDE,
        skip,
        ...(limit ? { take: limit } : {}),
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
      prisma.news.count({ where }),
    ]);
  }

  async create(data) {
    const { images = [], ...news } = data;
    return prisma.news.create({
      data: {
        ...news,
        images: {
          create: images.map((url, index) => ({
            url,
            sortOrder: index,
          })),
        },
=======
function toImagesCreate(urls) {
  return {
    create: urls.map((url, index) => ({ url, sortOrder: index })),
  };
}

export class NewsRepository {
  // Notícias publicadas, da mais recente para a mais antiga.
  async listPublished() {
    return prisma.news.findMany({
      where: { published: true },
      include: NEWS_INCLUDE,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    });
  }

  async findById(id) {
    return prisma.news.findUnique({
      where: { id },
      include: NEWS_INCLUDE,
    });
  }

  async create({ images, ...data }) {
    return prisma.news.create({
      data: {
        ...data,
        ...(images && { images: toImagesCreate(images) }),
>>>>>>> origin/main
      },
      include: NEWS_INCLUDE,
    });
  }

<<<<<<< HEAD
  async update(id, data) {
    const { images, ...news } = data;

    return prisma.$transaction(async (tx) => {
      const updated = await tx.news.update({
        where: { id },
        data: news,
        include: NEWS_INCLUDE,
      });

      if (images !== undefined) {
        await tx.newsImage.deleteMany({ where: { newsId: id } });
        if (images.length > 0) {
          await tx.newsImage.createMany({
            data: images.map((url, index) => ({
              newsId: id,
              url,
              sortOrder: index,
            })),
          });
        }
      }

      return tx.news.findUnique({
        where: { id },
        include: NEWS_INCLUDE,
      });
    }).catch((error) => {
      if (error?.code === 'P2025') return null;
      throw error;
    });
  }

  async inactivate(id) {
=======
  // `images` só é alterado quando enviado: substitui as atuais.
  async update(id, { images, ...data }) {
    try {
      return await prisma.$transaction(async (tx) => {
        if (images) {
          await tx.newsImage.deleteMany({ where: { newsId: id } });
        }

        return tx.news.update({
          where: { id },
          data: {
            ...data,
            ...(images && { images: toImagesCreate(images) }),
          },
          include: NEWS_INCLUDE,
        });
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }

  async unpublish(id) {
>>>>>>> origin/main
    try {
      return await prisma.news.update({
        where: { id },
        data: { published: false },
        include: NEWS_INCLUDE,
      });
    } catch (error) {
<<<<<<< HEAD
      if (error?.code === 'P2025') return null;
=======
      if (error?.code === 'P2025') {
        return null;
      }

>>>>>>> origin/main
      throw error;
    }
  }
}
