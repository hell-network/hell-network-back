// utils/responseFormatter.ts

import { Response } from 'express';
import slugify from 'slugify';

export interface IDefaultResponse {
  result: any;
  code: number;
  message: string;
  error: any;
}

export const formatResponse = (
  data: any,
  code: number,
  message: string,
  error: any
): IDefaultResponse => {
  return {
    result: data,
    code: code,
    message: message,
    error: error
  };
};

export const sendResponse = (
  res: Response,
  data: any,
  code: number,
  message: string,
  error: any
) => {
  res.status(code).send(formatResponse(data, code, message, error));
};

function toBase62(num: number) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (num === 0) return chars[0];

  let result = '';
  while (num) {
    result = chars[num % 62] + result;
    num = Math.floor(num / 62);
  }

  return result;
}

export const slugifyTitle = (id: number, title: string) => {
  const slug = slugify(title, {
    lower: true, // convert to lower case
    strict: true, // strip special characters
    replacement: '-' // use hyphens as replacement
  });
  const base62ID = toBase62(id);
  const finalSlug = `${slug}-${base62ID}`;
  return finalSlug;
};
