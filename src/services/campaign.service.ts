import { v4 as uuidv4 } from 'uuid';
import campaignModelInstance from "../models/campaign.model";
import { type Campaign } from "../types/campaign.types";
import CampaignHelper from '../helpers/campaign.helper';


export default class CampaignService {

  // NEW CAMPAIGN -------------------------------------------------------------
  public static async newCampaign(campaign: Partial<Campaign>) {
    if (!campaign.title || !campaign.description || !campaign.user_id) {
      return { success: false, message: 'Missing required fields.' }
    }
    try {
      campaign.id = uuidv4();
      const { nodes, edges } = await CampaignHelper.defaultNodesAndEdges();
      const createdCampaign = await campaignModelInstance.create({ ...campaign, nodes, edges });

      return { success: true, message: 'Campaign created successfully.', campaign: createdCampaign };
    } catch (error) {
      console.error('Error creating campaign:', error);
      return { success: false, message: `Internal server error creating campaign. Error: ${error}` };
    }
  }


  // GET CAMPAIGN BY ID -----------------------------------------------------------
  public static async getCampaignById(id: string) {
    try {
      const campaign = await campaignModelInstance.findById(id);
      if (!campaign) return { success: false, message: 'Campaign not found.' }
      return { success: true, message: 'Campaign found successfully.', campaign };
    } catch (error) {
      console.error('Error finding campaign:', error);
      return { success: false, message: `Internal server error finding campaign. Error: ${error}` };
    }
  }

  // GET CAMPAIGNS BY USER ID -----------------------------------------------------------
  public static async getCampaignsByUserId(user_id: string) {
    try {
      const campaigns = await campaignModelInstance.findByUserId(user_id);
      if (!campaigns) return { success: false, message: 'Campaigns not found.' }
      return { success: true, message: 'Campaigns found successfully.', campaigns };
    } catch (error) {
      console.error('Error finding campaigns:', error);
      return { success: false, message: `Internal server error finding campaigns. Error: ${error}` };
    }
  }

  // UPDATE -------------------------------------------------------------------
  public static async update(campaign: Partial<Campaign>) {
    try {
      if (!campaign.id) return { success: false, message: 'Missing required fields.' }
      const updatedCampaign = await campaignModelInstance.update(campaign);
      if (!updatedCampaign) return { success: false, message: 'Campaign not found or user not authorized.' }
      return { success: true, message: 'Campaign updated successfully.', campaign: updatedCampaign };
    } catch (error) {
      console.error('Error updating campaign:', error);
      return { success: false, message: `Internal server error updating campaign. Error: ${error}` };
    }
  }


}