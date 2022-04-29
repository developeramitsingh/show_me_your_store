import * as dotenv from 'dotenv';
import App from './app';
import express from 'express';

dotenv.config();

if (!process.env.PORT) {
    console.log('Port not found');
    process.exit(1);
}

async function start(): Promise<any> {
    const application = new App();

    await application.setupAppFunctionaities();// swagger registered
    const app: express.Application = application.getApp();
  
    application.connectDatabase(); //db connect
  
    const PORT: number = parseInt(process.env.PORT as string, 10);
  
    app.listen(PORT, () => {
      console.info(`Server started at http://localhost:${PORT}`);
    });
}
  
start();