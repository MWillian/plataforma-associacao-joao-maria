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
      take: 3,
      orderBy: [
        { title: 'asc' },
        { id: 'asc' },
      ],
      include: { images: { orderBy: { sortOrder: 'asc' } } },
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
          include: { images: { orderBy: { sortOrder: 'asc' } } },
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

<<<<<<< HEAD
  async create(data) {
    const { images = [], ...product } = data;
    return prisma.product.create({
      data: {
        ...product,
        images: {
          create: images.map((url, index) => ({ url, sortOrder: index })),
        },
      },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
=======
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
>>>>>>> origin/main
    });
  }

  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
<<<<<<< HEAD
      include: { images: { orderBy: { sortOrder: 'asc' } } },
=======
      include: PRODUCT_INCLUDE,
>>>>>>> origin/main
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

<<<<<<< HEAD
  async remove(id) {
    try {
      return await prisma.product.delete({
        where: { id },
        include: { images: true },
      });
=======
  // Exclusão definitiva (produto não tem histórico vinculado). Imagens saem
  // em cascata. Retorna null se o produto não existir.
  async remove(id) {
    try {
      return await prisma.product.delete({ where: { id } });
>>>>>>> origin/main
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
<<<<<<< HEAD
      const { images, ...product } = data;
      return await prisma.$transaction(async (tx) => {
        await tx.product.update({
          where: { id },
          data: product,
        });

        if (images !== undefined) {
          await tx.productImage.deleteMany({ where: { productId: id } });
          if (images.length > 0) {
            await tx.productImage.createMany({
              data: images.map((url, index) => ({
                productId: id,
                url,
                sortOrder: index,
              })),
            });
          }
        }

        return tx.product.findUnique({
          where: { id },
          include: { images: { orderBy: { sortOrder: 'asc' } } },
=======
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
>>>>>>> origin/main
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
