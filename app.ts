import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as SwaggerExpress from 'swagger-express-mw';
import * as swaggerUI from 'swagger-ui-express';
import * as YAML from 'yamljs';

export default class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.attachPackages();
  }

  private attachPackages() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.json());

    const swaggerDocument = YAML.load('./api/swagger/swagger.yaml');
    const options = {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
    };
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument, options));
  }

  public async setupAppFunctionaities() {
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

    console.info('Initialized database.');
  }
}

