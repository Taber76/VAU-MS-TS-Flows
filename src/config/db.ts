import oracledb from 'oracledb';
import { DB_USER, DB_PASS, DB_STRING } from './environment';

class OracleDB {
  private static instance: OracleDB;
  private pool: oracledb.Pool | null = null;

  private constructor() { }

  public static async getInstance(): Promise<OracleDB> {
    if (!OracleDB.instance) {
      OracleDB.instance = new OracleDB();
      await OracleDB.instance.connect();
    }
    return OracleDB.instance;
  }

  private async connect(): Promise<void> {
    try {
      this.pool = await oracledb.createPool({
        user: DB_USER,
        password: DB_PASS,
        connectionString: DB_STRING,
        poolMin: 1,
        poolMax: 10,
        poolIncrement: 1,
        poolTimeout: 60
      });
      console.log('Connected to Oracle database');
    } catch (err) {
      console.error('Unable to connect to the database:', err);
    }
  }

  public async getConnection(): Promise<oracledb.Connection | null> {
    if (!this.pool) {
      console.error('Connection pool has not been created.');
      return null;
    }

    try {
      const connection = await this.pool.getConnection();
      return connection;
    } catch (err) {
      console.error('Unable to get connection from pool:', err);
      console.log('Attempting to reconnect to the database...');
      await this.reconnect();
      return null;
    }
  }

  private async reconnect(): Promise<void> {
    await this.close();
    await this.connect();
  }

  public async close(): Promise<void> {
    if (this.pool) {
      try {
        await this.pool.close(10);
        console.log('Connection pool to Oracle database closed');
      } catch (err) {
        console.error('Error closing the connection pool:', err);
      }
    }
  }
}

export default OracleDB;

