import OracleDB from '../config/db';
import oracledb, { CLOB } from 'oracledb';
import { Campaign } from '../types/campaign.types';

class CampaignModel {
  private static instance: CampaignModel;
  private connection: oracledb.Connection | null = null;

  private constructor() {
    this.init();
  }

  private async init() {
    const db = await OracleDB.getInstance();
    this.connection = await db.getConnection();
  }

  private async ensureConnection() {
    if (!this.connection) {
      await this.init();
    } else {
      try {
        await this.connection.ping();
      } catch (err: any) {
        if (err.message.includes('NJS-500') || err.message.includes('NJS-521')) {
          console.error('Connection lost, attempting to reconnect...');
          await this.init();
        } else {
          throw err;
        }
      }
    }
  }


  public static getInstance(): CampaignModel {
    if (!CampaignModel.instance) {
      CampaignModel.instance = new CampaignModel();
    }
    return CampaignModel.instance;
  }

  // MAP ROW TO OBJECT --------------------------------------------------------
  private mapRowToCampaign(oracleResponse: any): Campaign {
    return {
      id: oracleResponse[0],
      title: oracleResponse[1],
      description: oracleResponse[2],
      active: oracleResponse[3],
      user_id: oracleResponse[4],
      nodes: JSON.parse(oracleResponse[5]),
      edges: JSON.parse(oracleResponse[6]),
      cover_video: oracleResponse[7],
      cover_image: oracleResponse[8],
      created_at: oracleResponse[9],
      updated_at: oracleResponse[10],
    };
  }

  // MAP ROW PARTIAL TO OBJECT (for get by user_id)---------------------------
  private mapRowPartialToCampaign(oracleResponse: any): Partial<Campaign> {
    return {
      id: oracleResponse[0],
      title: oracleResponse[1],
      description: oracleResponse[2],
      active: oracleResponse[3],
      cover_video: oracleResponse[4],
      cover_image: oracleResponse[5],
      created_at: oracleResponse[6],
      updated_at: oracleResponse[7],
    };
  }

  // CREATE -------------------------------------------------------------------
  public async create(campaign: Partial<Campaign>) {
    await this.ensureConnection();

    const createCampaign = `
      INSERT INTO campaigns (
        id, title, description, user_id, nodes, edges
      )
      VALUES (
        :id, :title, :description, :user_id, :nodes, :edges
      )
    `;

    try {
      await this.connection?.execute(createCampaign, {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        user_id: campaign.user_id,
        nodes: JSON.stringify(campaign.nodes),
        edges: JSON.stringify(campaign.edges),
      });
      await this.connection?.commit();
      console.log('Campaign created successfully.');
      return campaign;
    } catch (error) {
      console.error('Error inserting record:', error);
      if (this.connection) {
        await this.connection.rollback();
      }
      throw error;
    }
  }

  // FIND BY USER_ID -----------------------------------------------------------
  public async findByUserId(user_id: string) {
    await this.ensureConnection();
    const query = 'SELECT id, title, description, active, cover_video, cover_image, created_at, updated_at FROM campaigns WHERE user_id = :user_id';
    try {
      const result = await this.connection?.execute(query, { user_id });
      if (result && result.rows && result.rows.length > 0)
        return result.rows.map((row) => this.mapRowPartialToCampaign(row));
      return null;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }


  // FIND BY ID -----------------------------------------------------------
  public async findById(id: string) {
    await this.ensureConnection();
    const query = 'SELECT * FROM campaigns WHERE id = :id';
    try {
      const result = await this.connection?.execute(query, { id });
      if (result && result.rows && result.rows.length > 0)
        return this.mapRowToCampaign(result.rows[0]);
      return null;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }


  // UPDATE -------------------------------------------------------------------
  public async update(campaign: Partial<Campaign>) {
    await this.ensureConnection();

    const fields = [];
    const params: { [key: string]: any } = {};

    if (campaign.title) {
      fields.push('title = :title');
      params.name = campaign.title;
    }
    if (campaign.description) {
      fields.push('description = :description');
      params.description = campaign.description;
    }
    if (campaign.active) {
      fields.push('active = :active');
      params.active = campaign.active;
    }
    if (campaign.nodes) {
      fields.push('nodes = :nodes');
      params.nodes = JSON.stringify(campaign.nodes);
    }
    if (campaign.edges) {
      fields.push('edges = :edges');
      params.edges = JSON.stringify(campaign.edges);
    }
    if (campaign.cover_video) {
      fields.push('cover_video = :cover_video');
      params.cover_video = campaign.cover_video;
    }
    if (campaign.cover_image) {
      fields.push('cover_image = :cover_image');
      params.cover_image = campaign.cover_image;
    }

    //fields.push('updated_at = CURRENT_TIMESTAMP');

    const updateCampaign = `
      UPDATE campaigns
      SET ${fields.join(', ')}
      WHERE id = :id, user_id = :user_id`;

    params.id = campaign.id;
    params.user_id = campaign.user_id;

    try {
      const result = await this.connection?.execute(updateCampaign, params);
      await this.connection?.commit();
      if (result && result.rows && result.rows.length > 0) {
        return this.mapRowToCampaign(result.rows[0]);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error updating record:', error);
      if (this.connection) {
        await this.connection.rollback();
      }
      throw error;
    }
  }

  // CLOSE CONNECTION --------------------------------------------------------
  public async closeConnection() {
    if (this.connection) {
      try {
        await this.connection.close();
        console.log('Connection closed.');
      } catch (error) {
        console.error('Error closing connection:', error);
        throw error;
      }
    }
  }


}

export default CampaignModel.getInstance();
