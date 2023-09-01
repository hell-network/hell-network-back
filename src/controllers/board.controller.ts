import catchAsync from '../utils/catchAsync';
import { formatResponse } from '../utils/responseFormatter';
import { boardService } from '../services';

const getBoard = catchAsync(async (req, res) => {
  const board = await boardService.getBoard();
  res.send(formatResponse(board, 200, 'Success', null));
});

const createBoard = catchAsync(async (req, res) => {
  const { name, slug } = req.body;
  const board = await boardService.createBoard(name, slug);
  res.send(formatResponse(board, 200, 'Success', null));
});

export default {
  getBoard,
  createBoard
};
