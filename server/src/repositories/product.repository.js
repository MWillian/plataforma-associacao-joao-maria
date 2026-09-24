import { prisma } from '../lib/prisma.js';

export class ProductRepository {
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
}
