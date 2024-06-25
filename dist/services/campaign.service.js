"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const campaign_model_1 = __importDefault(require("../models/campaign.model"));
const campaign_helper_1 = __importDefault(require("../helpers/campaign.helper"));
class CampaignService {
    // NEW CAMPAIGN -------------------------------------------------------------
    static newCampaign(campaign) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!campaign.title || !campaign.description || !campaign.user_id) {
                return { success: false, message: 'Missing required fields.' };
            }
            try {
                campaign.id = (0, uuid_1.v4)();
                const { nodes, edges } = yield campaign_helper_1.default.defaultNodesAndEdges();
                const createdCampaign = yield campaign_model_1.default.create(Object.assign(Object.assign({}, campaign), { nodes, edges }));
                return { success: true, message: 'Campaign created successfully.', campaign: createdCampaign };
            }
            catch (error) {
                console.error('Error creating campaign:', error);
                return { success: false, message: `Internal server error creating campaign. Error: ${error}` };
            }
        });
    }
    // GET CAMPAIGN BY ID -----------------------------------------------------------
    static getCampaignById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield campaign_model_1.default.findById(id);
                if (!campaign)
                    return { success: false, message: 'Campaign not found.' };
                return { success: true, message: 'Campaign found successfully.', campaign };
            }
            catch (error) {
                console.error('Error finding campaign:', error);
                return { success: false, message: `Internal server error finding campaign. Error: ${error}` };
            }
        });
    }
    // GET CAMPAIGNS BY USER ID -----------------------------------------------------------
    static getCampaignsByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaigns = yield campaign_model_1.default.findByUserId(user_id);
                if (!campaigns)
                    return { success: false, message: 'Campaigns not found.' };
                return { success: true, message: 'Campaigns found successfully.', campaigns };
            }
            catch (error) {
                console.error('Error finding campaigns:', error);
                return { success: false, message: `Internal server error finding campaigns. Error: ${error}` };
            }
        });
    }
}
exports.default = CampaignService;
