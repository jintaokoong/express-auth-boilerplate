import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {createConnection} from "typeorm";
import userController from './controllers/user.controller';
import authController from './controllers/auth.controller';

(
  async () => {
    const app = express();
    app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }));
    app.use(cookieParser());
    app.use(express.json());
    
    app.get('/', (_req, res) => {
      res.send('service is up!');
    })
    
    app.use('/user', userController);
    app.use('/auth', authController);

    await createConnection();
    app.listen(4000, () => {
      console.log('listening to port 4000');
    })
   
    process.on('SIGINT', function() {
      console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
      // some other closing procedures go here
      process.exit(1);
    });
  }
)()