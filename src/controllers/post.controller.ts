import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { formatResponse, slugifyTitle } from '../utils/responseFormatter';
import { postService } from '../services';

import randomstring from 'randomstring';

const register = catchAsync(async (req, res) => {
  const { title, content } = req.body;

  const post = await postService.createPost(title, content, randomstring.generate(12));
  const finalSlug = slugifyTitle(post.postId, title);
  // 3. Update the post with the new slug.
  const updatedPost = await postService.updatePostSlug(post.postId, finalSlug);

  res
    .status(httpStatus.CREATED)
    .send(formatResponse(updatedPost, httpStatus.CREATED, 'Success', null));
});

const getPosts = catchAsync(async (req, res) => {
  const { boardId, id } = req.query;
  console.log(id, req);
  const posts = await postService.getPosts(parseInt(boardId as string), parseInt(id as string));

  res.send(formatResponse(posts, 200, 'Success', null));
});

const getPostById = catchAsync(async (req, res) => {
  const { id } = req.query;
  const post = await postService.getPostById(parseInt(id as string));
  res.send(formatResponse(post, 200, 'Success', null));
});

export default {
  register,
  getPosts,
  getPostById
};
