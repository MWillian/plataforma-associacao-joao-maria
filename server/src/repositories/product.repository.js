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
}
