import { User } from "src/entity/User"
import { sign } from 'jsonwebtoken';
import { Response } from 'express';

export const createRefreshToken = (user: User) => {
  const payload = {
    userId: user.id
  };
  return sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
}

export const createAccessToken = (user: User) => {
  const payload = {
    userId: user.id
  };
  return sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
}

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('jid', token, {
    path: '/auth/refresh_token',
    httpOnly: true,
    expires: new Date(Date.now() + 604800000),
    secure: true,
  });
}