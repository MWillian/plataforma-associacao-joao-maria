import { prisma } from '../lib/prisma.js';

const PRODUCT_INCLUDE = {
  images: { orderBy: { sortOrder: 'asc' } },
};

function toImagesCreate(urls) {
  return {
    create: urls.map((url, index) => ({ url, sortOrder: index })),
  };
}

export class ProductRepository {
  async listActiveHighlights(category) {
    return prisma.product.findMany({
      where: {
        active: true,
        category,
      },
      include: PRODUCT_INCLUDE,
      take: 5,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' },
      ],
    });
  }

  async listActive({ skip, take, category }) {
    const where = {
      active: true,
      ...(category && { category }),
    };

    const [items, totalItems] =
      await prisma.$transaction([
        prisma.product.findMany({
          where,
          include: PRODUCT_INCLUDE,
          skip,
          take,
          orderBy: [
            { title: 'asc' },
            { id: 'asc' },
          ],
        }),
        prisma.product.count({
          where,
        }),
      ]);

    return {
      items,
      totalItems,
    };
  }

  // Painel admin: todos os produtos, ativos e inativos.
  async listAll() {
    return prisma.product.findMany({
      include: PRODUCT_INCLUDE,
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
  }

  // Título é único sem diferenciar maiúsculas de minúsculas.
  async findByTitle(title) {
    return prisma.product.findFirst({
      where: { title: { equals: title, mode: 'insensitive' } },
    });
  }

  async create({ images, ...data }) {
    return prisma.product.create({
      data: {
        ...data,
        ...(images && { images: toImagesCreate(images) }),
      },
      include: PRODUCT_INCLUDE,
    });
  }

  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });
  }

  async inactivate(id) {
    try {
      return await prisma.product.update({
        where: { id },
        data: {
          active: false,
        },
        include: PRODUCT_INCLUDE,
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }

  // Exclusão definitiva (produto não tem histórico vinculado). Imagens saem
  // em cascata. Retorna null se o produto não existir.
  async remove(id) {
    try {
      return await prisma.product.delete({ where: { id } });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }

  async activate(id) {
    try {
      return await prisma.product.update({
        where: { id },
        data: {
          active: true,
        },
        include: PRODUCT_INCLUDE,
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }

  // `images` (lista de URLs) só é alterado quando enviado: substitui as atuais.
  async update(id, { images, ...data }) {
    try {
      return await prisma.$transaction(async (tx) => {
        if (images) {
          await tx.productImage.deleteMany({
            where: { productId: id },
          });
        }

        return tx.product.update({
          where: { id },
          data: {
            ...data,
            ...(images && { images: toImagesCreate(images) }),
          },
          include: PRODUCT_INCLUDE,
        });
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }
}
