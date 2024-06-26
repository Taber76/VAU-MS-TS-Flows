import express from "express";
import CampaignController from "../controllers/campaign.controller";
import passport from "../middlewares/auth.mid";

// API /api/v1/campaign

export default express
  .Router()
  .post("/new", passport.authenticate("userJWT", { session: false }), CampaignController.newCampaign)
  .put("/update", passport.authenticate("userJWT", { session: false }), CampaignController.update)
  .get("/get-all", passport.authenticate("userJWT", { session: false }), CampaignController.getCampaignsByUserId)
  .get("/get/:id", passport.authenticate("userJWT", { session: false }), CampaignController.getCampaignById)
