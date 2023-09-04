import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { formatResponse, slugifyTitle } from '../utils/responseFormatter';
import { postService } from '../services';

import randomstring from 'randomstring';

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
  const { boardId, id } = req.query;
  const posts = await postService.getPosts(parseInt(boardId as string), parseInt(id as string));
  const lastId = posts[posts?.length - 1].postId;
  let isLast = false;
  if (posts.length < 5) {
    // 마지막 컨텐츠
    isLast = true;
  }

  res.send(formatResponse({ posts, lastId, isLast }, 200, 'Success', null));
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
