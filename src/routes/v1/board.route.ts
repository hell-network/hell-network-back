import express from 'express';

import { boardController } from '../../controllers';

const router = express.Router();

router.post('/', boardController.createBoard);
router.get('/getBoard', boardController.getBoard);

export default router;
