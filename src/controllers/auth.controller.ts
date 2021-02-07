import { compare, hash } from 'bcryptjs';
import express from 'express';
import { verify } from 'jsonwebtoken';
import { LoginRequest } from 'src/interfaces/auth/login';
import { RegisterRequest } from 'src/interfaces/auth/register';
import { User } from '../entity/User';
import { createAccessToken, createRefreshToken, sendRefreshToken } from '../utils/auth';

const router = express.Router();

router.post('/login', async (req, res) => {
  const payload: LoginRequest = req.body;
  const user = await User.findOne({
    where: { email: payload.email },
  });
  if (!user) {
    return res.status(400).send({
      message: 'invalid email or password',
    });
  }

  const valid = await compare(payload.password, user.password);
  if (!valid) {
    return res.status(400).send({
      message: 'invalid email or password',
    });
  }

  const token = createRefreshToken(user);
  sendRefreshToken(res, token);

  return res.send({
    accessToken: createAccessToken(user),
  });
})

router.post('/register', async (req, res) => {
  const payload: RegisterRequest = req.body;
  const user = await User.findOne({ where: { email: payload.email }});
  if (user) {
    return res.status(409).send({
      message: 'user already exists!',
    });
  }
  
  const hashed = await hash(payload.password, 12);
  try {
    await User.insert({
      email: payload.email,
      password: hashed,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: 'insert failed.'
    })
  }

  return res.status(201).send({
    message: 'user created',
  });
})

router.post('/refresh_token', async (req, res) => {
  const token = req.cookies.jid;
  if (!token) {
    return res.status(400).send({
      accessToken: '',
    });
  }

  let payload: any = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    console.error(err);
    return res.status(400).send({
      accessToken: '',
    });
  }

  const user = await User.findOne({ id: payload.userId });
  if (!user) {
    return res.status(400).send({
      accessToken: '',
    });
  }

  const refreshToken = createRefreshToken(user);
  sendRefreshToken(res, refreshToken);

  return res.send({
    accessToken: createAccessToken(user),
  });
})

export default router;