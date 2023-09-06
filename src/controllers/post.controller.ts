import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { formatResponse, slugifyTitle } from '../utils/responseFormatter';
import { postService } from '../services';

import randomstring from 'randomstring';
import pick from '../utils/pick';

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.body;

  const deletedPost = await postService.deletePost(id);
  return deletedPost;
});

const register = catchAsync(async (req, res) => {
  const { title, content } = req.body;

  const post = await postService.createPost(title, content, randomstring.generate(12));
  const finalSlug = slugifyTitle(post.postId, title);
  console.log('title = ', post.postId, title);
  // 3. Update the post with the new slug.
  const updatedPost = await postService.updatePostSlug(post.postId, finalSlug);

  res
    .status(httpStatus.CREATED)
    .send(formatResponse(updatedPost, httpStatus.CREATED, 'Success', null));
});

const getPosts = catchAsync(async (req, res) => {
  const { boardId: queryBoardId, id: queryId, postsCount: queryPostsCount } = req.query;
  const boardId = queryBoardId ? parseInt(String(queryBoardId), 10) : undefined;
  const id = queryId ? parseInt(String(queryId), 10) : undefined;
  const postsCount = queryPostsCount ? parseInt(String(queryPostsCount), 10) : 5;

  const posts = await postService.getPosts(boardId, id, postsCount);
  let isLast = false;
  if (posts.length - 1 < postsCount) {
    // 마지막 컨텐츠
    isLast = true;
  }

  const postsSlice = posts.slice(0, postsCount);
  const lastId = posts[postsSlice?.length - 1]?.postId;

  res.send(formatResponse({ posts: postsSlice, lastId, isLast }, 200, 'Success', null));
});

const getPostById = catchAsync(async (req, res) => {
  const { id } = req.query;
  const post = await postService.getPostById(parseInt(id as string));
  res.send(formatResponse(post, 200, 'Success', null));
});

export default {
  register,
  deletePost,
  getPosts,
  getPostById
};
