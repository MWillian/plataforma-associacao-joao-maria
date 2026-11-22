import { prisma } from '../lib/prisma.js';

const NEWS_INCLUDE = {
  images: { orderBy: { sortOrder: 'asc' } },
};

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
      },
      include: NEWS_INCLUDE,
    });
  }

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
    try {
      return await prisma.news.update({
        where: { id },
        data: { published: false },
        include: NEWS_INCLUDE,
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }
}
