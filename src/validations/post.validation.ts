import Joi from 'joi';

const register = {
  body: Joi.object().keys({
    title: Joi.string() // it should be a string
      .min(1) // at least 1 characters long
      .max(150) // at most 150 characters long
      .required(), // required field

    content: Joi.string() // it should be a string
      .min(1) // at least 1 characters long
      .required(), // required field
    boardId: Joi.number()
  })
};

export default {
  register
};
