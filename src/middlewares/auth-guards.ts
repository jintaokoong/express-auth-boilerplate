import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export const AuthGuard = (req: Request, res: Response, next: any) => {
  const authorization = req.headers['authorization'];
  if (!authorization) {
    return res.status(403).send({
      message: 'unauthorized',
    });
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    res.locals.user = payload;
  } catch (err) {
    console.error(err);
    return res.status(403).send({
      message: 'unauthorized',
    });
  }
  
  return next();
}