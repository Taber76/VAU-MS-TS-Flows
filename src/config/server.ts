import express from 'express';
import cors from 'cors';
import { PORT, API_VERSION, CORS_ORIGIN } from './environment';
import campaignRoutes from '../routes/campaign.routes';
import oracleDBInstance from 'oracledb';

export default class Server {
  private app: express.Application;
  private server: any;

  constructor() {
    this.app = express();
    this.database();
    this.middlewares();
    this.routes();
  }

  private database() {
    const oracleDB = oracleDBInstance;
  }

  private middlewares() {
    this.app.use(cors({ origin: CORS_ORIGIN }));
    this.app.use(express.json());
  }

  private routes() {
    this.app.use(`/${API_VERSION}/campaign`, campaignRoutes);
  }

  public listen() {
    this.server = this.app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }

  public close() {
    this.server.close();
  }


}