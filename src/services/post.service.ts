import { Post, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';

/**
 * Create a user
 * @param {Object} postBody
 * @returns {Promise<Post>}
 */
const createPost = async (title: string, content: string, slug: string): Promise<Post> => {
  return prisma.post.create({
    data: {
      title,
      boardId: 1,
      userId: 1,
      content,
      slug
    }
  });
};

const updatePostSlug = async (postId: number, slug: string) => {
  return await prisma.post.update({
    where: { postId },
    data: { slug }
  });
};

const deletePost = async (postId: number): Promise<Post> => {
  return prisma.post.delete({
    where: {
      postId
    }
  });
};

const getPosts = async (boardId?: number, lastId?: number): Promise<Post[]> => {
  //   if (await getUserByEmail(email)) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  //   }
  return prisma.post.findMany({
    take: 5,
    skip: lastId ? 1 : 0,
    ...(lastId && { cursor: { postId: lastId } }),
    where: boardId ? { boardId: boardId } : undefined
  });
};

const getPostById = async (id: number): Promise<any> => {
  //   if (await getUserByEmail(email)) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  //   }
  return prisma.post.findUnique({
    where: { postId: id }
  });
};

export default {
  createPost,
  deletePost,
  updatePostSlug,
  getPosts,
  getPostById
};
