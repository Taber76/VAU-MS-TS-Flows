"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaign_controller_1 = __importDefault(require("../controllers/campaign.controller"));
const auth_mid_1 = __importDefault(require("../middlewares/auth.mid"));
// API /api/v1/campaign
exports.default = express_1.default
    .Router()
    .post("/new", auth_mid_1.default.authenticate("userJWT", { session: false }), campaign_controller_1.default.newCampaign)
    .get("/get-all", auth_mid_1.default.authenticate("userJWT", { session: false }), campaign_controller_1.default.getCampaignsByUserId)
    .get("/get/:id", auth_mid_1.default.authenticate("userJWT", { session: false }), campaign_controller_1.default.getCampaignById);
