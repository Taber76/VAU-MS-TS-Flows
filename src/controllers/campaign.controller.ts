import { type Request, type Response } from "express";
import CampaignService from "../services/campaign.service";

export default class CampaignController {

  public static async newCampaign(req: Request, res: Response) {
    try {
      const serviceResponse = await CampaignService.newCampaign({ ...req.body, user_id: req.user });
      if (serviceResponse.success === false) {
        res.status(400).json(serviceResponse);
        return;
      }
      res.status(201).json(serviceResponse);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public static async getCampaignById(req: Request, res: Response) {
    try {
      const serviceResponse = await CampaignService.getCampaignById(req.params.id);
      if (serviceResponse.success === false) {
        res.status(400).json(serviceResponse);
        return;
      }
      res.status(200).json(serviceResponse);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public static async getCampaignsByUserId(req: Request, res: Response) {
    try {
      const serviceResponse = await CampaignService.getCampaignsByUserId(req.user as string);
      if (serviceResponse.success === false) {
        res.status(400).json(serviceResponse);
        return;
      }
      res.status(200).json(serviceResponse);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      const serviceResponse = await CampaignService.update({ ...req.body, user_id: req.user });
      if (serviceResponse.success === false) {
        res.status(400).json(serviceResponse);
        return;
      }
      res.status(200).json(serviceResponse);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

}