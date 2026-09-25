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
    return prisma.product.create({
      data,
    });
  }

  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
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
      return await prisma.product.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error?.code === 'P2025') {
        return null;
      }

      throw error;
    }
  }
}
