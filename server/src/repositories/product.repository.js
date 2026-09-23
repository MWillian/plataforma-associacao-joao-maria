import { prisma } from '../lib/prisma.js';

export class ProductRepository {
  async findByTitle(title) {
    return prisma.product.findFirst({
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
}
