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

const getPosts = async (
  boardId?: number,
  lastId?: number,
  postsCount?: number
): Promise<Post[]> => {
  //   if (await getUserByEmail(email)) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  //   }

  const posts = await prisma.post.findMany({
    take: postsCount ? postsCount + 1 : 5,
    skip: lastId ? 1 : 0,
    ...(lastId && { cursor: { postId: lastId } }),
    where: boardId ? { boardId: boardId } : undefined
  });
  console.log('posts=', posts);
  return posts;
};

const getTotalPostCount = async (boardId?: number): Promise<number> => {
  const where = boardId ? { boardId: boardId } : {};

  const totalCount = await prisma.post.count({
    where: where
  });

  return totalCount;
};
const getPostById = async (id: number): Promise<any> => {
  //   if (await getUserByEmail(email)) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  //   }
  return prisma.post.findUnique({
    where: { postId: id }
  });
};

const searchPosts = async (
  searchString?: string,
  page = 1, // 페이지 번호 (기본값: 1)
  pageSize = 5 // 페이지당 아이템 수 (기본값: 5)
): Promise<{ post: Post[]; totalCount: number }> => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const searchFilter = searchString
    ? {
        OR: [{ title: { contains: searchString } }, { content: { contains: searchString } }]
      }
    : {};

  const posts = await prisma.post.findMany({
    skip: skip || 0,
    take: take || 5,
    where: {
      //published: true, // You can modify this condition if needed
      ...searchFilter
    },
    include: {
      tags: {
        include: {
          tag: {
            select: {
              tagId: true, // Include 'tagId' field
              name: true, // Include 'name' field
              dateCreated: false // Include 'dateCreated' field
            }
          }
        }
      }
    }
  });
  const totalCount = await prisma.post.count({
    where: {
      ...searchFilter
    }
  });

  const modifiedPosts = posts.map((post) => ({
    ...post,
    tags: post.tags.map((tagWithSelect) => tagWithSelect.tag)
  }));

  //console.log('searched posts=', posts);
  return { post: modifiedPosts, totalCount };
};

export default {
  createPost,
  deletePost,
  updatePostSlug,
  getPosts,
  getPostById,
  getTotalPostCount,
  searchPosts
};
