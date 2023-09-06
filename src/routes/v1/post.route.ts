import express from 'express';
import validate from '../../middlewares/validate';
import postValidation from '../../validations/post.validation';
import { postController } from '../../controllers';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/', validate(postValidation.register), postController.register);
router.post('/deletePost', postController.deletePost);

router.get('/getPosts', postController.getPosts);
router.get('/getPostById', postController.getPostById);
router.get('/searchPosts', postController.searchPosts);

export default router;
