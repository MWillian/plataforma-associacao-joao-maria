import { prisma } from '../lib/prisma.js';

export async function createProduct(data) {
  return await this.prisma.product.create({
    data,
  });
} 