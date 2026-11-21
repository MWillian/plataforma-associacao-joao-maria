import { prisma } from '../lib/prisma.js';

export class ClassRepository {
  async create(data) {
    return prisma.class.create({
      data,
    });
  }

  async update(id, data) {
    try {
      return await prisma.class.update({
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

  async findById(id) {
    return prisma.class.findUnique({
      where: { id },
    });
  }

  async inactivate(id) {
    try {
      return await prisma.class.update({
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
