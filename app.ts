import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as SwaggerExpress from 'swagger-express-mw';
import * as swaggerUI from 'swagger-ui-express';
import * as YAML from 'yamljs';
import expressJWT from 'express-jwt';
import { initConfig } from './config';
import { connect } from 'mongoose';
import * as dotenv from 'dotenv';
import {checkRoleAndUserExistOrNot} from './api/onBoard/onBoard';
export default class App {
  private app: express.Application;
  private config: any;

  constructor() {
    this.app = express();
    this.attachPackages();
    dotenv.config();
  }

  private attachPackages() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));

    const swaggerDocument = YAML.load('./api/swagger/swagger.yaml');
    const options = {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
    };
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument, options));
  }

  public async setupAppFunctionaities() {
    this.config = initConfig();
    this.app.use(
      cors({
        credentials: true,
        origin: true,
      })
    );

    this.app.use(
      expressJWT({
        secret: this.config.jwt.jwtSecret,
        algorithms: this.config.algorithms.HMAC,
        credentialsRequired: false,
        requestProperty: 'user',
        getToken: (req: { cookies: { token: any } }) => {
          return req.cookies.token ? req.cookies.token : null;
        },
      })
    );

    //register swaggger
    await new Promise<void>((resolve, reject) => {
      SwaggerExpress.create({ appRoot: __dirname }, (err, swaggerExpress) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          swaggerExpress.register(this.app);//main registering the app
          console.log('Swagger registered successfully');
          resolve();
        }
      });
    });
  }

  public getApp() {
    return this.app;
  }

  public async connectDatabase() {
    try {
      const mongoUri: string = process.env.MONGO_URI || '';
      console.info('Initializing database...');
      await connect(mongoUri);
      console.info('Initialized database.');
      checkRoleAndUserExistOrNot();
    } catch(err) {
      console.error(err);
    }
    
  }
}

