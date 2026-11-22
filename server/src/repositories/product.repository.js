import { prisma } from '../lib/prisma.js';

export class ProductRepository {
  async listActiveHighlights(category) {
    return prisma.product.findMany({
      where: {
        active: true,
        category,
      },
      take: 3,
      orderBy: [
        { title: 'asc' },
        { id: 'asc' },
      ],
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async listActive({ skip, take }) {
    const where = {
      active: true,
    };

    const [items, totalItems] =
      await prisma.$transaction([
        prisma.product.findMany({
          where,
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

  async findByTitle(title) {
    return prisma.product.findUnique({
      where: { title },
    });
  }

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
    });
  }

  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async inactivate(id) {
    try {
      return await prisma.product.update({
        where: { id },
        data: {
          active: false,
        },
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }

  async remove(id) {
    try {
      return await prisma.product.delete({
        where: { id },
        include: { images: true },
      });
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
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }

  async update(id, data) {
    try {
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
