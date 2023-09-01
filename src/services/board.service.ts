import { Board, Prisma } from '@prisma/client';
import prisma from '../client';

const getBoard = async (): Promise<Board[]> => {
  return prisma.board.findMany();
};

const createBoard = async (name: string, slug: string): Promise<Board> => {
  console.log(name);
  return prisma.board.create({
    data: {
      name,
      slug
    }
  });
};

export default {
  createBoard,
  getBoard
};
