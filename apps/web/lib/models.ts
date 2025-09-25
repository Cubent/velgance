import { PrismaClient } from '@repo/database/generated/client';

const prisma = new PrismaClient();

export interface Model {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  igProfileLink?: string | null;
  image: string;
  height?: string | null;
  weight?: string | null;
  location?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateModelData {
  firstName: string;
  lastName: string;
  email: string;
  igProfileLink?: string;
  image: string;
  height?: string;
  weight?: string;
  location?: string;
}

export const getModels = async (): Promise<Model[]> => {
  const models = await prisma.model.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });
  return models;
};

export const getModelById = async (id: string): Promise<Model | null> => {
  const model = await prisma.model.findUnique({
    where: { id }
  });
  return model;
};

export const searchModels = async (query: string): Promise<Model[]> => {
  const models = await prisma.model.findMany({
    where: {
      isActive: true,
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        {
          AND: [
            { firstName: { contains: query.split(' ')[0] || '', mode: 'insensitive' } },
            { lastName: { contains: query.split(' ')[1] || '', mode: 'insensitive' } }
          ]
        }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });
  return models;
};

export const createModel = async (data: CreateModelData): Promise<Model> => {
  const model = await prisma.model.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      igProfileLink: data.igProfileLink || null,
      image: data.image,
      isActive: true
    }
  });
  return model;
};

export const updateModel = async (id: string, data: Partial<CreateModelData>): Promise<Model | null> => {
  try {
    const model = await prisma.model.update({
      where: { id },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.email && { email: data.email }),
        ...(data.igProfileLink !== undefined && { igProfileLink: data.igProfileLink || null }),
        ...(data.image && { image: data.image })
      }
    });
    return model;
  } catch (error) {
    return null;
  }
};

export const deleteModel = async (id: string): Promise<boolean> => {
  try {
    await prisma.model.update({
      where: { id },
      data: { isActive: false }
    });
    return true;
  } catch (error) {
    return false;
  }
};
